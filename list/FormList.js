import { Fragment, useEffect, useState } from "react";
import {
  Row,
  Col,
  Modal,
  ModalBody,
  Button,
  Label,
  Input,
  FormFeedback,
  ModalHeader,
  FormGroup,
} from "reactstrap";
import List from "../components/listing/List";
import Dropdown from "../components/Dropdown";
import FormService from "../services/FormService";
import get from "lodash/get";
import startCase from "lodash/startCase";

import moment from "moment";
import "./style.scss";
import toast from "react-hot-toast";
import { MoreVertical, Plus } from "react-feather";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);
import { getUserData } from "@utils";
import ListHeader from "../components/ListHeader";
import { FormattedMessage } from "react-intl";
import { observer } from "mobx-react";
import { FormBuilderModel } from "../models/FormBuilderModel";
import FileUploader from "../components/FileUpload/FileUploader";
import { useRef } from "react";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const ListComponent = observer(() => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState();

  const user = getUserData();
  const type = user.type?.toLowerCase();
  const userId = user._id;
  const canEditDelete = ["admin"].includes(type);
  const canView = ["moderator"].includes(type);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setpagination] = useState({
    page: 0,
    pageCount: 0,
    to: 0,
    totalPages: 0,
  });

  const [filter, setFilter] = useState({
    search: "",
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(false);

  const [createModalStates, setCreateModalstates] = useState(
    () => new FormBuilderModel()
  );

  const getAllItems = (query = { selected: 0 }) => {
    setIsLoading(true);
    setLoading(true);

    const params = {
      page: query.selected + 1,
      per_page: 10,
      //filters
      ...filter,
    };

    FormService.find(params)
      .then((res) => {
        if (res?.data?.data) {
          setItems(
            res.data.data.data.map((item) => {
              item.site =
                (item.site?._id ? item.site : item.obligation_site) || {};

              delete item.obligation_site;
              return item;
            })
          );
          const _pagination = res.data.data;
          const page = _pagination.current_page;
          const perpage = _pagination.per_page;
          const totalPages = _pagination.total;
          const pageCount = Math.ceil(totalPages / perpage);

          const to = _pagination.to;

          setpagination({
            page,
            pageCount,
            totalPages,
            to,
          });
          setLoading(false);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setIsLoading(false);
      });
  };

  const showData = (e) => {
    navigate(`/${e}/Form-Builder/Add/`);
  };

  const updateStatus = (id, status) => {
    FormService.SC.postCall({
      url: `form/change-status`,
      data: { id, status },
    }).then((res) => {
      if (res.status == 200) {
        setTimeout(() => {
          toast.success(res.data.data);
        }, 100);
        getAllItems({ isFromSearch: false, selected: pagination.page - 1 });
      }
    });
  };

  const DeleteData = (id) => {
    MySwal.fire({
      html: "<p class='confirm-class-head' >Are you sure you want to delete?</p>",
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Ok",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        FormService.delete(id).then((res) => {
          if (res.status === 200) {
            getAllItems({
              selected: pagination.page - 1,
            });
            try {
              toast.success(res.data.data.data || res.data.data);
            } catch (error) {
              toast.success("Form deleted successfully!");
            }
          } else {
            if (res.errors) {
              toast.error(error);
            }
          }
        });
      }
    });
  };
  const basicColumns = [
    {
      name: "Name",
      sortable: true,
      cell: (row) => <span>{get(row, "name", "")}</span>,
    },
    {
      name: "Logo",
      sortable: true,
      cell: (row) =>
        row.icon && (
          <img src={row.saved_icon || row.icon} width={50} height={50} />
        ),
    },
    {
      name: "Creation Date",
      disableStartCase: true,
      sortable: true,
      cell: (row) => (
        <span>
          {moment(row.created_at).format("DD-MM-YYYY")}{" "}
          <span style={{ fontWeight: "bold" }}>
            {moment(row.created_at).format("h:mm")}
          </span>
        </span>
      ),
    },
    {
      name: "Status",
      width: "300px",
      header: (props) => (
        <th style={{ textAlign: "center" }}>{props.children}</th>
      ),
      cell: (row) => {
        return (
          <FormGroup switch>
            <Input
              style={{ cursor: "pointer" }}
              type="switch"
              role="switch"
              checked={!!row.status}
              onChange={(e) => updateStatus(row._id, e.target.checked)}
            />
          </FormGroup>
        );
      },
    },

    {
      name: "ACTION",
      sortable: false,
      cell: (row) => (
        <>
          {(canEditDelete ||
            canEditDelete ||
            canView ||
            row?.user?._id === userId) && (
            <MoreVertical
              style={{ marginLeft: 10, cursor: "pointer" }}
              onClick={(e) => {
                setSelectedRow({
                  ...row,
                  clientX: e.clientX,
                  clientY: e.clientY,
                });
              }}
            />
          )}
        </>
      ),
    },
  ];

  const ValidationHandler = observer(
    ({ isValid, message = `"This field is required!"` }) => {
      return (
        <>
          <Input
            type="text"
            hidden
            invalid={!isValid && createModalStates.createValidation}
          />

          <FormFeedback>
            <FormattedMessage id={message} defaultMessage={message} />
          </FormFeedback>
        </>
      );
    }
  );
  const TextInput = observer(
    ({ attribute, title, md = "6", value, onChange }) => {
      return (
        <Col className="mb-1" md={md} sm="12">
          <Label className="form-label">
            <FormattedMessage id={title} defaultMessage={title} /> *
          </Label>
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(attribute, e.target.value)}
          />

          <ValidationHandler isValid={createModalStates[attribute]} />
        </Col>
      );
    }
  );
  const fileRef = useRef();

  const FileUploaderWrapper = observer(({ isSm = false, attribute }) => {
    const fileHandler = createModalStates[attribute];
    if (!fileHandler) return null;
    return (
      <div>
        <Label className="form-label" for="EmailMulti">
          <FormattedMessage id="Attachment" defaultMessage={"Attachment "} />
        </Label>
        <FileUploader
          // isFileLimit={1}
          maxFiles={1}
          isAllFiles={false}
          width={20}
          isSm={isSm}
          images={fileHandler.images}
          ref={fileHandler.fileRef}
          onUploadingComplete={() => {
            fileHandler.setIsUploading(
              fileRef.current?.checkIsAllFilesUploaded?.()
            );
          }}
          onUploadingStart={() => {
            fileHandler.setIsUploading(false);
          }}
          handleChange={(images) => fileHandler.setImages(images)}
        />
        <ValidationHandler isValid={fileHandler.images.length} />
      </div>
    );
  });

  const FormModal = observer(() => {
    return (
      <ModalBody className="d-flex flex-column">
        <Row>
          <TextInput
            title="Name"
            attribute="formName"
            value={createModalStates.formName}
            md="12"
            onChange={createModalStates.handleChange}
            isValid={createModalStates.createValidation}
          />
          <Col className="mb-1" md="12" sm="12">
            <Label className="form-label">
              <FormattedMessage id="For Role" defaultMessage={"For Role"} />
            </Label>
            <Select
              isMulti
              name="Roles"
              value={createModalStates?.meta_data?.roles?.map?.((value) => ({
                value,
                label: startCase(value),
              }))}
              onChange={(e) =>
                createModalStates.handleChangeMeta(
                  "roles",
                  e.map(({ value }) => value)
                )
              }
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              options={[
                {
                  id: 2,
                  value: "regional representatives",
                  label: "Regional Representatives",
                },
                {
                  id: 3,
                  value: "supervisor",
                  label: "Supervisor",
                },
                { id: 4, value: "agent", label: "Inspector" },
                { id: 5, value: "pharmacist", label: "Pharmacist" },
                { id: 5, value: "facility", label: "Facility" },
              ]}
              isClearable={true}
              placeholder={"Select"}
              closeMenuOnSelect={false}
            />
          </Col>
          <FileUploaderWrapper
            attribute="icon"
            md="12"
            isValid={createModalStates.createValidation}
          />
        </Row>
        <Button
          onClick={() =>
            createModalStates.validateCreate()
              ? createModalStates.submitCreate(null, getAllItems)
              : null
          }
          color="primary"
        >
          <FormattedMessage
            id={createModalStates.isEdit ? "Update" : "Create"}
            defaultMessage={createModalStates.isEdit ? "Update" : "Create"}
          />
        </Button>
      </ModalBody>
    );
  });

  return (
    <Fragment>
      <Modal
        unmountOnClose={true}
        isOpen={createModalStates.modalShow}
        toggle={() => {
          let a = new FormBuilderModel();
          setCreateModalstates(a);
        }}
      >
        <ModalHeader>
          <h3>Create a Form </h3>
        </ModalHeader>
        <FormModal />
      </Modal>
      {!!selectedRow && (
        <Dropdown
          size={20}
          row={selectedRow}
          DeleteData={DeleteData}
          showData={showData}
          editTitle="Edit"
          detailsText="Open Form"
          isEdit={true}
          isDelete={canEditDelete}
          onEdit={(id) => createModalStates.onEdit(selectedRow)}
          openEngin={(id) => createModalStates.openEngine(id)}
          onClose={() => setSelectedRow(null)}
        />
      )}
      <ListHeader
        totalHeader="Total Forms"
        pagination={pagination}
        addButtonText="Create Form"
        getData={getAllItems}
        loading={loading}
        addButton={
          <Button.Ripple
            outline
            onClick={() => {
              let a = new FormBuilderModel();
              setCreateModalstates(a);
              a.toggleModel();
            }}
            className="add-form-button waves-effect round btun   btn btn-primary my-1"
          >
            <p className="">
              <FormattedMessage
                defaultMessage={"Create Form"}
                id={"Create Form"}
              />
            </p>
            <Plus size={18} />
          </Button.Ripple>
        }
      />
      <Row style={{ overFlow: "auto" }} striped>
        <Col sm="12">
          <List
            basicColumns={basicColumns}
            Mock={items}
            pagination={pagination}
            handlePageChange={getAllItems}
            isLoading={isLoading}
          />
        </Col>
      </Row>
    </Fragment>
  );
});

export default ListComponent;
