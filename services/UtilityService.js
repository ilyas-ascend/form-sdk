import axios from "axios";

class Service {


  checkInternet() {
    return new Promise((resolve) => {
      axios({ url: "https://httpbin.org/get", method: "GET", timeout: 5000 })
        .then((res) => {
          if (
            res.message === "Network Error" ||
            res.message?.includes?.("timeout")
          ) {
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch((e) => {
          resolve(false);
        });
    });
  }
}

const UtilityService = new Service();
export default UtilityService;
