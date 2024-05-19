import React, { Fragment } from "react";
import { define, observable, action, markRaw, model } from "@formily/reactive";
import { Steps } from "antd";
import cls from "classnames";
import { StepsProps, StepProps } from "antd/lib/steps";
import { Form, VoidField } from "@formily/core";
import {
  connect,
  useField,
  observer,
  useFieldSchema,
  RecursionField,
} from "@formily/react";
import { Schema, SchemaKey } from "@formily/json-schema";
import { usePrefixCls } from "@formily/antd/esm/__builtins__";
import "antd/lib/steps/style/index";
import toast from "react-hot-toast";
import { Col, DropdownItem, Row } from "reactstrap";
import {
  DropdownMenu,
  DropdownToggle,
  Progress,
  UncontrolledDropdown,
} from "reactstrap";
import { back, backButton, moreDrop, next } from "../../assets/SVG";

import "./style.css";
import { IntlService } from "../../../wasfaty/services";

const parseSteps = (schema) => {
  const steps = [];
  schema.mapProperties((schema, name) => {
    if (schema["x-component"]?.indexOf("StepPane") > -1) {
      steps.push({
        name,
        props: schema["x-component-props"],
        schema,
      });
    }
  });
  return steps;
};

const createFormStep = (defaultCurrent = 0) => {
  const env = define(
    {
      form: null,
      field: null,
      steps: [],
    },
    {
      form: observable.ref,
      field: observable.ref,
      steps: observable.shallow,
    }
  );

  const setDisplay = action.bound((target) => {
    const currentStep = env.steps[target];
    env.steps.forEach(({ name }) => {
      env.form.query(`${env.field.address}.${name}`).take((field) => {
        if (name === currentStep.name) {
          field.setDisplay("visible");
        } else {
          field.setDisplay("hidden");
        }
      });
    });
  });

  const next = action.bound(() => {
    if (formStep.allowNext) {
      formStep.setCurrent(formStep.current + 1);
    }
  });

  const back = action.bound(() => {
    if (formStep.allowBack) {
      formStep.setCurrent(formStep.current - 1);
    }
  });

  const formStep = model({
    connect(steps, field) {
      env.steps = steps;
      env.form = field?.form;
      env.field = field;
    },
    current: defaultCurrent,
    stepsValidations: [],
    skipValidation: false,
    async setCurrent(key) {
      try {
        await env.form.validate();

        setDisplay(key);
        formStep.current = key;
      } catch {
        formStep.stepsValidations.push(formStep.current);

        if (!formStep.skipValidation) {
          toast.error("Please fill all the required field");
        }
      }
    },
    get allowNext() {
      return formStep.current < env.steps.length - 1;
    },
    get allowBack() {
      return formStep.current > 0;
    },
    get steps() {
      return env.steps;
    },

    async next() {
      try {
        await env.form.validate();
        if (env.form.valid) {
          formStep.stepsValidations = formStep.stepsValidations.filter(
            (item) => item !== formStep.current
          );
          next();
        }
      } catch {
        formStep.stepsValidations.push(formStep.current);

        if (!formStep.skipValidation) {
          toast.error("Please fill all the required field");
        } else {
          next();
        }
      }
    },

    async back() {
      back();
    },
    async submit(onSubmit) {
      return env.form?.submit?.(onSubmit);
    },
  });
  return markRaw(formStep);
};

export const FormStep = connect(
  observer(({ formStep, className, ...props }) => {
    const field = useField();
    const prefixCls = usePrefixCls("formily-step", props);
    const schema = useFieldSchema();
    const steps = parseSteps(schema);
    const current = props.current || formStep?.current || 0;
    formStep?.connect?.(steps, field);

    return (
      <div className={cls(prefixCls, className)}>
        <div className="px-1 mainContainer align-items-center mb-2">
          <div className="d-flex align-items-center">
            <p className="stepHead m-0">
              {steps[formStep?.current]?.props?.title}
            </p>
          </div>
          <div className=" scnndcontainer">
            <div className="mx-1">
              <p className="steoptext">
                {IntlService.m("Step")}{" "}
                <span className="text-primary">{formStep?.current + 1}</span> /{" "}
                {steps.length}
              </p>
            </div>
            <div className="progressbarContainer">
              <Progress
                value={((formStep.current + 1) / steps.length) * 100}
                color={"success"}
                className="progress progressbar"
              />
            </div>
            <div className="d-flex justify-content-center justify-content-between actions mx-1">
              <figure className="cursor-pointer" onClick={formStep.back}>
                {IntlService.isRtl ? next : back}
              </figure>

              <UncontrolledDropdown className="mx-1">
                <DropdownToggle
                  data-toggle="dropdown"
                  className="d-flex align-items-center dropDownButton"
                  tag="span"
                >
                  <p className="m-0 stepnameinButoon">
                    {" "}
                    {steps[formStep?.current]?.props?.title}
                  </p>{" "}
                  <span className="ms-1">{moreDrop}</span>
                </DropdownToggle>
                <DropdownMenu className="menuContainer">
                  {steps.map(({ props }, index) => (
                    <DropdownItem
                      active={index == formStep.current}
                      className="w-100"
                      key={index}
                      onClick={() => {
                        formStep?.setCurrent(index);
                      }}
                    >
                      {props.title}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>

              <figure
                className="cursor-pointer"
                onClick={() => formStep.next()}
              >
                {IntlService.isRtl ? back : next}
              </figure>
            </div>
          </div>
        </div>

        {/* <Steps
          {...props}
          onChange={
            props.stepPress && !props.onChange
              ? formStep.setCurrent
              : props.onChange
          }
          style={{
            marginBottom: 10,
            ...props.style,
            display: "flex",
            flexWrap: "wrap",
          }}
          current={current}
        >
          {steps.map(({ props }, key) => {
            return (
              <Steps.Step
                {...props}
                key={key}
                progressDot={true}
                style={{
                  display: "flex",
                  paddingInlineStart: "unset",
                  padding: 5,

                  justifyContent: "start",
                  flex: "unset",
                }}
              />
            );
          })}
        </Steps> */}
        {steps.map(({ name, schema }, key) => {
          if (key !== current) return;
          return <RecursionField key={key} name={name} schema={schema} />;
        })}
      </div>
    );
  })
);

const StepPane = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

FormStep.StepPane = StepPane;
FormStep.createFormStep = createFormStep;

export default FormStep;
