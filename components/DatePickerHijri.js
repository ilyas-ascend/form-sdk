import React, { useState } from 'react'
import DatePicker from 'react-multi-date-picker'

import arabic from 'react-date-object/calendars/arabic'
import arabic_ar from 'react-date-object/locales/arabic_en'
import { connect, mapProps, mapReadPretty } from '@formily/react'
import { PreviewText } from '@formily/antd'
import { observer } from "@formily/reactive-react";


const DatePickerHijriComp = observer((
  props
) => {
  let style = `
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
    border: 1px solid #4096ff;
  }

`
  const size = {
    small: 34,
    large: 40,
  }

  const datePickerStyles = {
    width: '100%', // Set the width to 100%
    height: size[props.size] || size.small,
    lineHeight: 34,
    color: props.disabled ? "#DFCCCC" : "unset"
  }

  return (
    <div>
      <style>{style}</style>
      <DatePicker
        style={datePickerStyles}
        calendar={arabic}
        locale={arabic_ar}
        className="form-control"
        inputClass="date-picker-input"
        {...props}
      />
    </div>
  )
})

const DatePickerHijri = connect(
  DatePickerHijriComp,
  mapProps((props) => {
    const getDefaultFormat = (props) => {
      if (props['picker'] === 'month') {
        return 'YYYY-MM';
      } else if (props['picker'] === 'quarter') {
        return 'YYYY-\\QQ';
      } else if (props['picker'] === 'year') {
        return 'YYYY';
      } else if (props['picker'] === 'week') {
        return 'gggg-wo';
      }
      return 'YYYY-MM-DD HH:mm:ss';
    };
    // const format = props['format'] || getDefaultFormat(props);
    const format = props['format'];
    const onChange = props.onChange.bind(props);

    return {
      ...props,
      format: format,
      value: props.value ? new Date(props.value) : null,
      onChange: (value) => {
        if (onChange) {
          onChange(value?.toDate?.());
        }
      },
    };
  }),
  mapReadPretty(PreviewText.DatePicker)
)

export default DatePickerHijri