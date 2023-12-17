import React, { } from "react";
import { Fragment } from "react-is";
import PaginationComponent from "./Pagination";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";

function PaginationFooter({
  handlePageChange,
  pagination = {},
  isStopPaginationFirstCall,
}) {
  const intl = useIntl();
  const message = (msg) => {
    return intl.formatMessage({
      id: msg,
      defaultMessage: msg,
    })
  }

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center">
        <div className="mt-1">
          <p className="list-info">{`${message("Showing")} ${pagination?.to || 0
            } ${message("from")} ${pagination?.totalPages} ${message(
              "data"
            )}`}</p>
        </div>
        <div className="">
          <PaginationComponent
            pagination={pagination}
            handlePageChange={handlePageChange}
            isStopPaginationFirstCall={isStopPaginationFirstCall}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default observer(PaginationFooter);
