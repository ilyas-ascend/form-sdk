import React from "react";
import {
  FormItem,
  Checkbox,
  Form,
  // Cascader,
  // Editable,
  // Input,
  // NumberPicker,
  // Switch,
  // Password,
  // PreviewText,
  Radio,
  Reset,
  // Select,
  Space,
  Submit,
  Transfer,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
} from "@formily/antd";
// import TimePicker from "../components/TimePicker";
// import DatePicker from "../components/DatePicker";
// import DatePickerHijri from "../components/DatePickerHijri";
import ArrayCards from "./ArrayCards";
import FormStep from "./form-review-step";
import Text from "../components/Text";
import Signature from "../components/Signature";
import "antd/dist/reset.css";

import "@formily/antd/dist/antd.css";

import { createSchemaField } from "@formily/react";

import { Card, Slider, Rate } from "antd";

import "./style.scss";
import { GenaricUtils } from "../../GenaricUtils";
const SubmissionReview = GenaricUtils["SubmissionReview"];
const TaskModal = GenaricUtils["TaskModal"];
import { Divider as ANTDDivider } from "antd";

const Divider = () => {
  return <ANTDDivider style={{ margin: 10 }} />;
};

import {
  Switch,
  NumberPicker,
  Select,
  Input,
  DatePicker,
  TimePicker,
  DatePickerHijri,
  Upload,
  // ArrayTable,
  TreeSelect,
  Cascader,
  Editable,
  Password,
  PreviewText,
} from "./components";

export const SchemaFieldReview = createSchemaField({
  components: {
    Space,
    // FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    Text,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
    FormStep,
    Signature,
    DatePickerHijri,
    Divider,
  },
});

const ReviewForm = ({ scopeProps, schema, form, renderForm }) => {
  const formStep = FormStep.createFormStep();

  return (
    <div dir="none" id="review">
      <Form {...form.schema.form} form={renderForm}>
        <SchemaFieldReview
          schema={schema}
          scope={{
            ...scopeProps,
            formStep,
          }}
        />
      </Form>
    </div>
  );
};

export default ReviewForm;
