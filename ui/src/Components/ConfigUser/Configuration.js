import React, { useState, useEffect } from 'react';
import '../../Styles/configuration.css';
const Configuration = () => {
  return (
    <>
      <div className="fieldset-container">
        <fieldset>
          <legend>
            Configuration
            <i class="fa-solid fa-gears"></i>
          </legend>
          <hr />
          <div>
            <label forHTML="model">Select Model</label>
            <select id="model">
              <option>Select</option>
              <option>Model-1</option>
              <option>Model-2</option>
              <option>Model-3</option>
            </select>
          </div>
          <div>
            <label forHTML="flow">Select Flow</label>
            <select id="flow">
              <option>Select</option>
              <option>Flow-1</option>
              <option>Flow-2</option>
              <option>Flow-3</option>
            </select>
          </div>
          <div>
            <label forHTML="template">Template</label>
            <textarea id="template"></textarea>
          </div>
          <div>
            <label forHTML="button"></label>

            <button className="btn-grad">Submit</button>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default Configuration;
