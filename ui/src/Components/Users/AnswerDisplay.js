import React, { useState } from 'react';
import '../../Styles/answerDisplay.css';
import hearty from '../Images/hearty.png';

const AnswerDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  //function to update current time
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
      hour12: true,
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  };
  return (
    <div className="container-md answerContainer">
      <div class="row justify-content-md">
        <div class="userInitial col-md-auto">
          <span class="initialName">AS</span>
        </div>
        <div class="col-md-auto">
          <h5>
            <b>You</b>
            &nbsp;&nbsp;
            <span
              style={{
                color: '#424345',
                marginRight: '5px',
                fontSize: 'small',
              }}
            >
              {formatDate(currentTime)}
            </span>
          </h5>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-md-auto">
          <p class="ques">What is Lorem Ipsum?</p>
        </div>
      </div>

      <div class="row justify-content-md">
        <div class="col-md-auto" style={{ paddingLeft: '10px' }}>
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
        <div class="col-md-auto">
          <h5>
            <b>Hearty</b>
          </h5>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-md-auto">
          <p class="ques">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
          <i className="fa-solid fa-copy" title="copy"></i>
        </div>
      </div>

      <div class="row justify-content-md">
        <div class="userInitial col-md-auto">
          <span class="initialName">AS</span>
        </div>
        <div class="col-md-auto">
          <h5>
            <b>You</b>
            &nbsp;&nbsp;
            <span
              style={{
                color: '#424345',
                marginRight: '5px',
                fontSize: 'small',
              }}
            >
              {formatDate(currentTime)}
            </span>
          </h5>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-md-auto">
          <p class="ques">Why do we use it?</p>
        </div>
      </div>

      <div class="row justify-content-md">
        <div class="col-md-auto" style={{ paddingLeft: '10px' }}>
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
        <div class="col-md-auto">
          <h5>
            <b>Hearty</b>
          </h5>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-md-auto">
          <p class="ques">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <i className="fa-solid fa-copy" title="copy"></i>
        </div>
      </div>
      <div class="row justify-content-md">
        <div class="userInitial col-md-auto">
          <span class="initialName">AS</span>
        </div>
        <div class="col-md-auto">
          <h5>
            <b>You</b>
            &nbsp;&nbsp;
            <span
              style={{
                color: '#424345',
                marginRight: '5px',
                fontSize: 'small',
              }}
            >
              {formatDate(currentTime)}
            </span>
          </h5>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-md-auto">
          <p class="ques">Where does it come from?</p>
        </div>
      </div>
      <div class="row justify-content-md">
        <div class="col-md-auto" style={{ paddingLeft: '10px' }}>
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
        <div class="col-md-auto">
          <h5>
            <b>Hearty</b>
          </h5>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-md-auto">
          <p class="ques">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>

          <i class="fa-solid fa-copy" title="Copy"></i>
        </div>
      </div>
    </div>
  );
};

export default AnswerDisplay;
