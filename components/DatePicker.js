import { connect, mapProps, mapReadPretty } from "@formily/react";
import { DatePicker as AntdDatePicker } from "antd";

import { momentable, formatMomentValue } from "@formily/antd/esm/__builtins__";
import { PreviewText } from "@formily/antd";

const dayjs = require("dayjs");

const mapDateFormat = function () {
  const getDefaultFormat = (props) => {
    if (props["picker"] === "month") {
      return "YYYY-MM";
    } else if (props["picker"] === "quarter") {
      return "YYYY-\\QQ";
    } else if (props["picker"] === "year") {
      return "YYYY";
    } else if (props["picker"] === "week") {
      return "gggg-wo";
    }
    return props["showTime"] ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
  };

  return (props) => {
    const format = props["format"] || getDefaultFormat(props);
    const onChange = props.onChange;
    return {
      ...props,
      format: format,
      value: Array.isArray(props.value)
        ? props.value.map((val) => dayjs(val))
        : props.value
        ? dayjs(props.value)
        : null,
      onChange: (value, dateString) => {
        if (onChange) {
          if (dateString) {
            if (Array.isArray(dateString)) {
              onChange(
                value.map((val) => formatMomentValue(new Date(val)), format)
              );
            } else {
              onChange(formatMomentValue(new Date(value), format));
            }
          } else {
            onChange(null);
          }
        }
      },
    };
  };
};

export const DatePicker = connect(
  AntdDatePicker,
  mapProps(mapDateFormat()),
  mapReadPretty(PreviewText.DatePicker)
);

DatePicker.RangePicker = connect(
  AntdDatePicker.RangePicker,
  mapProps(mapDateFormat()),
  mapReadPretty(PreviewText.DateRangePicker)
);

export default DatePicker;
