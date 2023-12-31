import React, { useState } from "react";
import { Spinner } from "reactstrap";
import { SC } from "../api/serverCall"

const DownloadIcon = (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
        <mask
            id="mask0_611_85314"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="24"
        >
            <rect x="0.251953" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_611_85314)">
            <path
                d="M4.55965 19.5C4.05452 19.5 3.62695 19.325 3.27695 18.975C2.92695 18.625 2.75195 18.1974 2.75195 17.6923V6.3077C2.75195 5.80257 2.92695 5.375 3.27695 5.025C3.62695 4.675 4.05452 4.5 4.55965 4.5H9.1173V5.99998H4.55965C4.48272 5.99998 4.41219 6.03203 4.34808 6.09613C4.28398 6.16024 4.25193 6.23077 4.25193 6.3077V17.6923C4.25193 17.7692 4.28398 17.8397 4.34808 17.9038C4.41219 17.9679 4.48272 18 4.55965 18H19.9442C20.0211 18 20.0917 17.9679 20.1558 17.9038C20.2199 17.8397 20.2519 17.7692 20.2519 17.6923V6.3077C20.2519 6.23077 20.2199 6.16024 20.1558 6.09613C20.0917 6.03203 20.0211 5.99998 19.9442 5.99998H15.3866V4.5H19.9442C20.4493 4.5 20.8769 4.675 21.2269 5.025C21.5769 5.375 21.7519 5.80257 21.7519 6.3077V17.6923C21.7519 18.1974 21.5769 18.625 21.2269 18.975C20.8769 19.325 20.4493 19.5 19.9442 19.5H4.55965ZM12.2519 15.15L7.5981 10.4961L8.65193 9.44233L11.502 12.2923V4.5H13.0019V12.2923L15.8519 9.44233L16.9058 10.4961L12.2519 15.15Z"
                fill="#888888"
            />
        </g>
    </svg>
);


const ExportExcelComponent = (props) => {
    const [loading, setLoading] = useState(false);

    const exportData = async () => {
        const { url, params, exportName } = props;
        setLoading(true);
        await SC.getCall({ url: url, params: {}, responseType: "blob" }).then((res) => {
            try {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(res.data);
                link.download = exportName || "Export";
                link.click();
                setLoading(false);
            } catch (error) {
                setLoading(false);
                // toast.error(IntlService.m("There is a problem with your network connection!"));
            }
        }
        )
    };

    return (
        <button disabled={loading} className="export-label" onClick={exportData}>
            {loading ? <Spinner /> : <DownloadIcon />}
            <span className="align-middle">Export</span>
        </button>
    );
};

export default ExportExcelComponent;
