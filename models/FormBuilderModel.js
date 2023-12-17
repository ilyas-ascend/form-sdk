import { autorun, makeAutoObservable } from "mobx";
import FileUploadModal from "./FileUploadModel";
import { SC } from "../api/serverCall";
import toast from "react-hot-toast";

export const formFields = {};

export class FormBuilderModel {
  //crete
  formName = null;
  icon = new FileUploadModal();
  modalShow = false;

  createValidation = false;

  constructor(props, task) {
    makeAutoObservable(this);
  }

  toggleModel = () => {
    this.modalShow = !this.modalShow;
    this.icon = new FileUploadModal();
  };

  validateCreate = () => {
    let check = false;
    check = !!this.formName && !!this.icon.images.length;
    this.createValidation = !check;
    return check;
  };

  getCreatePayload = () => {
    let payload = {};
    payload.formName = this.formName;
    payload.icon = this.icon;
    return payload;
  };

  submitCreate = (setCreateModal, callback) => {
    let postData = {
      name: this.formName,
      icon: this.icon.images[0],
    };
    SC.postCall({ url: "form/create", data: postData }).then((res) => {
      if (res.status == 200) {
        this.toggleModel();
        toast.success("Form Created successfully!");
        callback()
      }
    });
  };
  onEdit = (id) => {
    SC.getCall({ url: `form/edit-builder/${id}` }).then((res) => {
      if (res.status == 200) {
        // console.log("res", res);
        window.open(res.data.link);
      }
    });
  };

  handleChange = (key, value) => {
    this[key] = value;
    autorun(() => {});
  };

  init = (props) => {};

  get dropDownKeys() {
    return [];
  }

  getPayload(isDraft) {
    let payload = {};

    return payload;
  }
}
