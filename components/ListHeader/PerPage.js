import { useEffect, useState } from "react";
import { Col, Label } from "reactstrap";
import "./style.scss";
import Select from "react-select";
import { FormattedMessage, useIntl } from "react-intl";

function setPerpage(v) {
  localStorage.setItem("perPage", JSON.stringify(v));
}

function getPerpage() {
  let d = JSON.parse(localStorage.getItem("perPage"));
  let obj = { label: "10", value: 10 };
  let v = d?.value ? d : obj;
  setPerpage(v);
  return v;
}

export const paginationOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "30", value: 30 },
  { label: "40", value: 40 },
  { label: "60", value: 60 },
  { label: "80", value: 80 },
  { label: "100", value: 100 },
  { label: "All", value: 1000000000000 },
];

const PerPage = ({ onPageSelection = () => { }, per_page = 10 }) => {
  const [perPage, setPerpage] = useState({
    label: per_page > 100 ? "All" : `${per_page}`,
    value: per_page,
  });

  return (
    <div className="pagination-row-select perPage">
      <Label>
        <FormattedMessage defaultMessage="Show" id="Show" />{" "}
      </Label>
      <Select
        className="react-select"
        classNamePrefix="select"
        options={paginationOptions}
        name="cluster"
        placeholder=""
        onChange={(e) => {
          setPerpage(e);
          onPageSelection(e.value);
        }}
        style={{ width: 100 }}
        value={perPage}
      />
    </div>
  );
};

export default PerPage;
