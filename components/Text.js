import React from "react";

import { connect, mapProps } from '@formily/react'

const MyText = ({ value, mode, content, ...props }) => {
    const tagName = mode === "normal" || !mode ? "div" : mode;
    return React.createElement(tagName, props, value || content);
};

export default Text = connect(
    MyText,
)