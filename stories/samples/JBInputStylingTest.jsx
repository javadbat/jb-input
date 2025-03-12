import React from 'react';
import {JBInput} from 'jb-input/react';
import './JBInputStylingTest.css';
function JBInputStylingTest() {
  return (
    <div className="jb-input-styling-test">
      <h1>JBInput different Styling test</h1>
      <div className="cloudy-style">
        <JBInput type="number"></JBInput>
      </div>
    </div>
  );
}

export default JBInputStylingTest;
