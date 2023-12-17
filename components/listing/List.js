import React, { forwardRef, useState } from "react";
import DataTable from "react-data-table-component";
import { Fragment } from "react-is";
import { Card, Col, Input, Label, Row } from "reactstrap";
import startCase from "lodash/startCase";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import PaginationFooter from "./PaginationFooter";

function List({
  basicColumns,
  Mock,
  handlePageChange,
  pagination = {},
  isLoading,
  tableProps = {},
  isStopPaginationFirstCall
}) {
  const intl = useIntl();

  const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className="form-check">
      <Input type="checkbox" ref={ref} {...props} />
    </div>
  ));

  return (
    <Fragment>
      <Card className="shadow-none">
        <DataTable
          noHeader
          noDataComponent={
            <div className="p-2">
              {intl
                .formatMessage({
                  id: isLoading
                    ? "Loading Data..."
                    : "There are no records to display",
                  defaultMessage: isLoading
                    ? "Loading Data..."
                    : "There are no records to display",
                })
              }
            </div>
          }
          // pagination/
          // selectableRows
          columns={basicColumns.map((column) => {
            if (!column.disableStartCase) {
              column.name = intl.formatMessage({
                id: startCase(column.name.toLowerCase()),
                defaultMessage: startCase(column.name.toLowerCase()),
              });
            } else {
              column.name = intl.formatMessage({
                id: column.name,
                defaultMessage: column.name,
              });
            }
            return column;
          })}
          data={Mock}
          // paginationPerPage={7}
          // className="react-dataTable"
          // sortIcon={<ChevronDown size={10} />}
          // paginationDefaultPage={currentPage + 1}
          // paginationComponent={CustomPagination}
          // data={searchValue.length ? filteredData : data}
          selectableRowsComponent={BootstrapCheckbox}
          {...tableProps}
        />
      </Card>

      <PaginationFooter
        pagination={pagination}
        handlePageChange={handlePageChange}
        isStopPaginationFirstCall={isStopPaginationFirstCall}
      />
    </Fragment>
  );
}

export default observer(List);
