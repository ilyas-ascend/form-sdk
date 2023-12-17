import React, { useCallback, useEffect } from "react";
import { Plus } from "react-feather";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Card, CardBody, Col, Input, Row, Spinner } from "reactstrap";
import {
  DashboardIcon,
  filterDateIcon,
  searchIcon,
} from "../../assets/SVG";
import TotalRecords from "./TotalRecords";
import FlatPicker from "react-flatpickr";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import PerPage from "./PerPage";

function ListHeader({
  pagination,
  exportComponent,
  dashboardUrl,
  addFormUrl,
  filter,
  setFilter,
  getData,
  loading,
  isPerPage = false,
  onPageSelection = () => { },
  per_page = 10,
  totalHeader,
  addButtonText,
  addButton = null,
  id,
}) {
  const navigate = useNavigate();
  const intl = useIntl();
  const message = (msg) => {
    return intl.formatMessage({
      id: msg,
      defaultMessage: msg,
    })
  }


  const handleChange = useCallback(
    debounce((name, value) => {
      if (name == "date")
        setFilter((prev) => ({
          ...prev,
          fromDate: value[0]?.toDateString?.(),
          toDate: value?.[1]?.toDateString?.(),
        }));
      else setFilter((prev) => ({ ...prev, search: value }));
    }, 2000),
    []
  );
  useEffect(() => {
    if (filter || id) getData();
  }, [filter, id]);

  const userData = JSON.parse(localStorage.getItem("userData"));

  return (
    <Card className="shadow-none">
      <CardBody className="list-header">
        <Row>
          <Col
            sm="12"
            className="d-flex justify-content-end"
            style={{
              border: "1px",
              borderBottomColor: "#EDEDED",
              borderBottomStyle: "solid",
              paddingBottom: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              {addFormUrl && (
                <Button.Ripple
                  outline
                  onClick={() => navigate(addFormUrl)}
                  className="add-form-button waves-effect round btun   btn btn-primary my-1"
                >
                  <p className="">
                    <FormattedMessage
                      defaultMessage={addButtonText || "Add New Form"}
                      id={addButtonText || "Add New Form"}
                    />
                  </p>
                  <Plus size={18} />
                </Button.Ripple>
              )}

              {addButton}

              {dashboardUrl &&
                userData?.type != "agent" &&
                userData?.type != "pharmacist" ? (
                <Button.Ripple
                  outline
                  onClick={() => navigate(dashboardUrl)}
                  className="dashboard-button  my-1"
                >
                  <p>
                    <FormattedMessage
                      defaultMessage={"Dashboard"}
                      id="Dashboard"
                    />
                  </p>
                  <figure>{DashboardIcon}</figure>
                </Button.Ripple>
              ) : null}
            </div>
          </Col>
          <Col md="4" className="d-flex">
            <Col md="6" sm="12 mt-1">
              <TotalRecords
                title={totalHeader || "Total Submissions"}
                number={pagination?.totalPages}
              />
            </Col>
            <div style={{ marginLeft: 10 }} className="d-flex">
              {isPerPage && (
                <PerPage
                  onPageSelection={onPageSelection}
                  per_page={per_page}
                />
              )}
            </div>
          </Col>

          <Col md={"8"} sm="12" className="filter-container">
            {filter && (
              <>
                {" "}
                <div className="filter-date mt-1">
                  <FlatPicker
                    className="form-control date-picker-input"
                    options={{
                      dateFormat: "d-m-Y",
                      mode: "range",
                    }}
                    onClose={(e) => {
                      handleChange("date", e);
                    }}
                    placeholder={message("Filter Date")}
                  />
                  <figure>
                    {loading ? <Spinner size="sm" /> : filterDateIcon}
                  </figure>
                </div>
                <div className="pagination-row-search mt-1">
                  <Input
                    placeholder={message("Search in the list")}
                    onChange={(e) => handleChange("search", e.target.value)}
                  />
                  <figure>
                    {loading ? <Spinner size="sm" /> : searchIcon}
                  </figure>
                </div>
              </>
            )}

            <span className="mt-1">{exportComponent}</span>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default ListHeader;
