import React, { useState } from "react";
import { Spinner, Button } from "reactstrap";
import FormSubmissionService from "../services/FormSubmissionService";
import ExcelService from "../services/ExcelService";

const DownloadIcon = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.1723 24.3092L22.8546 20.627V23.6165H23.9848V18.6947H19.0264V19.8249H22.0525L18.3702 23.5072L19.1723 24.3092ZM3.20353 24.1634C2.54728 24.1634 1.98825 23.9325 1.52645 23.4707C1.06464 23.0089 0.83374 22.4499 0.83374 21.7936V3.19987C0.83374 2.54362 1.06464 1.98459 1.52645 1.52279C1.98825 1.06098 2.54728 0.830078 3.20353 0.830078H21.7973C22.4535 0.830078 23.0126 1.06098 23.4744 1.52279C23.9362 1.98459 24.1671 2.54362 24.1671 3.19987V11.877C23.8997 11.7797 23.6508 11.7005 23.4204 11.6392C23.189 11.579 22.9518 11.5245 22.7087 11.4759V3.19987C22.7087 2.95681 22.6174 2.74438 22.4346 2.56258C22.2528 2.3798 22.0403 2.28841 21.7973 2.28841H3.20353C2.96048 2.28841 2.74805 2.3798 2.56624 2.56258C2.38346 2.74438 2.29207 2.95681 2.29207 3.19987V21.7936C2.29207 22.0367 2.38346 22.2491 2.56624 22.4309C2.74805 22.6137 2.96048 22.7051 3.20353 22.7051H11.4431C11.4917 22.9724 11.5403 23.2213 11.5889 23.4517C11.6376 23.6831 11.7105 23.9204 11.8077 24.1634H3.20353ZM2.29207 22.7051V2.28841V11.4759V11.3665V22.7051ZM5.93791 18.7311H11.6983C11.7712 18.4881 11.8505 18.245 11.936 18.002C12.0206 17.7589 12.1115 17.5158 12.2087 17.2728H5.93791V18.7311ZM5.93791 13.2259H15.5264C16.0126 12.8856 16.4865 12.5998 16.9483 12.3684C17.4101 12.138 17.9084 11.9499 18.4431 11.804V11.7676H5.93791V13.2259ZM5.93791 7.7207H19.0629V6.26237H5.93791V7.7207ZM21.2504 27.2624C19.6219 27.2624 18.2424 26.6912 17.1117 25.5488C15.9819 24.4065 15.4171 23.0332 15.4171 21.429C15.4171 19.8006 15.9819 18.421 17.1117 17.2903C18.2424 16.1606 19.6219 15.5957 21.2504 15.5957C22.8789 15.5957 24.258 16.1606 25.3877 17.2903C26.5184 18.421 27.0837 19.8006 27.0837 21.429C27.0837 23.0332 26.5184 24.4065 25.3877 25.5488C24.258 26.6912 22.8789 27.2624 21.2504 27.2624Z"
      fill="#677888"
    />
  </svg>
);

const ExportExcelComponent = (props) => {
  const [loading, setLoading] = useState(false);

  const exportData = async () => {
    const { form_id } = props;
    setLoading(true);
    await FormSubmissionService.all({ id: form_id }).then((res) => {
      let excel = new ExcelService(
        res.data.schema.data.schema.schema,
        res.data.data,
        res.data.schema.data
      );
      excel.generateExcel();
      setLoading(false);
    });
  };
  return (
    <Button.Ripple onClick={exportData} className="export-button">
      <div className="icon">
        {loading ? (
          <Spinner size="lg" color="#6F7070" />
        ) : (
          <figure> {DownloadIcon}</figure>
        )}{" "}
      </div>
    </Button.Ripple>
  );
};

export default ExportExcelComponent;
