import { SC } from "../api/serverCall";

export class Resources {
  async create(data) {
    return SC.postCall({
      url:
        this.route +
        (this.disableDefault ? "" : this.routes?.create || "-create"),
      data,
    });
  }

  async find(params = {}) {
    return SC.getCall({
      url:
        this.route +
        (this.disableDefault
          ? ""
          : typeof this.routes?.find === "string"
            ? this.routes?.find
            : "-index"),
      params,
    });
  }

  async show(id) {
    return SC.getCall({
      url:
        this.route +
        (this.disableDefault ? "" : this.routes?.show || `-show`) +
        `/${id}`,
    });
  }

  async update(id, data) {
    return SC.putCall({
      url:
        this.route +
        (this.disableDefault ? "" : this.routes?.update || `-update`) +
        `/${id}`,
      data,
    });
  }

  async delete(id) {
    return SC.deleteCall({
      url:
        this.route +
        (this.disableDefault ? "" : this.routes?.delete || `-delete`) +
        `/${id}`,
    });
  }

}
