import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { DatePicker } from "antd";
import "./index.css";
import { BsQuestionOctagon } from "react-icons/bs";

function InputField({
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
  color,
  onClickOfPopUp,
  showPopOver,
  onWheel,
}) {
  // disabled & required should be true or false, width should be in percentages, type: tel, number, text
  // if (type === "number") {
  //   const input = document.getElementById(id);
  //   input.addEventListener('wheel', function (e) {
  //     e.preventDefault();
  //   });
  // }
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
          fontFamily: "Poppins",
        }}
      >
        {label}
        {required ? <span style={{ color: "red" }}> *</span> : null}
      </label>

      {type === "date" ? (
        <input
          className={`dateField ${className}`}
          // width={inputWidth}
          style={{
            width: inputWidth,
            color: "rgb(92, 92, 92)",
            fontSize: "85%",
          }}
          placeholder="Pick a date"
          id={id}
          value={value}
          name={name}
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
        <input
          autoComplete={"off"}
          type={type}
          id={id}
          name={name}
          className={`${disabled ? "inputFieldDisabled" : "inputField"} ${className}`}
          style={{
            width: inputWidth,
            color: color ? color : "rgb(92, 92, 92)",
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
          onWheel={onWheel}
        />
      )}

      {showPopOver && (
        <div className="ml-4 rounded-full p-[1px] transition-all ease-in hover:cursor-pointer hover:shadow-lg">
          <div onClick={onClickOfPopUp}>
            <BsQuestionOctagon className="relative" color="blue" size={20} />
          </div>
        </div>
      )}
    </div>
  );
}

export default InputField;
