import { useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { FormattedMessage, useIntl } from "react-intl";

const PaginationComponent = ({
  pagination,
  handlePageChange,
  isStopPaginationFirstCall,
}) => {
  const [initialPageChange, setInitialPageChange] = useState(true);

  const Previous = () => {
    return (
      <span className="align-middle d-none d-md-inline-block">
        <FormattedMessage id="Previous" defaultMessage="Previous" />
      </span>
    );
  };

  const Next = () => {
    return (
      <span className="align-middle d-none d-md-inline-block">
        <FormattedMessage id="Next" defaultMessage="Next" />
      </span>
    );
  };

  const _handlePageChange = (selectedPage) => {
    if (initialPageChange && isStopPaginationFirstCall) {
      setInitialPageChange(false);
      return;
    }
    handlePageChange(selectedPage);
  };

  return (
    <ReactPaginate
      initialPage={pagination.page - 1}
      forcePage={pagination.page - 1}
      onPageChange={_handlePageChange}
      pageCount={pagination.pageCount}
      breakLabel="..."
      nextLabel={<Next />}
      previousLabel={<Previous />}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      nextClassName="page-item next"
      breakLinkClassName="page-link"
      previousClassName="page-item prev"
      previousLinkClassName="page-link"
      containerClassName={`
      ${
        !pagination.totalPages && "hidden"
      } pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1`}
    />
  );
};
export default PaginationComponent;
