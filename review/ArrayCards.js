import React from "react";
import { Card, Empty } from "antd";
import {
  useField,
  observer,
  useFieldSchema,
  RecursionField,
} from "@formily/react";
import cls from "classnames";
import { usePrefixCls } from "@formily/antd/esm/__builtins__";
import { ArrayBase } from "@formily/antd";

const isAdditionComponent = (schema) => {
  return schema["x-component"]?.indexOf("Addition") > -1;
};

const isIndexComponent = (schema) => {
  return schema["x-component"]?.indexOf("Index") > -1;
};

const isRemoveComponent = (schema) => {
  return schema["x-component"]?.indexOf("Remove") > -1;
};

const isMoveUpComponent = (schema) => {
  return schema["x-component"]?.indexOf("MoveUp") > -1;
};

const isMoveDownComponent = (schema) => {
  return schema["x-component"]?.indexOf("MoveDown") > -1;
};

const isOperationComponent = (schema) => {
  return (
    isAdditionComponent(schema) ||
    isRemoveComponent(schema) ||
    isMoveDownComponent(schema) ||
    isMoveUpComponent(schema)
  );
};

export const ArrayCards = observer((props) => {
  const field = useField();
  const schema = useFieldSchema();
  const dataSource = Array.isArray(field.value) ? field.value : [];
  const prefixCls = usePrefixCls("formily-array-cards", props);

  if (!schema) throw new Error("can not found schema object");

  const renderItems = () => {
    return dataSource?.map((item, index) => {
      const items = Array.isArray(schema.items)
        ? schema.items[index] || schema.items[0]
        : schema.items;
      const myItems = items.toJSON();

      const title = (
        <span>
          <RecursionField
            schema={items}
            name={index}
            filterProperties={(schema) => {
              if (!isIndexComponent(schema)) return false;
              return true;
            }}
            onlyRenderProperties
          />
          {item.title || props.title || field.title}
        </span>
      );
      const extra = (
        <span>
          <RecursionField
            schema={items}
            name={index}
            filterProperties={(schema) => {
              if (!isOperationComponent(schema)) return false;
              return true;
            }}
            onlyRenderProperties
          />
          {props.extra}
        </span>
      );
      const content = (
        <RecursionField
          schema={myItems}
          name={index}
          filterProperties={(schema) => {
            if (isIndexComponent(schema)) return false;
            if (isOperationComponent(schema)) return false;
            schema.mapProperties((property) => {
              if (item[property.title]) {
                property.title = item[property.title];
                property.required = !!item.required;
              }
            });
            return true;
          }}
        />
      );
      return (
        <ArrayBase.Item key={index} index={index} record={item}>
          {!props.hide_card ? (
            <>
              <Card
                {...props}
                onChange={() => {}}
                className={cls(`${prefixCls}-item`, props.className)}
                title={title}
                extra={extra}
              >
                {content}
              </Card>
            </>
          ) : (
            content
          )}
        </ArrayBase.Item>
      );
    });
  };

  return <ArrayBase>{renderItems()}</ArrayBase>;
});

ArrayCards.displayName = "ArrayCards";

ArrayBase.mixin(ArrayCards);

export default ArrayCards;
