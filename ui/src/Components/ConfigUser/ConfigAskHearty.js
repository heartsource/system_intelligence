import React, { useState } from 'react';
import axios from 'axios';
import hearty from '../Images/NewHeartyIcon-without-background.png';
import ConversationDisplay from '../ConfigUser/ConversationDisplay';
import '../../Styles/configAskHearty.css'; // Import your CSS file

const ConfigAskHearty = ({ onTextSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState({});
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleTextareaInput = (event) => {
    event.target.style.height = 'auto'; // Reset height to auto to recalculate scroll height
    event.target.style.height = event.target.scrollHeight + 'px'; // Set height to scroll height
    setInputValue(event.target.value); // Update input value state
  };

  const handleKeyPressOrClick = async (event) => {
    if (
      event.type === 'click' || // Check if it's a button click
      (event.type === 'keydown' && event.key === 'Enter' && !event.shiftKey) // Check if it's Enter key press without Shift
    ) {
      event.preventDefault();
      const question = inputValue.trim();

      if (!question) return; // If question is empty, do nothing

      setIsLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:8000/talk-to-heartie',
          { question }
        );

        await onTextSubmit(question);
        setInputValue(''); // Clear input value
        setIsLoading(false);
        let conversation = {};
        conversation.question = question;
        conversation.answer = response.data;
        setConversation(conversation);

        // Reset textarea size after submission
        const textarea = document.querySelector('.chatbox-textbox textarea');
        textarea.style.height = 'auto'; // Reset height to auto
      } catch (error) {
        console.log(error);
        setError('There was an error fetching data. Please try again later.');
        await onTextSubmit(question);
        setInputValue(''); // Clear input value
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {error && ( // Display error message if there's an error
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="container-fluid">
        <div className="dashboard-content">
          <div className="content">
            <h2 style={{ textAlign: 'center' }}>
              Ask Hearty
              <img
                src={hearty}
                height="70px"
                width="70px"
                style={{ borderRadius: '50%', marginLeft: '-0.3em' }}
              />
            </h2>

            <div className="chatbox-textbox">
              <textarea
                placeholder="Seeking answers? Ask your question here."
                rows="1"
                value={inputValue} // Bind value to state
                onChange={handleTextareaInput} // Use onChange instead of onInput
                onKeyDown={handleKeyPressOrClick}
              ></textarea>
              <button
                className={`submit-btn ${
                  !inputValue.trim() ? 'hover-disabled' : ''
                }`}
                onClick={handleKeyPressOrClick}
                disabled={!inputValue.trim()}
              >
                <b>&#x2B06;</b>
              </button>
            </div>
          </div>
          <div
            className="conversation-container"
            style={{ position: 'relative' }}
          >
            {isLoading && (
              <div className="spinner-overlay d-flex flex-column align-items-center justify-content-center">
                <div className="spinner-border mb-2" role="status">
                  <span className="sr-only">Loading...</span>
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
