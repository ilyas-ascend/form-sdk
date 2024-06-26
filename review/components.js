import { ArrayTable as MyArrayTable } from "@formily/antd";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_en";
import DateObject from "react-date-object";

export const Switch = (props) => {
  return <p>{props?.value ? "Yes" : "No"}</p>;
};
export const NumberPicker = (props) => <p>{props?.value || "-"}</p>;
export const Select = (props) => {
  let value = props?.value?.label || props?.value?.value;
  return <p>{value}</p>;
};
export const Input = (props) => <p>{props?.value || "-"}</p>;
Input.TextArea = Input;

export const DatePicker = (props) => <p>{props?.value || "-"}</p>;
export const TimePicker = (props) => <p>{props?.value || "-"}</p>;

export const DatePickerHijri = (props) => {
  let date = new DateObject({
    date: new Date(props.value),
    calendar: arabic,
    locale: arabic_ar,
  });
  return <span>{date?.format?.("YYYY-MM-DD")} </span>;
};

export const Upload = (props) => {
  return (
    <div>
      {props.value &&
        props.value.map((file, index) => (
          <>
            {!!file?.response?.imageUrl && (
              <img src={file.response.imageUrl} height={"auto"} width={"10%"} />
            )}
          </>
        ))}
    </div>
  );
};
Upload.Dragger = Upload;
export const ArrayTable = (props) => {
  const renderTableItem = (item) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <MyArrayTable.Item {...item} />
        </div>
      </div>
    );
  };
  const expandableRowKeys = [];

  return (
    <MyArrayTable
      {...props}
      renderTableItem={renderTableItem}
      expandableRowKeys={expandableRowKeys}
    />
  );
};
export const TreeSelect = ({ value, ...rest }) => {
  const { options } = rest;

  console.log("Options:", rest);
  console.log("Value:", value);

  // Function to render the value to simple <p> tags
  const renderLabels = (value) => {
    // Convert value to an array if it's not already one
    const selectedValues = Array.isArray(value) ? value : [value];
    // Map each selected value to its label
    return selectedValues.map((val, index) => {
      const option = options && options.find((option) => option.value === val); // Check if options is defined
      const label = option ? option.label : val; // Check if option is defined
      return <p key={index}>{label}</p>;
    });
  };

  return <div>{renderLabels(value)}</div>;
};

export const Cascader = ({ value, ...rest }) => {
  // Extract selected values from the value prop
  const selectedValues = Array.isArray(value) ? value : [value];

  // Function to render each selected value as a <p> tag
  const renderLabels = () => {
    return selectedValues.map((val, index) => <p key={index}>{val}</p>);
  };

  return (
    <div>
      {/* Render the selected values as <p> tags */}
      {renderLabels()}
    </div>
  );
};

// Component to render Editable value in <p> tags
export const Editable = ({ value }) => {
  return <p>{value}</p>;
};

// Component to render Password value in <p> tags
export const Password = ({ value }) => {
  return <p>{value}</p>;
};

// Component to render PreviewText value in <p> tags
export const PreviewText = ({ value }) => {
  return <p>{value}</p>;
};
