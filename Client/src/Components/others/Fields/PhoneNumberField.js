import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./index.css";

function PhoneNumberField({
  required,
  labelWidth,
  inputWidth,
  label,
  maxLength,
  disabled,
  onChange,
  value,
  name,
  className,
  noMarginRight,
  marginBottom,
  margin,
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
        marginBottom: marginBottom,
        margin: margin,
      }}
    >
      <label
        style={{
          width: labelWidth,
          color: "rgb(92, 92, 92)",
          // marginRight: "20px",
          fontSize: "85%",
          textAlign: "right",
          marginRight: noMarginRight ? 0 : "20px",
        }}
      >
        {label}
        {required ? <span style={{ color: "red" }}> *</span> : null}
      </label>
      {/* <div className=''> */}
      <span style={{ width: inputWidth }}>
        <PhoneInput
          inputStyle={{
            // style={{
            width: "100%",
            // height: "28px",
            color: "rgb(92, 92, 92)",
          }}
          maxLength={maxLength}
          className={`phone_number_field ${className}`}
          name={name}
          disabled={disabled}
          required={required}
          country="ke"
          value={value}
          onChange={onChange}
          enableSearch={true}
        />
      </span>

      {/* </div> */}
    </div>
  );
}

export default PhoneNumberField;
