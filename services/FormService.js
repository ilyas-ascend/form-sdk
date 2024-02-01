import { Resources } from "./Resource";
import { SC } from "../api/serverCall";

class Service extends Resources {
  SC = SC;
  route = "form";
  routes = {
    find: "",
    create: "/create",
    show: "/show",
    update: "/update",
    delete: "/delete",
    allForms: this.route + "/all-forms",
  };

  constructor() {
    super(arguments);
  }

  getAllForms() {
    return SC.getCall({ url: this.routes.allForms });
  }
}

const FormService = new Service();

export default FormService;
