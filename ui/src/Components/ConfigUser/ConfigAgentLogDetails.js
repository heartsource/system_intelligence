import React, { useState, useContext, useEffect } from "react";
import { usePopper } from "react-popper";
import { AppContext } from "../../context/AppContext";
import "../../Styles/configAgentLogDetails.css";

const ConfigAgentLogDetails = () => {
  const { selectedAgent } = useContext(AppContext);
  const [showPopover, setShowPopover] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement);

  useEffect(() => {
    if (showPopover && popperElement) {
      const popperRect = popperElement.getBoundingClientRect();
      popperElement.style.position = "fixed";
      if (selectedAgent.template) {
        popperElement.style.top = `calc(20% - ${popperRect.height / 2}px)`;
        popperElement.style.left = `calc(10% - ${popperRect.width / 2}px)`;
      } else {
        popperElement.style.top = `calc(5% - ${popperRect.height / 2}px)`;
        popperElement.style.left = `calc(10% - ${popperRect.width / 2}px)`;
      }
    }
  }, [showPopover, popperElement]);

  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
  };

  const handlePopoverMouseEnter = () => {
    setShowPopover(true);
  };

  const handlePopoverMouseLeave = () => {
    setShowPopover(false);
  };

  if (!selectedAgent) {
    return <div>No log selected.</div>;
  }

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
              <div className="first-col">
                <label>Interaction Id &nbsp;&nbsp;</label>
                <span>{selectedAgent.interaction_id}</span>
              </div>
              <div className="sec-col">
                <label style={{ fontWeight: "bold" }}>
                  Interaction Date &nbsp; &nbsp;
                </label>
                <span>{selectedAgent.interaction_date}</span>
              </div>
              <div className="third-col">
                <label style={{ fontWeight: "bold" }}>
                  Duration (In Sec)&nbsp;&nbsp;
                </label>
                <span>{selectedAgent.duration}</span>
              </div>
            </div>
            <div className="row">
              <div className="first-col">
                <label style={{ fontWeight: "bold" }}>Model &nbsp;&nbsp;</label>
                <span>{selectedAgent.model}</span>
              </div>
              <div className="sec-col">
                <label style={{ fontWeight: "bold" }}>Flow &nbsp;&nbsp;</label>
                <span>{selectedAgent.flow}</span>
              </div>
              <div className="third-col">
                <label style={{ fontWeight: "bold" }}>Template &nbsp;</label>
                <span
                  style={{
                    cursor: "pointer",
                    color: "rgb(45, 182, 212)",
                    fontWeight: "bold",
                  }}
                  ref={setReferenceElement}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  View
                </span>
                {showPopover && (
                  <div
                    ref={setPopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                    className="logDetails-popover"
                    onMouseEnter={handlePopoverMouseEnter}
                    onMouseLeave={handlePopoverMouseLeave}>
                    <div
                      className="logDetails-popover-content"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedAgent.template ||
                          "There is no template description",
                      }}></div>
                  </div>
                )}
              </div>
            </div>
          </fieldset>
        </div>

        <div className="mainRow">
          <fieldset id="interactionFieldset">
            <legend id="interactionLegend">Agent Interaction</legend>
            <hr />
            <div className="ques">
              <span style={{ color: "rgb(45, 182, 212)", fontWeight: "bold" }}>
                Question &nbsp;
              </span>
              {selectedAgent.question}
            </div>
            <br />
            <div className="answer">
              <span style={{ color: "rgb(45, 182, 212)", fontWeight: "bold" }}>
                Response &nbsp;
              </span>
              {selectedAgent.answer}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default ConfigAgentLogDetails;
