import { Fragment, useEffect, useState } from "react";
import {
  Row,
  Col,
} from "reactstrap";
import List from "../components/listing/List"
import get from "lodash/get";
import moment from "moment";
import "./style.scss";
import toast from "react-hot-toast";
import { MoreVertical } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);
import { getUserData } from "@utils";
import ListHeader from "../components/ListHeader";
import { observer } from "mobx-react";
import FormService from "../services/FormService";
import FormSubmissionService from "../services/FormSubmissionService";
import Dropdown from "../components/Dropdown";

function extractFieldsInfo(properties, parentPath = '') {
  let fieldsInfo = [];

  for (const key in properties) {
    const propertyPath = parentPath ? `${parentPath}.${key}` : key;
    const property = properties[key];

    if (property.tableField === true) {
      const fieldInfo = {
        key,
        title: property.title || key,
        xComponent: property['x-component'] || null
      };

      fieldsInfo.push(fieldInfo);
    }

    if (property.properties) {
      fieldsInfo = fieldsInfo.concat(extractFieldsInfo(property.properties, propertyPath));
    }
  }

  return fieldsInfo;
}

const FormBuilderFormList = observer(() => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [selectedRow, setSelectedRow] = useState();

  const user = getUserData();
  const type = user.type?.toLowerCase();
  const userId = user._id;
  const canEditDelete = ["admin"].includes(type);
  const canView = ["moderator"].includes(type);
  const [form, setForm] = useState()

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

  useEffect(() => {
    getForm()
  }, [id])

  const getForm = () => {
    FormService.show(id).then((res) => {
      setForm(res.data?.data)
    })
  };

  const getAllItems = (query = { selected: 0 }) => {
    setIsLoading(true);
    setLoading(true);

    const params = {
      page: query.selected + 1,
      per_page: 10,
      id,
      //filters
      ...filter,
    };

    FormSubmissionService.find(params)
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
  const showData = (form_id) => {
    navigate(`/Form-Builder/${id}/${form_id}/show`);
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
        FormSubmissionService.delete(id).then((res) => {
          if (res.status === 200) {
            getAllItems({
              selected: pagination.page - 1,
            });
            toast.success(res.data.data);
          } else {
            if (res.errors) {
              toast.error(error);
            }
          }
        });
      }
    });
  };
  const tableFields = extractFieldsInfo(form?.schema?.schema?.properties);

  const basicColumns = [

    ...tableFields.map((field) => {
      return {
        name: field.title,
        cell: (row) => {
          if (field.xComponent === "DatePicker" && moment(get(row, `data.${field.key}`, ""))._isValid) {
            return <span>
              {moment(get(row, `data.${field.key}`, "")).format("DD-MM-YYYY")}{" "}
              <span style={{ fontWeight: "bold" }}>
                {moment(get(row, `data.${field.key}`, "")).format("h:mm")}
              </span>
            </span>
          }

          return <span>{get(row, `data.${field.key}`, "N/A")}</span>
        },
      }
    }),
    {
      name: "Submitted by",
      sortable: true,
      cell: (row) => <span>{get(row, "user.name", "")}</span>,
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

  if (!form) return null

  return (
    <Fragment>
      {!!selectedRow && (
        <Dropdown
          size={20}
          row={selectedRow}
          DeleteData={DeleteData}
          showData={showData}
          isEdit={
            false
            // (canEditDelete || selectedRow?.user?._id === userId) &&
            // !selectedRow.active
          }
          isDelete={canEditDelete}
          onEdit={(form_id) => navigate(`/Form-Builder/edit/${id}/${form_id}`)}
          onClose={() => setSelectedRow(null)}
        />
      )}
      <ListHeader
        totalHeader="Total Submissions"
        pagination={pagination}
        addButtonText="Create Submission"
        getData={getAllItems}
        id={id}
        loading={loading}
        addFormUrl={`/Form-Builder/Add/${id}`}
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

export default FormBuilderFormList;
