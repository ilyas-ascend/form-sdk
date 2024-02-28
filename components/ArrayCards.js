import React from "react";
import { Card, Empty } from "antd";
import {
  useField,
  observer,
  useFieldSchema,
  RecursionField,
  Schema,
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

export const questionPriorityColor = {
  Critical: "#BB0A1E",

  High: "#FD471F",

  Medium: "#FFA115",

  Low: "#FEDB24",
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

      console.log("===>", item);

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

      let myItemsSch = new Schema(JSON.parse(JSON.stringify(myItems)));
      const propertyMapper = (property) => {
        property.mapProperties((p) => {
          propertyMapper(p);
        });

        if (item[property.title]) {
          property.title = item[property.title];
          property.required = !!item.required;
          if (item.priority) {
            property["x-decorator-props"]["addonAfter"] = (
              <p
                style={{
                  backgroundColor: questionPriorityColor[item.priority],
                  padding: "2px 4px",
                  color: "white",
                  borderRadius: 7,
                  fontSize: 11,
                }}
              >
                {item.priority}
              </p>
            );
          } else {
            if (property["x-decorator-props"]["addonAfter"] === "Low") {
              property["x-decorator-props"]["addonAfter"] = "";
            }
          }
        }

        if (property?.["x-component-props"]?.content) {
          property["x-component-props"].content =
            item[property["x-component-props"].content];
        }
      };

      propertyMapper(myItemsSch);

      const content = (
        <RecursionField
          schema={myItemsSch}
          name={index}
          filterProperties={(schema) => {
            if (isIndexComponent(schema)) return false;
            if (isOperationComponent(schema)) return false;
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

  const renderAddition = () => {
    return schema.reduceProperties((addition, schema, key) => {
      if (isAdditionComponent(schema)) {
        return <RecursionField schema={schema} name={key} />;
      }
      return addition;
    }, null);
  };

  const renderEmpty = () => {
    if (dataSource?.length) return;
    return (
      <Card
        {...props}
        onChange={() => {}}
        className={cls(`${prefixCls}-item`, props.className)}
        title={props.title || field.title}
      >
        <Empty />
      </Card>
    );
  };

  return (
    <ArrayBase>
      {renderEmpty()}
      {renderItems()}
      {renderAddition()}
    </ArrayBase>
  );
});

ArrayCards.displayName = "ArrayCards";

ArrayBase.mixin(ArrayCards);

export default ArrayCards;
