import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function Phone_number({
  required,
  labelWidth,
  inputWidth,
  label,
  maxLength,
  disabled,
  onChange,
  value,
  name,
  margin,
  id
}) {
  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  return (
    <div
      className="w-full flex items-center"
      style={{
        // display: "flex",
        // alignItems: "center",
        whiteSpace: "nowrap",
        color: "rgb(92, 92, 92)",
        margin: margin,
      }}
    >
      <label
        style={{
          width: labelWidth,
          color: "rgb(92, 92, 92)",
          marginRight: "20px",
          fontSize: "85%",
          textAlign: "right",
        }}
      >
        {label}
        {required ? <span style={{ color: "red" }}> *</span> : null}
      </label>
      {/* <div className=''> */}
      <PhoneInput
        inputStyle={{
          width: inputWidth,
          height: "28px",
          color: "rgb(92, 92, 92)",
        }}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        country="ke"
        value={value}
        onChange={onChange}
        enableSearch={true}
        id={id}
      />
      {/* </div> */}
    </div>
  );
}

export default Phone_number;
