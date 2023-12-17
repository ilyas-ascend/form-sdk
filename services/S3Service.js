const AWS = require("aws-sdk");

const config = {
  bucketName: "eod-wasfaty",
  dirName: "media",
  region: "eu-west-1",
  accessKeyId: "mZ8qQFKtC9",
  secretAccessKey: "cSBw4ihOU4",
  endpoint: "https://storage.ascend.com.sa/",
};

class Service {
  constructor() { }

  uploadFile(file, callBackS3, progressCB) {
    if (file) {
      console.log("Upload file");
      const s3 = new AWS.S3({
        ...config,
        s3ForcePathStyle: true,
        signatureVersion: "v4",
        ContentDisposition: "attachment;filename=" + file?.name,
      });
      const params = {
        Bucket: config.bucketName,
        Key: `${Date.now()}_${file?.name}`,
        Body: file,
        ACL: "public-read",
      };

      return s3
        .upload(params, function (err, data) {
          if (data) callBackS3(data);
        })

        .on("httpUploadProgress", function (progress) {
          let progressPercentage = Math.round(
            (progress.loaded / progress.total) * 100
          );
          progressCB(progressPercentage);
        });
    }
  }
}
const S3Service = new Service()

export default S3Service
