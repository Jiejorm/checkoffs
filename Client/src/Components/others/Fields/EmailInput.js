import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { DatePicker } from "antd";
import "./index.css";

function EmailInput({
  // ... (other props)
  labelWidth,
  inputWidth,
  type,
  id,
  label,
  maxLength,
  disabled,
  required,
  value,
  marginBottom,
  labelColor,
  paddingRight,
  textAlign,
  placeholder,
  className,
  margin,
  onChange,
  onKeyDown,
  onKeyPress,
  onBlur,
  defaultValue,
  onFocus,
  name,
  readOnly,
  marginRight,
  noMarginRight,
  textTransform,
  autoComplete,
  showIcon, // Add this prop to control whether to show the icon
}) {
  // ... (other code)

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
          fontSize: "85%",
          color: labelColor,
          textAlign: "right",
          marginRight: noMarginRight ? 0 : "20px",
        }}
      >
        {label}
        {required ? <span style={{ color: "red" }}> *</span> : null}
      </label>
      {type === "date" ? (
        <input
          className="dateField"
          width={inputWidth}
          style={{
            width: inputWidth,
            color: "rgb(92, 92, 92)",
            fontSize: "85%",
          }}
          placeholder="Pick a date"
          id={id}
          value={value}
          type="date"
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyPress={onKeyPress}
          onBlur={onBlur}
          // defaultValue={defaultValue}
          onFocus={onFocus}
          readOnly={readOnly}
        />
      ) : (
        // <DatePicker
        //   variant="unstyled"
        //   width={inputWidth}
        //   style={{ width: inputWidth, color: "rgb(92, 92, 92)" }}
        //   // inputFormat="DD/MM/YYYY"
        //   placeholder="Pick a date"
        //   id="dateField"
        //   rightSection={<IoCalendarOutline size={15} color="grey" />}
        //   styles={{ rightSection: { pointerEvents: "none" } }}
        // />

        <span className="flex items-center " style={{ position: "relative", width: inputWidth }}>
          <span>
            {/* <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none"> */}
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              style={{
                position: "absolute",
                left: "4px",
                bottom: "5px",
                zIndex: 9999,
              }}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
          </span>

          <span className="w-full">
            <input
              autoComplete={"off"}
              type={type}
              id={id}
              name={name}
              className={`${disabled ? "inputFieldDisabled" : "EmailinputField"} ${className}`}
              style={{
                width: "100%",
                color: "rgb(92, 92, 92)",
                // paddingRight: paddingRight,
                textAlign: textAlign,
                textTransform: textTransform,
                fontSize: "85%",
              }}
              placeholder={placeholder}
              maxLength={maxLength}
              min={type === "number" && 0}
              disabled={disabled}
              required={required}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onKeyPress={onKeyPress}
              onBlur={onBlur}
              defaultValue={defaultValue}
              onFocus={onFocus}
              readOnly={readOnly}
            />
            {/*             
          <input
            autoComplete={"off"}
            type={type}
            id={id}
            name={name}
            className={`${
              disabled ? "inputFieldDisabled" : "EmailinputField"
            } ${className}`}
            style={{
              position: "relative",
              width: inputWidth,
              color: "rgb(92, 92, 92)",
              paddingRight: paddingRight,
              textAlign: textAlign,
              textTransform: textTransform,
              fontSize: "85%",
            }}
            placeholder={placeholder}
            maxLength={maxLength}
            min={type === "number" && 0}
            disabled={disabled}
            required={required}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            defaultValue={defaultValue}
            onFocus={onFocus}
            readOnly={readOnly}
          /> */}
          </span>
        </span>
      )}
      {/* </div> */}
    </div>
  );
}

export default EmailInput;
