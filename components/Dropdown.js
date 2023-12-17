import React, { useRef, useState } from "react";
import { DropdownMenu, DropdownItem, Dropdown } from "reactstrap";
import { useRTL } from "@hooks/useRTL";
import { FormattedMessage } from "react-intl";

function DropdownB({
    row,
    showData,
    DeleteData,
    onEdit = () => { },
    disableEdit = false,
    isExport = false,
    isDetails = true,
    direction = "",
    onClose = () => { },
    exportItem = () => { },
    style = {},
    user = {
        type: "",
    },
    isEdit = true,
    isDelete = true,
    editTitle = "Edit",
    detailsText = "Details"

}) {
    const type = user.type?.toLowerCase();
    const parentRef = useRef();
    const [update, setUpdate] = useState(false);
    const [isRtl] = useRTL();

    let p = parentRef?.current?.getBoundingClientRect?.();

    return (
        <div
            ref={(ref) => {
                parentRef.current = ref;
                setUpdate((r) => !r);
            }}
        >
            <Dropdown
                isOpen={true}
                toggle={onClose}
                style={{
                    position: "absolute",
                    transform: `translateX(${row.clientX +
                        (isRtl ? 30 : -180) -
                        (isRtl ? p?.right : p?.left || 0)
                        }px) translateY(${row.clientY - 50 - (p?.top || 0)}px)`,
                    zIndex: 100,
                }}
            >
                <DropdownMenu>


                    {isEdit && (
                        <DropdownItem
                            href="/"
                            tag="a"
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit(row._id);
                            }}
                        >
                            <FormattedMessage id={editTitle} defaultMessage={editTitle} />
                        </DropdownItem>
                    )}

                    {isDetails && (
                        <DropdownItem
                            href="/"
                            tag="a"
                            onClick={(e) => {
                                e.preventDefault();
                                showData(row._id);
                            }}
                        >
                            <FormattedMessage id={detailsText} defaultMessage={detailsText} />
                        </DropdownItem>
                    )}

                    {isExport && (
                        <DropdownItem
                            href="/"
                            tag="a"
                            onClick={(e) => {
                                e.preventDefault();
                                exportItem(row);
                            }}
                        >
                            <FormattedMessage id="Export" defaultMessage="Export" />
                        </DropdownItem>
                    )}
                    {isDelete && (
                        <DropdownItem
                            href="/"
                            tag="a"
                            onClick={(e) => {
                                e.preventDefault();
                                DeleteData(row._id);
                            }}
                        >
                            <FormattedMessage id="Delete" defaultMessage="Delete" />
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
export default DropdownB;
