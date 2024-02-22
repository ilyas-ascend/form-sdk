import { makeAutoObservable, autorun, toJS, reaction, observe } from "mobx";
import React, { createRef } from "react";
import { phoneValidator, emailValidator, getValidPhone } from "../Helper/utils";
import { v4 as uuidv4 } from "uuid";

class Inspector {
  name = "";
  email = "";
  phone = "";
  signature = "";
  signatureRef = null;
  signatureImg = "";
  isOpen = true;
  user = null;

  steps = [];

  constructor(user) {
    this.__id = uuidv4();
    if (user) {
      this.name = user.name || "";

      this.email = user.email || "";
      this.phone = user.phone || "";
      this.getLabel(user);
      this.signature = user.signature || "";
      this.steps = user.steps || [];
    }

    this.signatureRef = React.createRef();

    makeAutoObservable(this);
  }

  getLabel(user) {
    if (user?.name) {
      this.user = {
        ...user,
        label: user.name || "" + ` (${user.email || ""})`,
        value: user._id,
      };
      this.email = user.email;
      this.phone = getValidPhone(user.phone);
      this.signature = user.signature;
    }
  }

  setValues = () => {
    if (this.signatureRef?.current) {
      this.signature = this.signatureRef.current.toData();
      this.signatureImg = this.signatureRef.current.toDataURL();
    }
  };

  setSignatureRef(ref) {
    this.signatureRef.current = ref;
    if (this.signature && ref?.fromData) {
      ref.fromData(this.signature);
      setTimeout(() => {
        this.signatureImg = ref.toDataURL();
      }, 1000);
    }
  }

  isUserValid = () => {
    return this.email && phoneValidator(this.phone) && this.user;
  };

  isValid() {
    let check =
      emailValidator(this.email) &&
      phoneValidator(this.phone) &&
      this.user &&
      this.signature?.length;

    return check;
  }

  getPayload() {
    let payload = {};
    payload.phone = this.phone;
    payload.name = this.name;
    payload.email = this.email;
    payload._id = this.user?._id;
    payload.signature = this.signature;
    payload.steps = this.steps;

    return payload;
  }

  setAttribute(name, value) {
    if (name) {
      this[name] = value;
    }
  }

  clearCanvas() {
    if (this.signatureRef?.current) {
      this.signatureRef?.current.clear();
      this.signature = "";
    }
  }

  updateUser(user) {
    this.email = user.email.trim();
    this.phone = getValidPhone(user.phone);
    this.name = user?.name;
    this.user = user;
  }

  clearSteps = () => {
    this.steps = [];
  };

  get selectedSteps() {
    return this.steps.map(({ value }) => value);
  }
}

export default Inspector;
