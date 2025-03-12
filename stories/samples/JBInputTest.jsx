import React, { useState, useEffect, useRef}from 'react';
import {JBInput} from 'jb-input/react';

function JBInputTest() {
  const input = useRef(null);
  const [value, setValue] = useState('09');
  const [numberValue, setNumberValue] = useState(0);
  useEffect(()=>{
    input.current.focus();
  },[]);
  return (
    <div style={{direction:'rtl'}}>
      <JBInput ref={input} value={value} onKeyup={e=>setValue(e.target.value)} onKeydown={(e)=>{console.log(e);}} label="تست تایپ"></JBInput>
      <span>value:</span>
      <input value={value} onChange={e=>setValue(e.target.value)} />
      <h3>test events</h3>
      <JBInput onEnter={()=>{alert('you press Enter');}} label="تست تایپ"></JBInput>
      <h3>number input test</h3>
      <h4>step:2, Decimalpecission:4</h4>y
      <JBInput type="number" label="عدد اعشاری" numberFieldParameter={{step:2,decimalPrecision:4,invalidNumberReplacement:""}}></JBInput>
      <JBInput value={numberValue} onChange={(e)=>{setNumberValue(e.target.value);}} type="number" label="عدد عشاری" numberFieldParameter={{step:2,decimalPrecision:4,invalidNumberReplacement:""}}></JBInput>
      <h3>number after change event</h3>
      <h4>{numberValue}</h4>
    </div>
  );
}

export default JBInputTest;
