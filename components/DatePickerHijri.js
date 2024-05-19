import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";

import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_en";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import { PreviewText } from "@formily/antd";
import { observer } from "@formily/reactive-react";
import "react-multi-date-picker/styles/colors/green.css";

const DatePickerHijriComp = observer((props) => {
  let style = `

  :root {
    --rmdp-primary-green: #51AA46;
    --rmdp-secondary-green: #87ad92;
    --rmdp-shadow-green: #87ad92;
    --rmdp-today-green: #01ff70;
    --rmdp-hover-green: #2ecc40;
    --rmdp-deselect-green: #39795c;
  }

  
  .rmdp-container {
    display: unset !important;
    height: 200px !important;
  }
  .date-picker-input {
    border: 1px solid #d9d9d9;
    outline: none;
    line-height: 1.5;
    border-radius: 8px;
    padding:5px
  }

  .date-picker-input:focus {
    border: 1px solid #51AA46;
  }
}

`;
  const size = {
    small: 34,
    large: 40,
  };

  const datePickerStyles = {
    width: "100%", // Set the width to 100%
    height: size[props.size] || size.small,
    lineHeight: 34,
    color: props.disabled ? "#DFCCCC" : "unset",
  };

  return (
    <div>
      <style>{style}</style>
      <DatePicker
        style={datePickerStyles}
        calendar={arabic}
        locale={arabic_ar}
        className="form-control green"
        inputClass="date-picker-input"
        {...props}
      />
    </div>
  );
});

const DatePickerHijri = connect(
  DatePickerHijriComp,
  mapProps((props) => {
    const format = props["format"] || "YYYY-MM-DD";
    const onChange = props.onChange.bind(props);

    return {
      ...props,
      format: format,
      value: props.value ? new Date(props.value) : null,
      onChange: (value) => {
        if (props.onChange) {
          let date = value?.toDate?.()?.toDateString?.();
          onChange(date);
        }
      },
    };
  }),
  mapReadPretty(PreviewText.DatePicker)
);

export default DatePickerHijri;
