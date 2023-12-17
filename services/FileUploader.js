import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Fragment } from "react";
import Dropzone from "react-dropzone";
import { ArrowDown, ArrowUp, File, XCircle, FileText } from "react-feather";
import FileProgressBar from "./FileProgressBar";
import { Col, Row } from "reactstrap";
import toast from "react-hot-toast";

import { v4 as uuidv4 } from "uuid";

import { S3Service, UtilityService } from "../../services";
import { FormattedMessage, useIntl } from "react-intl";

const filesHandler = (images) => {
  return images.map((image, id) => {
    return {
      id: id + 1,
      progress: 100,
      name: image.replaceAll("%", "").split("/").pop(),
      isCompleted: true,
    };
  });
};

const FileUploader = forwardRef(
  (
    {
      isSm = false,
      maxFiles = 5,
      isFileLimit = true,
      accept = "image/*",
      ...props
    },
    ref
  ) => {
    const intl = useIntl();
    const message = (msg) => {
      return intl.formatMessage({
        id: msg,
        defaultMessage: msg,
      })
    }
    const [attachment, setAttachment] = useState(props.images || []);
    const [uploadProgress, setUploadProgress] = useState(
      filesHandler(props.images || [])
    );
    const [images, setImages] = useState(filesHandler(props.images || []));
    const imagesRef = useRef();
    imagesRef.current = images;

    useImperativeHandle(ref, () => ({
      clear: () => {
        setAttachment([]);
        setUploadProgress([{ progress: 0, id: 1 }]);
        setImages([]);
      },
      setImages: (imgs) => {
        setAttachment(imgs);
        setImages(filesHandler(imgs || []));
        setUploadProgress(filesHandler(imgs || []) || [{ progress: 0, id: 1 }]);
      },
      checkIsAllFilesUploaded: () => {
        let up = uploadProgress.filter((i) => i.id);
        if (up.length) {
          return up.reduce((r, c) => r && c.isCompleted, true);
        } else {
          return true;
        }
      },
    }));

    const callBackS3 = (data) => {
      setAttachment((atach) => {
        props.handleChange([...atach, data.Location]);
        return [...atach, data.Location];
      });
    };

    //delete files
    const handleDelete = (id) => {
      const filteredFiles = attachment?.filter((file, index) => index !== id);
      const filterImage = images?.filter((file, index) => index !== id);
      setImages(filterImage);
      setAttachment(filteredFiles);

      props.handleChange(filteredFiles);
    };

    const thumbs = images?.map((file, index) => {
      let progress = uploadProgress?.filter((item) => item?.id === file?.id);
      let isCompleted = false;
      if (progress.length > 0) {
        isCompleted = progress[0]?.isCompleted;
        progress = progress[0].progress;
      } else {
        progress = 0;
      }
      let uploadedImage = props.value?.filter((item) => item?.id === file?.id);
      if (uploadedImage?.length > 0) {
        uploadedImage = uploadedImage[0];
      } else {
        uploadedImage = {};
      }
      const fileName =
        file.name.length > 9
          ? file.name.substr(file.name.length - 9)
          : file.name;

      if (isSm) {
        return (
          <div key={index} style={{ width: 105 }}>
            <a href={"#"}>
              <div className="fileImageBg">
                <FileText />
                <span>{progress}%</span>
                <XCircle
                  size={15}
                  onClick={() => handleDelete(index)}
                  className="curser-pointer"
                  style={{
                    position: "absolute",
                    marginTop: -10,
                    marginRight: 10,
                  }}
                />
              </div>
              <span>{fileName?.toLowerCase?.()}</span>
            </a>
          </div>
        );
      } else {
        return (
          <div className="w-100 d-flex flex-row " key={index}>
            <div className="fileView">
              <a href={file} target="_blank">
                <div className="fileImageBg">
                  <FileText />
                </div>
              </a>
              <div className="custom_slide">
                <FileProgressBar
                  value={progress}
                  filename={file.name}
                  isCompleted={isCompleted}
                />
              </div>
              <div>
                <XCircle
                  onClick={() => handleDelete(index)}
                  className="curser-pointer"
                />
              </div>
            </div>
          </div>
        );
      }
    });

    const onUploadingComplete = props.onUploadingComplete;
    const onUploadingStart = props.onUploadingStart;
    const dropZone = props.isAllFiles ? "" : "image/*";
    const inputTypes = props.isAllFiles
      ? ""
      : "image/png, image/jpg, image/jpeg;";

    return (
      <Fragment>
        <Dropzone
          accept={dropZone}
          maxFiles={isFileLimit ? maxFiles : 10000000}
          onDrop={async (acceptedFiles) => {
            let isInternet = await UtilityService.checkInternet();
            if (isInternet) {
              if (
                imagesRef.current.length + acceptedFiles.length <
                maxFiles + 1 ||
                !isFileLimit
              ) {
                setImages((imgs) => [...imgs, ...acceptedFiles]);

                acceptedFiles.forEach((file) => {
                  const randomID = uuidv4();

                  file.id = randomID;
                  props?.onUploadingStart?.();
                  S3Service.uploadFile(
                    file,
                    (data) => {
                      setUploadProgress((up) => {
                        up.map((upProgress) => {
                          if (upProgress.id === randomID) {
                            upProgress.isCompleted = true;
                            upProgress.progress = 100;
                          }
                        });

                        return [...up];
                      });
                      callBackS3(data);
                      setTimeout(() => {
                        onUploadingComplete?.();
                      }, 100);
                    },
                    (e) => {
                      onUploadingStart?.();

                      setUploadProgress((up) => {
                        let check = true;
                        up.map((upProgress) => {
                          if (upProgress.id === randomID) {
                            check = false;
                            upProgress.progress = e > 99 ? 99 : e;
                          }
                        });
                        if (check) {
                          return [
                            ...up,
                            { progress: e, id: randomID, isCompleted: false },
                          ];
                        } else {
                          return [...up];
                        }
                      });
                    }
                  );
                });
              } else {
                toast.error(
                  message(`Sorry, You can not upload more than ${maxFiles} images`)
                );
              }

              // convertToBase64(acceptedFiles);
              // uploadFileS3(acceptedFiles[0], callBackS3, (e) => {
              //   setProgress(e);
              // });
            } else {
              toast.error(message("Internet not available!"));
            }
          }}
        >
          {({ getRootProps, getInputProps }) =>
            isSm ? (
              <section>
                <div {...getRootProps()} className="Attachment-sm mb-1 ">
                  <input {...getInputProps()} accept={inputTypes} />
                  <div className="d-flex align-items-center">
                    <div className="roundImage-sm">
                      <File />
                    </div>
                    <p style={{ padding: 0, margin: 0, marginLeft: 10 }}>
                      <FormattedMessage
                        defaultMessage="Click here to select from storage"
                        id="Click here to select from storage"
                      />
                    </p>
                  </div>
                </div>
                <Row>{thumbs}</Row>
              </section>
            ) : (
              <section>
                <div {...getRootProps()} className="Attachment mb-1 ">
                  <input {...getInputProps()} accept={inputTypes} />
                  <div className="d-flex justify-content-center">
                    <div className="roundImage">
                      <File />
                    </div>
                  </div>
                  <p className="text-center mt-1">
                    <FormattedMessage
                      defaultMessage="Drop your images here to upload"
                      id="Drop your images here to upload"
                    />
                  </p>
                  <p className="text-center">
                    <FormattedMessage
                      defaultMessage="or click here to select from storage"
                      id="or click here to select from storage"
                    />
                  </p>
                </div>
                <aside>{thumbs}</aside>
              </section>
            )
          }
        </Dropzone>
      </Fragment>
    );
  }
);
export default FileUploader;
