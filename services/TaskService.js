import { Resources } from "./Resource";

import toast from "react-hot-toast";

class Service extends Resources {
  route = "tasks";
  routes = {
    find: "",
    create: "/create",
    show: "/show",
    update: "/update",
    delete: "/delete",
  };
  commentPostUrl = "tasks/comment/store";
  commentDeleteUrl = "tasks/comment/delete";
  commentUpdateUrl = "tasks/comment/update";

  constructor() {
    super(arguments);
  }

  getHeaders(obj) {
    return Object.keys(obj);
  }

  submitTask = async (item) => {
    if (await item.isValid()) {
      let data = item.getPayload();

      this.update(item.task._id, { data }).then((res) => {
        if (res.status === 200) {
          toast.success(res?.data?.data);
          item?.draft?.clearDraft?.();
          //   NavigationService.Navigation("/My-Task");
        } else {
          toast.error(res?.response?.data?.data);
        }
      });
      return;
    }
  };
}
const TaskService = new Service();
export default TaskService;
