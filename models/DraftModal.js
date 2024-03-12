import React from "react";
import { makeAutoObservable, runInAction } from "mobx";
import moment from "moment";

import {
  makePersistable,
  getPersistedStore,
  stopPersisting,
  clearPersistedStore,
} from "mobx-persist-store";
import localForage from "localforage";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);

const handlers = {};
let locationListner = null;

class DraftModal {
  slug = "";
  draft = "";
  isLoading = false;
  isDrafting = null;

  isSaving = false;
  autoSaveTime = 1; // min
  lastSaveTime = moment();
  saveCountDown = 9;

  autoSaveHandler = null;
  countDownTimerHandler = null;

  isDraftLoaded = false;
  payload = null;
  isDiscarded = false;
  version = "";

  constructor(parent) {
    this.parent = parent;
    this.slug = this.parent.class_name;
    this.isDrafting = !parent.isEdit;
    this.version = parent.version;

    makeAutoObservable(this);
    makePersistable(
      this,
      {
        name: this.parent.class_name,
        properties: ["payload"],
        storage: localForage,
      },
      { delay: 100, fireImmediately: false }
    );
    this.init();
  }

  init = () => {
    if (this.isDrafting) {
      this.getDraft();
      this.autoSave();
      // this.onTabClose();
      this.onLocationChange();
    }
  };

  onLocationChange = () => {};

  clearDraft = async () => {
    this.removeListner();
    await this.clearStoredData();
  };

  autoSave = () => {
    this.removeListner();

    const counter = () => {
      runInAction(() => {
        this.saveCountDown = 9;
      });

      if (handlers[this.slug + "countDownTimerHandler"]) {
        clearInterval(handlers[this.slug + "countDownTimerHandler"]);
      }
      handlers[this.slug + "countDownTimerHandler"] = setInterval(() => {
        runInAction(() => {
          this.saveCountDown--;
        });
      }, 1000);
    };

    handlers[this.slug + "_autoSaveHandler"] = setInterval(() => {
      counter();

      this.saveDraft();
    }, this.autoSaveTime * 10 * 1000);

    counter();
  };

  sync = async () => {
    await this.saveDraft();
    this.autoSave();
  };

  onTabClose = () => {};

  getDraft = async () => {
    runInAction(async () => {
      this.isLoading = true;
      if (this.isDrafting) {
        let { payload } = await getPersistedStore(this);
        if (payload) {
          // const draft = await DraftService.find({ slug: this.slug });
          this.draft = payload;
          if (this.draft) {
            this.parent.init(this.draft);
          }
        }
      }
    });
  };

  saveDraft = async () => {
    if (window?.document?.hidden) return;
    runInAction(async () => {
      this.isSaving = true;
      this.draft = this.parent.getPayload(true);
      this.payload = this.parent.getPayload(true);

      setTimeout(() => {
        runInAction(() => {
          this.lastSaveTime = moment();
          this.isSaving = false;
        });
      }, 1000);
    });
  };

  setLoading = (check) => {
    runInAction(() => {
      this.isLoading = check;
    });
  };

  removeListner = () => {
    Object.entries(handlers).forEach(([key, value]) => {
      if (value) {
        clearInterval(value);
        delete handlers[key];
      }
    });

    if (locationListner) {
      locationListner.unsubscribe();
    }
  };

  stopAutoSave = () => {
    this.removeListner();
  };

  discardDraft = async () => {
    let { isConfirmed } = await discardAutoSave();

    if (isConfirmed) {
      this.stopAutoSave();
      this.payload = null;
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  clearStoredData = async () => {
    await clearPersistedStore(this);
  };

  stopStore = () => {
    stopPersisting(this);
  };
}

const discardAutoSave = async (data) => {
  const Abc = () => {
    return (
      <div>
        <h4>Auto saved data</h4>
        <p class="confirm-class-head">Are you sure you want to discard?</p>
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
export default DraftModal;
