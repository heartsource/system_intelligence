import React, { useState } from 'react';
import axios from 'axios';
import '../../Styles/configAskHearty.css';
import hearty from '../Images/hearty.png';
import ConversationDisplay from '../ConfigUser/ConversationDisplay';

const ConfigAskHearty = ({ onTextSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState({});
  const [error, setError] = useState(null);

  const handleTextareaInput = (event) => {
    event.target.style.height = 'auto'; // Reset height to auto to recalculate scroll height
    event.target.style.height = event.target.scrollHeight + 'px'; // Set height to scroll height
  };

  const handleKeyPressOrClick = async (event) => {
    if (
      event.type === 'click' ||
      (event.type === 'keydown' && event.key === 'Enter')
    ) {
      if (event.type === 'click' || event.key === 'Enter') {
        const inputElement = document.getElementById('myInput');
        const question = inputElement.value;

        setIsLoading(true);
        try {
          // const response = await axios.post(
          //   'http://4.255.69.143/heartie-be/talk_to_heartie/',
          //   { question }
          // );
          const response = await axios.post(
            'http://localhost:8000/talk-to-heartie',
            { question }
          );

          await onTextSubmit(question);
          inputElement.value = '';
          setIsLoading(false);
          let conversation = {};
          conversation.question = question;
          conversation.answer = response.data;
          setConversation(conversation);
        } catch (error) {
          console.log(error);
          setError('There was an error fetching data. Please try again later.');
          await onTextSubmit(question);
          inputElement.value = '';
          setIsLoading(false);
        }
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
        <div class="dashboard-content">
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

            <div className="input-group" id="search-form">
              <textarea
                id="myInput"
                className="input-group__input"
                placeholder="Seeking answers? Ask your question here."
                onKeyDown={handleKeyPressOrClick}
                onInput={handleTextareaInput}
              />
              <i
                className="fa-solid fa-arrow-up search-button"
                onClick={handleKeyPressOrClick}
              ></i>
            </div>
          </div>
          {isLoading && (
            <div
              className="d-flex flex-column align-items-center"
              style={{ minHeight: '100px' }}
            >
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
    </>
  );
};

export default ConfigAskHearty;
