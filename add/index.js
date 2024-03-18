import { StyleProvider } from "@ant-design/cssinjs";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  ArrayTable,
  Cascader,
  Checkbox,
  Editable,
  Form,
  // ArrayCards,
  FormButtonGroup,
  FormCollapse,
  FormGrid,
  FormItem,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  Switch,
  Transfer,
  TreeSelect,
  Upload,
} from "@formily/antd";
import { Schema } from "@formily/json-schema";
import { getUserData } from "@utils";
import { Button, Divider as ANTDDivider } from "antd";
import "antd/dist/reset.css";
import ar_EG from "antd/locale/ar_EG";
import en_US from "antd/locale/en_US";
import lodash from "lodash";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ArrayCards from "../components/ArrayCards";
import DatePicker from "../components/DatePicker";
import DatePickerHijri from "../components/DatePickerHijri";
import Signature from "../components/Signature";
import Text from "../components/Text";
import TimePicker from "../components/TimePicker";
import FormStep from "../components/form-step";

import "@formily/antd/dist/antd.css";

import * as FormilyAntd from "@formily/antd";
import * as FormilyCore from "@formily/core";
import {
  createForm,
  registerValidateMessageTemplateEngine,
} from "@formily/core";
import * as FormilyReact from "@formily/react";
import { FormConsumer, createSchemaField } from "@formily/react";
import * as FormilyReactive from "@formily/reactive";
import * as Antd from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { Card, Col, ConfigProvider, Modal, Rate, Row, Slider } from "antd";
import toast from "react-hot-toast";

import { useContext } from "react";
import { IntlContext, useIntl } from "react-intl";
import { Spinner } from "reactstrap";
import { SC } from "../api/serverCall";
import AutoSave from "../components/AutoSave";
import DraftModal from "../models/DraftModal";
import ReviewForm from "../review";
import BuilderService from "../services/BuilderService";
import FormService from "../services/FormService";
import TaskService from "../services/TaskService";
import "./style.scss";

const Divider = () => {
  return <ANTDDivider style={{ margin: 10 }} />;
};

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
    Divider,
  },
});

const FormRender = () => {
  const intl = useIntl();
  const { form_id, id, task_id, show } = useParams();
  const navigation = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formStep = useMemo(() => FormStep.createFormStep(), []);
  const [version, setVersion] = useState("1");
  const [isDev, setIsDev] = useState(
    () => localStorage.getItem("isDev") == "true"
  );

  // TODO: Get user from localstorage (get key from ENV file)
  let user = getUserData();
  const [form, setForm] = useState({});
  const [task, setTask] = useState();
  const [isSubmitting, setIsSubmitting] = useState();
  const [detailsShow, setShow] = useState(false);
  const [formReview, setReview] = useState(false);
  const [formReviewdata, setReviewdata] = useState(null);
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
      version,
      init: (data) => {
        if (!show || !id) {
          renderForm.setValues(data);
        }
      },
      getPayload: () => {
        return JSON.parse(JSON.stringify(renderForm.values));
      },
    });
  }, [renderForm, version]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl and period key are pressed simultaneously
      if (event.ctrlKey && event.key === ".") {
        setIsDev((o) => {
          localStorage.setItem("isDev", !o);
          return !o;
        });
      }
    };

    // Add event listener when the component mounts
    document.body.addEventListener("keydown", handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

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
    FormService.show(form_id + "?isDev=" + isDev).then((res) => {
      setForm(res.data.data);
      setVersion(res.data.version);
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
        renderForm,
      });
    }
  }, [form?.schema?.form]);

  if (!schema) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  BuilderService.schema = schema;

  const setIsReview = (e) => {
    setReview(true);
  };

  const handelSubmit = async (e) => {
    setIsModalOpen(false);
    setIsSubmitting(true);
    if (task_id) {
      try {
        let res = await TaskService.update(task_id, { data: e });

        if (res.status === 200) {
          toast.success(res?.data?.data);
          navigation("/My-task");
        } else {
          toast.error(res?.response?.data?.data);
        }
      } catch (error) {}
      setIsSubmitting(false);

      return;
    }

    if (id) {
      await BuilderService.update(id, e, form_id);
    } else {
      await BuilderService.create(form_id, e);
    }
    draft.clearDraft();
    setIsSubmitting(false);
  };

  registerValidateMessageTemplateEngine((message) => {
    if (TRANSLATION[message]) {
      return TRANSLATION[message];
    }
    return message;
  });

  renderForm.disabled = detailsShow;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div dir="none">
      <ConfigProvider locale={isEn ? en_US : ar_EG}>
        {isDev && <div className="devmode"></div>}
        <StyleProvider hashPriority="high">
          <Form {...form.schema.form} form={renderForm}>
            {formReview ? (
              <ReviewForm
                data={renderForm.values}
                formSchema={form}
                myTask={task}
              />
            ) : (
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
                  renderForm,
                }}
              />
            )}

            <div className="d-flex justify-content-between flex-wrap mt-2">
              <AutoSave draft={draft} />
              <FormConsumer>
                {() => (
                  <FormButtonGroup className="justify-content-end m-2">
                    <>
                      <Button
                        disabled={!formStep.allowBack}
                        onClick={() => {
                          if (formReview) setReview(false);
                          else formStep.back();
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        disabled={!formStep.allowNext}
                        onClick={() => {
                          formStep.next();
                        }}
                      >
                        Next step
                      </Button>
                    </>
                    <>
                      <Submit
                        disabled={formStep.allowNext}
                        onSubmit={showModal}
                        onSubmitSuccess={(e) => console.log("Success", e)}
                        onSubmitFailed={(e) =>
                          toast.error(
                            formatM("Please fill all the required fields!")
                          )
                        }
                        className="submitButton"
                        loading={isSubmitting}
                      >
                        {formatM(id || task?.data ? "Update" : "Submit")}
                      </Submit>
                    </>
                    <Modal
                      title="Steps Status"
                      open={isModalOpen}
                      onCancel={handleCancel}
                      footer={[
                        <Button key="back" onClick={handleCancel}>
                          Cancel
                        </Button>,
                        <Submit
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
                        </Submit>,
                      ]}
                    >
                      <Row gutter={[0, 16]}>
                        {formStep.stepsValidations.map((item) => {
                          return (
                            <>
                              <Col span={20}>{item.name}</Col>
                              <Col span={4}>
                                {item.validate ? (
                                  <CheckOutlined />
                                ) : (
                                  <CloseOutlined />
                                )}
                              </Col>
                            </>
                          );
                        })}
                      </Row>
                    </Modal>
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

export default FormRender;
