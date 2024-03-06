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
    setCurrent(key) {
      setDisplay(key);
      formStep.current = key;
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
          next();
        }
      } catch {
        toast.error("Please fill all the required field");
      } finally {
        // if (env.form.errors.length > 0) {
        //   let currentData = [...formStep.stepsValidations];
        //   const index = currentData.findIndex(
        //     (item) => item.name === env.steps[formStep.current].props.title
        //   );
        //   if (index >= 0) {
        //     currentData[index] = {
        //       name: env.steps[formStep.current].props.title,
        //       validate: false,
        //     };
        //   } else {
        //     currentData.push({
        //       name: env.steps[formStep.current].props.title,
        //       validate: false,
        //     });
        //   }
        //   formStep.stepsValidations = currentData;
        // } else {
        //   let currentData = [...formStep.stepsValidations];
        //   const index = currentData.findIndex(
        //     (item) => item.name === env.steps[formStep.current].props.title
        //   );
        //   if (index >= 0) {
        //     currentData[index] = {
        //       name: env.steps[formStep.current].props.title,
        //       validate: true,
        //     };
        //   } else {
        //     currentData.push({
        //       name: env.steps[formStep.current].props.title,
        //       validate: true,
        //     });
        //   }
        //   formStep.stepsValidations = currentData;
        // }
        // next();
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
        <Steps
          {...props}
          style={{ marginBottom: 10, ...props.style }}
          current={current}
        >
          {steps.map(({ props }, key) => {
            return <Steps.Step {...props} key={key} />;
          })}
        </Steps>
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
