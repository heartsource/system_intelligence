import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import "../../Styles/configAgentLogDetails.css";

const ConfigAgentLogDetails = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
  });

  const handleMouseOver = () => {
    setShowPopover(true);
  };

  const handleMouseOut = () => {
    setShowPopover(false);
  };

  return (
    <>
      <div className="logDetails-fieldset-container">
        <div className="mainRow">
          <fieldset id="logDetailsFieldset">
            <legend id="logDetailsLegend">
              Agent Log Details
              <i className="fa-solid fa-user-pen"></i>
            </legend>
            <hr />
            <div className="row">
              <div className="column">
                <div className="first-col">
                  Interaction Id &nbsp;{" "}
                  <span style={{ color: "gray" }}>id0980326454wifg</span>
                </div>
              </div>
              <div className="column">
                <div className="sec-col">
                  Interaction Date&nbsp;{" "}
                  <span style={{ color: "gray" }}>June 12,2024 11:35</span>
                </div>
              </div>
              <div className="column">
                <div className="third-col">
                  Duration&nbsp;{" "}
                  <span style={{ color: "gray" }}>29 Seconds</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="column">
                <div className="first-col">
                  Model &nbsp; <span style={{ color: "gray" }}>ChatGPT 4</span>
                </div>
              </div>
              <div className="column">
                <div className="sec-col">
                  Flow &nbsp; <span style={{ color: "gray" }}>RAG</span>
                </div>
              </div>
              <div className="column">
                <div className="third-col">
                  Template &nbsp;
                  <span
                    style={{ cursor: "pointer", color: "rgb(45, 182, 212)" }}
                    ref={setReferenceElement}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}>
                    View
                  </span>
                  {showPopover && (
                    <div
                      ref={setPopperElement}
                      style={styles.popper}
                      {...attributes.popper}
                      className="logDetails-popover">
                      <div className="logDetails-popover-content">
                        Template Content
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="mainRow">
          <fieldset id="interactionFieldset">
            <legend id="interactionLegend">Agent Interaction</legend>
            <hr />
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default ConfigAgentLogDetails;
