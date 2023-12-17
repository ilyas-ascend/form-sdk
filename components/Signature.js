import React, { useRef, useEffect, useState } from 'react'
import cls from 'classnames'
import SignatureCanvas from 'react-signature-canvas'
import { Card as AntdCard } from 'antd'
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
        <>
            <style>{cssStyle}</style>
            <AntdCard
                {...props}
                title={
                    <span data-content-editable="x-component-props.title">
                        {props.title}
                    </span>
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
                    />
                </div>
            </AntdCard>
        </>
    )
})
export default Signature;