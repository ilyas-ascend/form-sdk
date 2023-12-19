import React, { useRef, useEffect, useState, Fragment } from 'react'
import cls from 'classnames'
import SignatureCanvas from 'react-signature-canvas'
import { Card as AntdCard, Button } from 'antd'
import { observer } from '@formily/reactive-react'

const Signature = observer((props) => {
    const [parentWidth, setParentWidth] = useState(0)
    const parentRef = useRef(null)
    const canvasRef = useRef(null)

    const { value, onChange } = props

    const handleChange = (e) => {
        if (!props.disabled) {
            onChange(canvasRef.current.toData())
        }
    }

    useEffect(() => {
        const handleResize = () => {
            if (parentRef.current) {
                setParentWidth(parentRef.current.offsetWidth)
            }
        }

        handleResize() // Initial width calculation

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (canvasRef.current && value) {
            canvasRef.current.fromData(value);
        }
    }, [value, canvasRef.current])

    const cssStyle = `
    .dn-signature {
        display: block;
      
        position: relative;
        width: 100%;
      
      }
      `

    if (props.disabled) {
        canvasRef?.current?.off?.()
    }

    return (
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
                                {props.clearText || 'Clear Signature'}
                            </Button>
                        )}
                </Fragment>
            }
            className={cls(props.className, 'dn-signature')}
        >
            <div ref={parentRef}>
                <SignatureCanvas
                    penColor="black"
                    canvasProps={{ height: 150, width: parentWidth }}
                    clearOnResize={false}
                    ref={canvasRef}
                    onEnd={handleChange}
                    {...props}
                />
            </div>
        </AntdCard>
    )
})
export default Signature;