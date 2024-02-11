import React, { useCallback, useEffect, useMemo } from "react";
import {
  Form,
  FormItem,
  Checkbox,
  Cascader,
  // Editable,
  // Input,
  // NumberPicker,
  // Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  // Select,
  Space,
  Submit,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  // ArrayCards,
  FormButtonGroup,
} from "@formily/antd";
import TimePicker from "../components/TimePicker";
import DatePicker from "../components/DatePicker";
import DatePickerHijri from "../components/DatePickerHijri";
import ArrayCards from "../components/ArrayCards";
import FormStep from "./form-review-step";
import Text from "../components/Text";
import Signature from "../components/Signature";
import { Button } from "antd";
import ar_EG from "antd/locale/ar_EG";
import en_US from "antd/locale/en_US";
import "antd/dist/reset.css";
import { StyleProvider } from "@ant-design/cssinjs";
import moment from "moment";
import lodash from "lodash";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";
import { Schema } from "@formily/json-schema";

import "@formily/antd/dist/antd.css";

import {
  createForm,
  registerValidateMessageTemplateEngine,
} from "@formily/core";
import { FormProvider, FormConsumer, createSchemaField } from "@formily/react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import * as FormilyCore from "@formily/core";
import * as FormilyReact from "@formily/react";
import * as FormilyAntd from "@formily/antd";
import * as Antd from "antd";
import * as FormilyReactive from "@formily/reactive";

import { Card, Slider, Rate, ConfigProvider } from "antd";
import toast from "react-hot-toast";

import { useContext } from "react";
import { IntlContext, useIntl } from "react-intl";
import BuilderService from "../services/BuilderService";
import FormService from "../services/FormService";
import { SC } from "../api/serverCall";
import "./style.scss";
import DraftModal from "../models/DraftModal";
import AutoSave from "../components/AutoSave";
import { Spinner } from "reactstrap";
const Switch = (props) => {
  return <p>{props?.value ? "Yes" : "No"}</p>;
};
const NumberPicker = (props) => <h1>test</h1>;
const Editable = (props) => <h1>test</h1>;
const Select = (props) => {
  return <p>{props?.value || props?.value?.value || "-"}</p>;
};
const Input = (props) => <p>{props?.value || "-"}</p>;

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
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
  },
});
class FormSubmission {
  constructor() {}
}

const ReviewForm = () => {
  const intl = useIntl();
  const { form_id, id, task_id, show } = useParams();
  const navigation = useNavigate();

  // TODO: Get user from localstorage (get key from ENV file)
  let user = getUserData();
  const [form, setForm] = useState({});
  const [task, setTask] = useState();
  const [detailsShow, setShow] = useState(false);
  const [formData, setFormData] = useState({});
  const intlContext = useContext(IntlContext);
  const isEn = intlContext.locale === "en";
  const TRANSLATION = intl.messages;
  BuilderService.TRANSLATION = TRANSLATION;
  BuilderService.navigation = navigation;

  const dData = useMemo(() => {
    return formData ? JSON.parse(JSON.stringify(formData)) : null;
  }, [formData]);

  const renderForm = useMemo(() => {
    return createForm({
      values: dData,
    });
  }, [dData]);

  const draft = useMemo(() => {
    return new DraftModal({
      class_name: task_id ? task_id : form_id,
      isEdit: id,
      init: (data) => {
        if (!show || !id) {
          renderForm.setValues(data);
        }
      },
      getPayload: () => {
        return JSON.parse(JSON.stringify(renderForm.values));
      },
    });
  }, [renderForm]);

  const formatM = useCallback(
    (msg) => {
      if (msg) {
        return intl.formatMessage({
          id: msg,
          defaultMessage: msg,
        });
      }
    },
    [intl]
  );

  const getForm = () => {
    FormService.show(form_id).then((res) => {
      setForm(res.data.data);
    });
  };

  const getTask = () => {
    if (task_id) {
      FormService.getTask(task_id).then((res) => {
        setTask(res.data.data);
      });
    }
  };

  const getFormData = () => {
    BuilderService.show(id).then(setFormData);
  };

  const schema = useMemo(() => {
    if (form?.schema?.schema) {
      const _schema = JSON.parse(JSON.stringify(form?.schema?.schema));
      BuilderService.addArabic(_schema);

      if (task_id) {
        if (task) {
          let steps = task.steps.map(({ value }) => value);
          const parseSteps = (orignalSchema) => {
            orignalSchema = new Schema(orignalSchema);

            let mapProps = (s) => {
              s.mapProperties((schema, name) => {
                if (Object.keys(schema?.properties || {})) {
                  mapProps(schema);
                }

                if (schema["x-component"]?.indexOf("StepPane") > -1) {
                  if (!steps.includes(name)) {
                    schema.parent.removeProperty(name);
                  }
                }
              });
            };

            mapProps(orignalSchema);
            return orignalSchema;
          };
          return parseSteps(_schema);
        }

        return null;
      }

      return _schema;
    }
  }, [form?.schema, task, task_id]);

  useEffect(() => {
    getTask();
    getForm();
  }, [form_id]);

  useEffect(() => {
    if (id) getFormData();
  }, [id]);

  useEffect(() => {
    if (setShow) setShow(show);
  }, [show]);

  const formUtils = useMemo(() => {
    return {
      formId: form_id,
      submissionId: id,
      isShow: detailsShow,
      isEdit: !!id,
    };
  }, [form_id, id, detailsShow]);

  const GlobalUtility = useMemo(() => {
    if (form?.schema?.form) {
      const classString =
        form?.schema?.form?.global_utils ||
        `
      class GlobalUtilsClass {
        constructor() {
        }
      };
  `;

      const createClassFromStr = new Function(
        classString + " return GlobalUtilsClass;"
      );
      const DynamicClass = createClassFromStr();
      return new DynamicClass({
        lodash,
        moment,
        intl,
        toast,
        FormilyCore,
        FormilyReact,
        Antd,
        FormilyAntd,
        SchemaField,
        SC,
        FormilyReactive,
        user,
      });
    }
  }, [form?.schema?.form]);

  if (!schema) return <Spinner />;
  BuilderService.schema = schema;

  const handelSubmit = (e) => {
    if (id) {
      BuilderService.update(id, e, form_id);
    } else {
      BuilderService.create(form_id, e);
    }
    draft.clearDraft();
  };

  registerValidateMessageTemplateEngine((message) => {
    if (TRANSLATION[message]) {
      return TRANSLATION[message];
    }
    return message;
  });

  renderForm.disabled = detailsShow;
  const formStep = FormStep.createFormStep();

  return (
    <div dir="none">
      <ConfigProvider locale={isEn ? en_US : ar_EG}>
        <StyleProvider hashPriority="high">
          <Form {...form.schema.form} form={renderForm}>
            <SchemaField
              schema={schema}
              scope={{
                formStep,
                moment,
                lodash,
                formUtils,
                GlobalUtils: GlobalUtility,
                FormilyCore,
                FormilyReact,
                Antd,
                FormilyAntd,
                SchemaField,
                FormilyReactive,
              }}
            />
            <div className="d-flex justify-content-between flex-wrap mt-2">
              <AutoSave draft={draft} />
              <FormConsumer>
                {() => (
                  <FormButtonGroup className="justify-content-end m-2">
                    {BuilderService.isStepperForm && (
                      <>
                        <Button
                          disabled={!formStep.allowBack}
                          onClick={() => {
                            formStep.back();
                          }}
                        >
                          Previous
                        </Button>
                        <Button
                          disabled={!formStep.allowNext}
                          onClick={() => {
                            console.log(formStep.steps, "ilyas");
                            formStep.next();
                          }}
                        >
                          Next step
                        </Button>
                      </>
                    )}
                    {!detailsShow && (
                      <Submit
                        disabled={formStep.allowNext}
                        onSubmit={handelSubmit}
                        onSubmitSuccess={(e) => console.log("Success", e)}
                        onSubmitFailed={(e) =>
                          toast.error(
                            formatM("Please fill all the required fields!")
                          )
                        }
                        className="submitButton"
                      >
                        {formatM(id ? "Update" : "Submit")}
                      </Submit>
                    )}
                  </FormButtonGroup>
                )}
              </FormConsumer>
            </div>
          </Form>
        </StyleProvider>
      </ConfigProvider>
    </div>
  );
};

export default ReviewForm;
