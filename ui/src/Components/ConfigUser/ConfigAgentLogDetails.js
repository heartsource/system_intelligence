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
      popperElement.style.top = `calc(5% - ${popperRect.height / 2}px)`;
      popperElement.style.left = `calc(5% - ${popperRect.width / 2}px)`;
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
              <div className="column">
                <div className="first-col">
                  Interaction Id &nbsp;&nbsp;
                  <span style={{ color: "gray" }}>
                    {selectedAgent.interaction_id}
                  </span>
                </div>
              </div>
              <div className="column">
                <div className="sec-col">
                  Interaction Date&nbsp;{" "}
                  <span style={{ color: "gray" }}>
                    {selectedAgent.interaction_date}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="column">
                <div className="third-col">
                  Duration&nbsp;{" "}
                  <span style={{ color: "gray" }}>
                    {selectedAgent.duration}
                  </span>
                </div>
              </div>
              <div className="column">
                <div className="first-col">
                  Model &nbsp;&nbsp;
                  <span style={{ color: "gray" }}>{selectedAgent.model}</span>
                </div>
              </div>
              <div className="column">
                <div className="sec-col">
                  Flow &nbsp;{" "}
                  <span style={{ color: "gray" }}>{selectedAgent.flow}</span>
                </div>
              </div>
              <div className="column">
                <div className="third-col">
                  Template &nbsp;
                  <span
                    style={{ cursor: "pointer", color: "rgb(45, 182, 212)" }}
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
                      <div className="logDetails-popover-content">
                        {selectedAgent.template ||
                          "There is no template description"}
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
            <div className="ques">
              <span style={{ color: "rgb(45, 182, 212)" }}>
                Question:: &nbsp;
              </span>
              {selectedAgent.question}
            </div>
            <br />
            <div className="answer">
              <span style={{ color: "rgb(45, 182, 212)" }}>
                Response:: &nbsp;
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
