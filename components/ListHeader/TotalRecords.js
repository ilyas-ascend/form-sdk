import { FormattedMessage } from "react-intl";
import { Col } from "reactstrap";
import "./style.scss";
FormattedMessage;

const TotalRecords = ({
  title,
  number,
  md = 6,
  flex = "justify-content-between",
}) => {
  return (
    <Col sm={md} className={`d-flex ${flex}`}>
      {" "}
      <div className="text">
        <FormattedMessage id={title} defaultMessage={title} />
      </div>
      <div className="records-items"></div>
      <div className="text">{number || 0} </div>
    </Col>
  );
};

export default TotalRecords;
