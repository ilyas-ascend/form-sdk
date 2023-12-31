import React, { useRef, useEffect, useState, Fragment } from "react";
import cls from "classnames";
import SignatureCanvas from "react-signature-canvas";
import { Card as AntdCard, Button } from "antd";
import { observer } from "@formily/reactive-react";

const Signature = observer((props) => {
  const [parentWidth, setParentWidth] = useState(0);
  const parentRef = useRef(null);
  const canvasRef = useRef(null);

  const { value, onChange } = props;

  const handleChange = (e) => {
    if (!props.disabled) {
      onChange(canvasRef.current.toData());
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        setParentWidth(parentRef.current.offsetWidth);
      }
    };

    handleResize(); // Initial width calculation

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (canvasRef.current && value) {
      canvasRef.current.fromData(value);
    }
  }, [value, canvasRef.current]);

  const cssStyle = `
  .dn-signature {
      display: block;
    
      position: relative;
      width: 100%;
      overflow:"hidden"
    }

    .signature-wrapper {
      border-radius: 5px;
    
      width: 100%;
      height: 100px;
      overflow: hidden;
    
      &-canvas {
        width: 100%;
        height: 99px;
      }
    }
    `;



  return (
    <>
      <style>{cssStyle}</style>
      <AntdCard
        {...props}
        title={
          <span data-content-editable="x-component-props.title">
            {props.title}
          </span>
        }
        extra={
          <Fragment>
            {props.extra}
            {canvasRef?.current?.clear &&
              !props.disabled &&
              props.isClearSignature && (
                <Button
                  type="text"
                  onClick={canvasRef.current.clear}
                  danger={props.isDanger}
                >
                  <span data-content-editable="x-component-props.clearText">
                    {props.clearText}
                  </span>
                </Button>
              )}
          </Fragment>
        }
        className={cls(props.className, "dn-signature")}
      >
        <div ref={parentRef} className="signature-wrapper">
          <SignatureCanvas
            penColor="black"
            canvasProps={{ height: 150, width: parentWidth }}
            ref={(ref) => {
              canvasRef.current = ref

              if (props.disabled) {
                canvasRef?.current?.off?.();
              }
            }}
            onEnd={handleChange}
            {...props}
            clearOnResize={false}
          />
        </div>
      </AntdCard>
    </>
  );
});
export default Signature;
