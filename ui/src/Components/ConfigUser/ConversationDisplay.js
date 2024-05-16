import React, { useState, useEffect } from 'react';
import '../../Styles/conversationDisplay.css';
import hearty from '../Images/hearty.png';

const ConversationDisplay = ({ conversation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  // Function to update current time
  const updateCurrentTime = () => {
    setCurrentTime(new Date());
  };

  // Function to format the date and time
  const formatDate = (date) => {
    const options = {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    const formattedDate = date.toLocaleString(undefined, options);
    return formattedDate;
  };

  // Function to add a new conversation item to the history
  const addConversationItem = (newItem) => {
    setConversationHistory((prevHistory) => [newItem, ...prevHistory]);
  };

  // useEffect hook to update current time periodically
  useEffect(() => {
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // When new conversation prop is received, add it to the history
  useEffect(() => {
    if (conversation && conversation.answer) {
      conversation.currentTime = currentTime;
      addConversationItem(conversation);
    }
  }, [conversation]);

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setIsCopied(true))
      .catch((error) => console.error('Error copying text: ', error));
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 10000); // Reset after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    conversationHistory.length > 0 && (
      <div className="container-md answerContainer">
        {conversationHistory.map((item, index) => (
          <div key={index}>
            <div className="row justify-content-md">
              <div className="userInitial col-md-auto">
                <span className="initialName">AS</span>
              </div>
              <div className="col-md-auto">
                <h5>
                  <b>You</b>
                  &nbsp;&nbsp;
                  <span
                    style={{
                      color: 'rgb(45, 182, 212)',
                      marginRight: '5px',
                      fontSize: 'small',
                    }}
                  >
                    {formatDate(item.currentTime)}
                  </span>
                </h5>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-auto">
                <p className="ques">{item.question}</p>
              </div>
            </div>
            {item.answer && (
              <div>
                <div className="row justify-content-md">
                  <div className="col-md-auto" style={{ paddingLeft: '10px' }}>
                    <img
                      src={hearty}
                      height="50px"
                      width="50px"
                      style={{
                        borderRadius: '50%',
                        backgroundColor: 'white',
                      }}
                    />
                  </div>
                  <div className="col-md-auto">
                    <h5>
                      <b>Hearty</b>
                    </h5>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-md-auto">
                    <p className="ques">{item.answer}</p>

                    <div className="tooltip-container">
                      <i
                        className="fa-solid fa-copy"
                        title={isCopied ? 'Copied!' : 'Copy'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          copyToClipboard(item.answer);
                        }}
                      ></i>
                      {isCopied && <span className="tooltip">Copied!</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  );
};

export default ConversationDisplay;
