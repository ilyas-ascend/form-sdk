import { connect, mapProps, mapReadPretty } from '@formily/react'
import { TimePicker as AntdTimePicker } from 'antd'
import { momentable, formatMomentValue } from '@formily/antd/esm/__builtins__'
import { PreviewText } from '@formily/antd'

const mapTimeFormat = function () {
    return (props) => {
        const format = props['format'] || 'HH:mm:ss'
        const onChange = props.onChange
        return {
            ...props,
            format,
            value: momentable(props.value, format),
            onChange: (value) => {
                if (onChange) {
                    onChange(formatMomentValue(new Date(value), format))
                }
            },
            onSelect: (value) => {
                if (onChange) {
                    onChange(formatMomentValue(new Date(value), format))
                }
            },
        }
    }
}

export const TimePicker = connect(
    AntdTimePicker,
    mapProps(mapTimeFormat()),
    mapReadPretty(PreviewText.TimePicker)
)

TimePicker.RangePicker = connect(
    AntdTimePicker.RangePicker,
    mapProps(mapTimeFormat()),
    mapReadPretty(PreviewText.TimeRangePicker)
)

export default TimePicker
