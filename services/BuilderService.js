import toast from "react-hot-toast";
import { SC } from "../api/serverCall"

class Service {
  TRANSLATION = {};
  navigation = null
  schema = {}
  SC = SC

  constructor() { }

  async find(id) {
    try {
      const res = await this.SC.getCall({ url: `FormSubmission/${id}` });
      return res.data.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  async show(id) {
    try {
      const res = await this.SC.getCall({ url: `FormSubmission/show/${id}` });
      return res.data.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  async create(id, data) {
    try {
      const res = await this.SC.postCall({ url: `FormSubmission/create`, data: { data, id } });
      toast.success(res.data.data);
      this.navigation(`Form-Builder/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, data, task_id) {
    try {
      const res = await this.SC.putCall({
        url: `FormSubmission/update/${id}`,
        data: { data },
      });

      toast.success(res.data.data);
      this.navigation(`Form-Builder/${task_id}`);
    } catch (error) {
      console.log(error);
    }
  }

  // Create a new object mapping "x-designable-id" to "x-component"
  componentName(structure) {
    structure = JSON.parse(JSON.stringify(structure));
    const idToComponentMap = {};

    const stack = [structure];

    while (stack.length > 0) {
      const current = stack.pop();

      if (
        typeof current === "object" &&
        "x-designable-id" in current &&
        "x-component" in current
      ) {
        const id = current["x-designable-id"];
        const component = current["x-component"];
        idToComponentMap[id] = component;
      }

      for (const key in current) {
        if (typeof current[key] === "object") {
          stack.push(current[key]);
        }
      }
    }

    return idToComponentMap;
  }

  addArabic(obj) {
    for (const key in obj) {
      if (
        [
          "title",
          "description",
          "placeholder",
          "prefix",
          "addonBefore",
          "addonAfter",
          "suffix",
          "tooltip",
        ].includes(key) &&
        typeof obj[key] === "string"
      ) {
        if (this.TRANSLATION[obj[key]]) {
          obj[key] = this.TRANSLATION[obj[key]];
          obj["en_" + key] = obj[key];
        }
      }

      if (key === "enum" && Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          if (item.label && typeof item.label === "string") {
            if (this.TRANSLATION[item.label]) {
              item.label = this.TRANSLATION[item.label];
            }
          }
          if (item.value && typeof item.value === "string") {
            if (this.TRANSLATION[item.value]) {
              item.value = this.TRANSLATION[item.value];
            }
          }
        }
      } else if (typeof obj[key] === "object") {
        this.addArabic(obj[key]);
      }
    }
  }

  get isStepperForm() {
    return (JSON.stringify(this.schema) + "").includes("FormStep");
  }
}
const BuilderService = new Service();

export default BuilderService;
