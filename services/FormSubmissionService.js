import { Resources } from "./Resource";
class Service extends Resources {
  route = "FormSubmission";
  routes = {
    find: "",
    create: "/create",
    show: "/show",
    update: "/update",
    delete: "/delete",
  };
  ranking = {};

  constructor() {
    super(arguments);
  }

}

const FormSubmissionService = new Service();
export default FormSubmissionService;
