import React, { useEffect, useRef, useContext, useState } from "react";
import cls from "classnames";
import { usePrefixCls, pickDataProps } from "@formily/antd/esm/__builtins__";
import { isVoidField } from "@formily/core";
import { connect, mapProps } from "@formily/react";
import { useFormLayout, FormLayoutShallowContext } from "@formily/antd";
import { Tooltip, Popover, ConfigProvider } from "antd";
import {
  QuestionCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const useFormItemLayout = (props) => {
  const layout = useFormLayout();
  const layoutType = props.layout ?? layout.layout ?? "horizontal";
  return {
    ...props,
    layout: layoutType,
    colon: props.colon ?? layout.colon,
    labelAlign:
      layoutType === "vertical"
        ? props.labelAlign ?? "left"
        : props.labelAlign ?? layout.labelAlign ?? "right",
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    labelCol: props.labelCol ?? layout.labelCol,
    wrapperCol: props.wrapperCol ?? layout.wrapperCol,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign,
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    fullness: props.fullness ?? layout.fullness,
    size: props.size ?? layout.size,
    inset: props.inset ?? layout.inset,
    asterisk: props.asterisk,
    requiredMark: layout.requiredMark,
    optionalMarkHidden: props.optionalMarkHidden,
    bordered: props.bordered ?? layout.bordered,
    feedbackIcon: props.feedbackIcon,
    feedbackLayout: props.feedbackLayout ?? layout.feedbackLayout ?? "loose",
    tooltipLayout: props.tooltipLayout ?? layout.tooltipLayout ?? "icon",
    tooltipIcon: props.tooltipIcon ?? layout.tooltipIcon ?? (
      <QuestionCircleOutlined />
    ),
  };
};

function useOverflow() {
  const [overflow, setOverflow] = useState(false);
  const containerRef = useRef();
  const contentRef = useRef();
  const layout = useFormLayout();
  const labelCol = JSON.stringify(layout.labelCol);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (containerRef.current && contentRef.current) {
        const contentWidth = contentRef.current.getBoundingClientRect().width;
        const containerWidth =
          containerRef.current.getBoundingClientRect().width;
        if (contentWidth && containerWidth && containerWidth < contentWidth) {
          if (!overflow) setOverflow(true);
        } else {
          if (overflow) setOverflow(false);
        }
      }
    });
  }, [labelCol]);

  return {
    overflow,
    containerRef,
    contentRef,
  };
}

const ICON_MAP = {
  error: <CloseCircleOutlined />,
  success: <CheckCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
};

export const BaseItem = ({ children, ...props }) => {
  const [active, setActive] = useState(false);
  const formLayout = useFormItemLayout(props);
  const { locale } = useContext(ConfigProvider.ConfigContext);
  const { containerRef, contentRef, overflow } = useOverflow();
  const {
    label,
    style,
    layout,
    colon = true,
    addonBefore,
    addonAfter,
    asterisk,
    requiredMark = true,
    optionalMarkHidden = false,
    feedbackStatus,
    extra,
    feedbackText,
    fullness,
    feedbackLayout,
    feedbackIcon,
    enableOutlineFeedback = true,
    getPopupContainer,
    inset,
    bordered = true,
    labelWidth,
    wrapperWidth,
    labelCol,
    wrapperCol,
    labelAlign,
    wrapperAlign = "left",
    size,
    labelWrap,
    wrapperWrap,
    tooltipLayout,
    tooltip,
    tooltipIcon,
    number,
  } = formLayout;
  const labelStyle = { ...formLayout.labelStyle };
  const wrapperStyle = { ...formLayout.wrapperStyle };

  let enableCol = false;
  if (labelWidth || wrapperWidth) {
    if (labelWidth) {
      labelStyle.width = labelWidth === "auto" ? undefined : labelWidth;
      labelStyle.maxWidth = labelWidth === "auto" ? undefined : labelWidth;
    }
    if (wrapperWidth) {
      wrapperStyle.width = wrapperWidth === "auto" ? undefined : wrapperWidth;
      wrapperStyle.maxWidth =
        wrapperWidth === "auto" ? undefined : wrapperWidth;
    }
  }
  if (labelCol || wrapperCol) {
    if (!labelStyle.width && !wrapperStyle.width && layout !== "vertical") {
      enableCol = true;
    }
  }

  const prefixCls = usePrefixCls("formily-item", props);
  const formatChildren =
    feedbackLayout === "popover" ? (
      <Popover
        autoAdjustOverflow
        placement="top"
        content={
          <div
            className={cls({
              [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
              [`${prefixCls}-help`]: true,
            })}
          >
            {ICON_MAP[feedbackStatus]} {feedbackText}
          </div>
        }
        visible={!!feedbackText}
        getPopupContainer={getPopupContainer}
      >
        {children}
      </Popover>
    ) : (
      children
    );

  const gridStyles = {};

  const getOverflowTooltip = () => {
    if (overflow) {
      return (
        <div>
          <div>{label}</div>
          <div>{tooltip}</div>
        </div>
      );
    }
    return tooltip;
  };

  const renderLabelText = () => {
    const labelChildren = (
      <div className={`${prefixCls}-label-content`} ref={containerRef}>
        <span ref={contentRef}>
          {number > 0 && (
            <span style={{ fontSize: 14, fontWeight: "bold" }}>
              {number} -{" "}
            </span>
          )}
          {asterisk && requiredMark === true && (
            <span className={`${prefixCls}-asterisk`}>{"*"}</span>
          )}
          <label htmlFor={props.labelFor}>{label}</label>
          {!asterisk && requiredMark === "optional" && !optionalMarkHidden && (
            <span className={`${prefixCls}-optional`}>
              {locale?.Form?.optional}
            </span>
          )}
        </span>
      </div>
    );

    if ((tooltipLayout === "text" && tooltip) || overflow) {
      return (
        <Tooltip
          placement="top"
          align={{ offset: [0, 10] }}
          title={getOverflowTooltip()}
        >
          {labelChildren}
        </Tooltip>
      );
    }
    return labelChildren;
  };

  const renderTooltipIcon = () => {
    if (tooltip && tooltipLayout === "icon" && !overflow) {
      return (
        <span className={`${prefixCls}-label-tooltip-icon`}>
          <Tooltip placement="top" align={{ offset: [0, 2] }} title={tooltip}>
            {tooltipIcon}
          </Tooltip>
        </span>
      );
    }
  };

  const renderLabel = () => {
    if (!label) return null;
    return (
      <div
        className={cls({
          [`${prefixCls}-label`]: true,
          [`${prefixCls}-label-tooltip`]:
            (tooltip && tooltipLayout === "text") || overflow,
          [`${prefixCls}-item-col-${labelCol}`]: enableCol && !!labelCol,
        })}
        style={labelStyle}
      >
        {renderLabelText()}
        {renderTooltipIcon()}
        {label !== " " && (
          <span className={`${prefixCls}-colon`}>{colon ? ":" : ""}</span>
        )}
      </div>
    );
  };

  return (
    <div
      {...pickDataProps(props)}
      style={{
        ...style,
        ...gridStyles,
      }}
      data-grid-span={props.gridSpan}
      className={cls({
        [`${prefixCls}`]: true,
        [`${prefixCls}-layout-${layout}`]: true,
        [`${prefixCls}-${feedbackStatus}`]:
          enableOutlineFeedback && !!feedbackStatus,
        [`${prefixCls}-feedback-has-text`]: !!feedbackText,
        [`${prefixCls}-size-${size}`]: !!size,
        [`${prefixCls}-feedback-layout-${feedbackLayout}`]: !!feedbackLayout,
        [`${prefixCls}-fullness`]: !!fullness || !!inset || !!feedbackIcon,
        [`${prefixCls}-inset`]: !!inset,
        [`${prefixCls}-active`]: active,
        [`${prefixCls}-inset-active`]: !!inset && active,
        [`${prefixCls}-label-align-${labelAlign}`]: true,
        [`${prefixCls}-control-align-${wrapperAlign}`]: true,
        [`${prefixCls}-label-wrap`]: !!labelWrap,
        [`${prefixCls}-control-wrap`]: !!wrapperWrap,
        [`${prefixCls}-bordered-none`]:
          bordered === false || !!inset || !!feedbackIcon,
        [props.className]: !!props.className,
      })}
      onFocus={() => {
        if (feedbackIcon || inset) {
          setActive(true);
        }
      }}
      onBlur={() => {
        if (feedbackIcon || inset) {
          setActive(false);
        }
      }}
    >
      {renderLabel()}
      <div
        className={cls({
          [`${prefixCls}-control`]: true,
          [`${prefixCls}-item-col-${wrapperCol}`]:
            enableCol && !!wrapperCol && label,
        })}
      >
        <div className={cls(`${prefixCls}-control-content`)}>
          {addonBefore && (
            <div className={cls(`${prefixCls}-addon-before`)}>
              {addonBefore}
            </div>
          )}
          <div
            style={wrapperStyle}
            className={cls({
              [`${prefixCls}-control-content-component`]: true,
              [`${prefixCls}-control-content-component-has-feedback-icon`]:
                !!feedbackIcon,
            })}
          >
            <FormLayoutShallowContext.Provider value={undefined}>
              {formatChildren}
            </FormLayoutShallowContext.Provider>
            {feedbackIcon && (
              <div className={cls(`${prefixCls}-feedback-icon`)}>
                {feedbackIcon}
              </div>
            )}
          </div>
          {addonAfter && (
            <div className={cls(`${prefixCls}-addon-after`)}>{addonAfter}</div>
          )}
        </div>
        {!!feedbackText &&
          feedbackLayout !== "popover" &&
          feedbackLayout !== "none" && (
            <div
              className={cls({
                [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
                [`${prefixCls}-help`]: true,
                [`${prefixCls}-help-enter`]: true,
                [`${prefixCls}-help-enter-active`]: true,
              })}
            >
              {feedbackText}
            </div>
          )}
        {extra && <div className={cls(`${prefixCls}-extra`)}>{extra}</div>}
      </div>
    </div>
  );
};

export const FormItem = connect(
  BaseItem,
  mapProps((props, field) => {
    if (isVoidField(field))
      return {
        label: field.title || props.label,
        asterisk: props.asterisk,
        extra: props.extra || field.description,
        number: field.number || 1,
      };
    if (!field) return props;
    const takeFeedbackStatus = () => {
      if (field.validating) return "pending";
      return field.decoratorProps.feedbackStatus || field.validateStatus;
    };
    const takeMessage = () => {
      const split = (messages) => {
        return messages.reduce((buf, text, index) => {
          if (!text) return buf;
          return index < messages.length - 1
            ? buf.concat([text, ", "])
            : buf.concat([text]);
        }, []);
      };
      if (field.validating) return;
      if (props.feedbackText) return props.feedbackText;
      if (field.selfErrors.length) return split(field.selfErrors);
      if (field.selfWarnings.length) return split(field.selfWarnings);
      if (field.selfSuccesses.length) return split(field.selfSuccesses);
    };
    const takeAsterisk = () => {
      if (field.required && field.pattern !== "readPretty") {
        return true;
      }
      if ("asterisk" in props) {
        return props.asterisk;
      }
      return false;
    };

    return {
      label: props.label || field.title,

      feedbackStatus: takeFeedbackStatus(),
      feedbackText: takeMessage(),
      asterisk: takeAsterisk(),
      optionalMarkHidden:
        field.pattern === "readPretty" && !("asterisk" in props),
      extra: props.extra || field.description,
      number:
        field.componentProps?.number > -1 ? field.componentProps.number : null,
    };
  })
);

FormItem.BaseItem = BaseItem;

export default FormItem;
