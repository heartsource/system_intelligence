import React, { useEffect, useState } from "react";
import axios from "axios";
import hearty from "../Images/NewHeartyIcon-without-background.png";
import ConversationDisplay from "../ConfigUser/ConversationDisplay";
import "../../Styles/configAskHearty.css";
import { handleError } from "../../utils/handleError";

const ConfigAskHearty = ({ onTextSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState({});
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [agentNames, setAgentNames] = useState([]); // List of agent names
  const [selectedAgent, setSelectedAgent] = useState({}); // Selected agent
  const [defaultAgent, setDefaultAgent] = useState({}); // Default agent

  const handleTextareaInput = (event) => {
    event.target.style.height = "auto"; // Reset height to auto to recalculate scroll height
    event.target.style.height = event.target.scrollHeight + "px"; // Set height to scroll height
    setInputValue(event.target.value); // Update input value state
  };

  useEffect(() => {
    const fetchAgentNames = async () => {
      try {
        const payload = {};
        const response = await axios.post(
          "http://4.255.69.143/heartie-be/agents/",
          payload
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setAgentNames(data);
        const defaultAgentData = data.find(
          (agent) => agent.name === "Default System Agent"
        );
        setDefaultAgent(defaultAgentData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAgentNames();
  }, []);

  const handleKeyPressOrClick = async (event) => {
    if (
      event.type === "click" || // Check if it's a button click
      (event.type === "keydown" && event.key === "Enter" && !event.shiftKey) // Check if it's Enter key press without Shift
    ) {
      event.preventDefault();
      const question = inputValue.trim();

      if (!question) return; // If question is empty, do nothing

      const agentToUse = selectedAgent.name ? selectedAgent : defaultAgent;

      setIsLoading(true);
      try {
        const body = {
          question,
          model: agentToUse.model,
          flow: agentToUse.flow,
          prompt: agentToUse.template,
          agent_name: agentToUse.name,
          agent_id: agentToUse._id,
        };
        const response = await axios.post(
          "http://4.255.69.143/heartie-be/talk_to_heartie/",
          body
        );

        await onTextSubmit(question);
        setInputValue(""); // Clear input value
        setIsLoading(false);
        setConversation({
          question,
          answer: response.data,
        });

        // Reset textarea size after submission
        const textarea = document.querySelector(".chatbox-textbox textarea");
        textarea.style.height = "auto";
      } catch (error) {
        handleError(
          setError,
          "There was an error fetching data. Please try again later."
        );
        await onTextSubmit(question);
        setInputValue(""); // Clear input value
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="container-fluid">
        <div className="dashboard-content">
          <div className="content">
            <h2 style={{ textAlign: "center" }}>
              Ask Hearty
              <img
                src={hearty}
                alt=""
                height="70px"
                width="70px"
                style={{ borderRadius: "50%", marginLeft: "-0.3em" }}
              />
            </h2>

            <div className="chatbox-textbox">
              <textarea
                placeholder="Seeking answers? Ask your question here."
                rows="1"
                value={inputValue}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyPressOrClick}
              ></textarea>
              <button
                className={`submit-btn ${
                  !inputValue.trim() ? "hover-disabled" : ""
                }`}
                onClick={handleKeyPressOrClick}
                disabled={!inputValue.trim()}
              >
                <b>&#x2B06;</b>
              </button>
            </div>
          </div>
          <div
            className="ask-hearty-agent-input-row"
            style={{ marginLeft: "55em", marginTop: "-6em" }}
          >
            <select
              value={selectedAgent.name}
              onChange={(e) =>
                setSelectedAgent(
                  agentNames.find((a) => a.name === e.target.value) || {}
                )
              }
            >
              <option value="">Select</option>
              {agentNames
                .filter((agent) => agent.name !== "Default System Agent")
                .map((agent, index) => (
                  <option key={index} value={agent.name}>
                    {agent.name}
                  </option>
                ))}
            </select>
          </div>
          <div
            className="conversation-container"
            style={{ position: "relative" }}
          >
            {isLoading && (
              <div className="spinner-overlay">
                <div className="spinner-border mb-2" role="status">
                  <span className="sr-only"></span>
                </div>
                <span className="loading-text">
                  Please wait while Hearty♥️ is fetching the Best Answer to your
                  question!
                </span>
              </div>
            )}
            <ConversationDisplay conversation={conversation} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigAskHearty;
