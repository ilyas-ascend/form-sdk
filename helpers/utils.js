import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import startCase from "lodash/startCase";
import { X, Check } from "react-feather";
import { observer } from "mobx-react";
import ReactSignatureCanvas from "react-signature-canvas";
import toast from "react-hot-toast";
const MySwal = withReactContent(Swal);

export const phoneValidator = (value) => String(value).match(/\d/g)?.length > 8;

export const emailValidator = (value) =>
  String(value)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

export const getValidPhone = (phone) => {
  if (phone) {
    phone = (phone + "").split(" ").join("");

    return phone.substr(phone.length - 9);
  }

  return "";
};

const Signature = observer(({ taskInspector }) => {
  return (
    <div className="signature">
      <ReactSignatureCanvas
        ref={(ref) => {
          try {
            taskInspector.setSignatureRef(ref);
          } catch (error) {}
        }}
        penColor="black"
        canvasProps={{
          className: "signature-canvas",
        }}
        clearOnResize={false}
        onEnd={() => taskInspector.setSignValues()}
      />
    </div>
  );
});
export const StepsAlert = async (data, task) => {
  const Abc = () => {
    return (
      <div>
        <h1>Status</h1>
        {task && (
          <div className="my-1">
            <p style={{ textAlign: "left", margin: 0 }}>{"Signature"} *</p>
            <Signature taskInspector={task} />
          </div>
        )}
        <table>
          <tbody>
            {data.map((obj, index) => {
              return (
                <tr key={index}>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    {obj.isCompleted ? (
                      <Check size={20} color="green" />
                    ) : (
                      <X size={20} color="red" />
                    )}

                    <h6>{startCase(obj.title)} </h6>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p class="confirm-class-head">Are you sure you want to submit?</p>
      </div>
    );
  };
  return MySwal.fire({
    html: Abc(),
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Ok",
    preConfirm: () => {
      if (task) {
        if (task.signatureImg) {
          return true;
        } else {
          toast.error("Please fill the signature field!");
          return false;
        }
      }
      return true;
    },
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-outline-danger ms-1",
    },
    buttonsStyling: false,
  });
};

export const scrollToRequired = () => {
  setTimeout(() => {
    try {
      document.querySelectorAll(".invalid-feedback").forEach((element) => {
        let check = element.previousSibling.getAttribute("aria-invalid");
        console.log(typeof check, check);
        if (check === "true") {
          window.scrollTo({
            behavior: "smooth",
            top:
              element.getBoundingClientRect().top -
              document.body.getBoundingClientRect().top -
              160,
          });
          throw "done";
        }
      });
    } catch (error) {}
  }, 100);
};

export const discardAutoSave = async (data) => {
  const Abc = () => {
    return (
      <div>
        <h4>{"Auto saved data"}</h4>
        <p class="confirm-class-head">{"Are you sure you want to discard?"}</p>
      </div>
    );
  };
  return MySwal.fire({
    html: Abc(),
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Ok",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-outline-danger ms-1",
    },
    buttonsStyling: false,
  });
};
