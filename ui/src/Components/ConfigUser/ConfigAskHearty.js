import React, { useState } from 'react';
import '../../Styles/userdashboard.css';
import hearty from '../Images/hearty.png';
import AnswerDisplay from '../Users/AnswerDisplay';

const ConfigAskHearty = ({ onTextSubmit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setIsVisible(!isVisible);
  };
  const handleTextareaInput = (event) => {
    event.target.style.height = 'auto'; // Reset height to auto to recalculate scroll height
    event.target.style.height = event.target.scrollHeight + 'px'; // Set height to scroll height
  };
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      setIsLoading(true);
      await onTextSubmit(event.target.value);
      event.target.value = '';
      setTimeout(() => {
        setIsVisible(true);
        setIsLoading(false);
      }, 3000);
    }
  };
  return (
    <>
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
                onKeyDown={handleKeyPress}
                onInput={handleTextareaInput}
              />
              <i
                className="fa-solid fa-arrow-up search-button"
                onClick={handleClick}
              ></i>
            </div>
          </div>
          {isLoading ? (
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
          ) : (
            isVisible && <AnswerDisplay />
          )}
        </div>
      </div>
    </>
  );
};

export default ConfigAskHearty;
