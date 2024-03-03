import { Resources } from "./Resource";
import { SC } from "../api/serverCall";

class Service extends Resources {
  route = "FormSubmission";
  routes = {
    find: "",
    create: "/create",
    show: "/show",
    update: "/update",
    delete: "/delete",
    all: "/all",
  };
  ranking = {};

  constructor() {
    super(arguments);
  }

  async all(params = {}) {
    return SC.getCall({
      url: this.route + this.routes.all,
      params,
    });
  }
}

const FormSubmissionService = new Service();
export default FormSubmissionService;
