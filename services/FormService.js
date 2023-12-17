import { Resources } from "./Resource";
class Service extends Resources {
  route = "form";
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

const FormService = new Service()

export default FormService
