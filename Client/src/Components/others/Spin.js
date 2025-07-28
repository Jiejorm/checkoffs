import React from 'react';
import { Spin } from 'antd';

const Spinner = ({spinning}) => (
  <div style={{background:"rgba(255,255,255,0.08)"}}>
    <Spin spinning={spinning}/>
  </div>
);
export default Spinner;