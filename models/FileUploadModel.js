import React, { createRef } from "react";
import { makeAutoObservable, } from "mobx";

class FileUploadModal {
  images = [];
  fileRef = null;
  isAllFilesUploaded = false;
  constructor(payload) {
    this.fileRef = React.createRef();
    if (payload?.length) {
      this.setImages(payload);
      this.isAllFilesUploaded = true;
    }
    makeAutoObservable(this);
  }

  setImages = (images = []) => {
    this.images = images;
  };

  setIsUploading = (check) => {
    this.isAllFilesUploaded = check;
  };

  onUploadingComplete = () => {
    this.setIsUploading(this.fileRef.current?.checkIsAllFilesUploaded?.());
  };

  get isImages() {
    return !!this.images?.length;
  }
}

export default FileUploadModal;
