import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { getValidPhone } from "../Helper/utils";
import AuthUser from "../services/AuthService";
import { ModuleService, SchedulePusherService } from "../services";
import React from "react";
import Inspector from "./InspectorModel";

export class TaskUser {
  _id = "";
  name = "";
  email = "";
  phone = "";
  label = "Select";
  value = "";
  module_ids = [];

  isAssigningModule = false;

  constructor(user) {
    this.setUser(user);
    makeAutoObservable(this);
  }

  setUser = (user) => {
    if (user) {
      this._id = user._id;
      this.value = user._id;
      this.name = user.name;
      this.email = user.email.trim();
      this.phone = getValidPhone(user.phone);
      this.label = `${user.name} (${user.email})`;
      this.module_ids = user.module_ids;
    }
  };

  setAttribute(name, value) {
    this[name] = value;
  }

  getPayload() {
    let payload = {};
    payload.phone = this.phone;
    payload.name = this.name;
    payload.email = this.email;
    payload._id = this._id;
    payload.steps = this.steps;

    return payload;
  }

  attachModule = (module_id) => {
    this.isAssigningModule = true;
    ModuleService.assignModule(this._id, module_id).then((res) => {
      let user = res?.data?.data;
      this.setUser(user);
      this.isAssigningModule = false;
    });
  };

  checkIsModuleExist = (id) => {
    return this.module_ids?.includes?.(id);
  };
}

class TaskModal {
  _id = "";
  schedule_id = "";
  user_id = "";
  assigned_from = "";
  form_name = "";
  status = "";
  steps = [];
  is_completed = null;
  updated_at = "";
  created_at = "";
  start_date = "";
  due_date = "";
  data = null;
  submitted_date = "";
  reportNumber = "";
  is_pending = null;
  is_initiated = null;
  is_cancelled = null;
  is_submitted = null;
  is_approved = null;
  is_rejected = null;
  history = [];

  taskInspectorRef = null;
  signature = null;
  signatureImg = null;

  reject_reason = "";
  user = new TaskUser();
  creator = "";
  isOpen = true;
  "task:identification" = null;
  comments = [];
  schedule = "";
  meta_data = null;

  constructor(task) {
    this.__id = uuidv4();
    this.init(task);
    this.taskInspectorRef = React.createRef();

    // if (task) {
    //   SchedulePusherService.subscribe(task._id, this.init);
    // }
    makeAutoObservable(this);
  }

  init = (task) => {
    if (task) {
      Object.entries(task).forEach(([key, value]) => {
        if (this.hasOwnProperty(key)) {
          switch (key) {
            case "user":
              this.user = new TaskUser(value);
              break;

            default:
              this[key] = value;
          }
        }
      });

      if (this.data && this.data["task:identification"]) {
        this["task:identification"] = new Inspector(
          this.data["task:identification"]
        );
      }
    }
  };
  setSignatureRef(ref) {
    this.taskInspectorRef.current = ref;
    if (this.signature && ref?.fromData) {
      ref.fromData(this.signature);
      setTimeout(() => {
        this.signatureImg = ref.toDataURL();
      }, 1000);
    }
  }

  setSignValues = () => {
    if (this.taskInspectorRef?.current) {
      this.signature = this.taskInspectorRef.current.toData();
      this.signatureImg = this.taskInspectorRef.current.toDataURL();
    }
  };

  isValid() {
    let check = true;

    return check;
  }

  getPayload() {
    let user = this.user.getPayload();
    let payload = {
      ...user,
      steps: this.steps,
    };

    return payload;
  }

  getSignature() {
    return this.signature;
  }

  getInspectorDetails = () => {
    return this["task:identification"].getPayload();
  };

  setAttribute(name, value) {
    if (name) {
      this[name] = value;
    }
  }

  clearSteps = () => {
    this.steps = [];
  };

  get selectedSteps() {
    return this.steps.map(({ value }) => value);
  }

  updateUser(user) {
    this.user.setUser(user);
  }

  setPhone(phone) {
    this.user.phone = phone;
  }

  get showCancel() {
    return this.is_pending;
  }

  get showStart() {
    return this.is_pending || this.showEdit;
  }

  get showEdit() {
    return this.is_initiated || this.is_submitted || this.is_rejected;
  }

  get canSeeApprove() {
    return (
      this.is_submitted &&
      (AuthUser.isAdmin ||
        AuthUser.isRegionalRepresentatives ||
        AuthUser.isSupervisor)
    );
  }

  get canReassign() {
    return !this.is_submitted && !this.is_approved;
  }
}

export default TaskModal;
