import React from "react";

import { FormattedMessage } from "react-intl";
import { Button } from "reactstrap";

import moment from "moment";
import Synchronize from "./synchronize.png";
import { observer } from "mobx-react";
import "./style.scss";

function AutoSaveComponent({ draft }) {
  return draft?.isDrafting ? (
    <div
      className="d-flex flex-row mb-2"
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <div
        className="d-flex flex-column  justify-content-center "
        style={{ padding: 5, paddingLeft: 15 }}
      >
        <p
          style={{
            color: "#171B1E",
            padding: 0,
            margin: 0,
            fontSize: 11,
            fontWeight: "700",
          }}
        >
          <FormattedMessage
            id="Last saved time:"
            defaultMessage={"Last saved time:"}
          />
        </p>
        <div className="d-flex align-items-center justify-content-center">
          <div style={{ width: 230 }}>
            <p
              style={{ color: "#7D7D7D", padding: 0, margin: 0, fontSize: 12 }}
            >
              {moment(draft.lastSaveTime).format("MMM Do YYYY, h:mm:ss a ")}
              <i>
                ( 0{draft.saveCountDown} sec ) {` `}
              </i>
            </p>
          </div>
          <SyncComp onClick={draft.sync} isAnimate={draft.isSaving} />
        </div>
      </div>
      &nbsp; &nbsp; &nbsp;
      <Button
        size="sm"
        onClick={draft.discardDraft}
        style={{ backgroundColor: "red !important" }}
        className="discard-btn"
        color="danger"
      >
        <FormattedMessage
          defaultMessage={"Discard Changes"}
          id="Discard Changes"
        />
      </Button>
    </div>
  ) : (
    <div></div>
  );
}

export default observer(AutoSaveComponent);

const SyncComp = ({ onClick = () => { }, isAnimate = false }) => {
  return (
    <img
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      src={Synchronize}
      className={isAnimate ? "sync_imag_animate" : ""}
      style={{
        height: 25,
        marginLeft: 2,
      }}
    />
  );
};
