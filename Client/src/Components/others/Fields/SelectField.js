import React from "react";
import { Select } from "antd";
import "./index.css";
import { IoMdClose } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

const SelectField = ({
  id,
  labelWidth,
  inputWidth,
  label,
  placeholder,
  data,
  required,
  onChange,
  value,
  marginBottom,
  onKeyPress,
  noMarginRight,
  // defaultValue,
  disabled,
  // className,
  loading,
  margin,
  onKeyDown,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: marginBottom,
        whiteSpace: "nowrap",
        color: "rgb(92, 92, 92)",
        margin: margin,
      }}
    >
      <label
        style={{
          width: labelWidth,
          fontSize: "85%",
          textAlign: "right",
          marginRight: noMarginRight ? 0 : "20px",
          fontFamily: "Poppins"
        }}
        className="poppins-regular"
      >
        {label}
        {required ? <span style={{ color: "red" }}> *</span> : null}
      </label>

      <Select
        allowClear
        clearIcon={
          <div
            className="h-auto w-[30px] rounded-tr-[4px] rounded-br-[4px]"
            style={{ backgroundColor: disabled ? "rgba(0, 0, 0, 0)" : "white", height: "20px" }}
          >
            <IoMdClose size={28} className="scale-[0.6]" color="rgb(196, 196, 196)" />
          </div>
        }
        size={"medium"}
        onChange={onChange}
        value={value}
        loading={loading}
        options={data || []}
        onKeyPress={onKeyPress}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={onKeyDown}
        style={{
          width: inputWidth,
        }}
        suffixIcon={
          <div
            className="h-auto w-[30px] rounded-tr-[4px] rounded-br-[4px]"
            // style={{ backgroundColor: "white" }}
            style={{
              backgroundColor: disabled ? "rgba(0, 0, 0, 0)" : "transparent",
              // height: "20px",
            }}
          >
            <RiArrowDropDownLine size={28} className="pt-[1px]" color="rgb(196, 196, 196)" />
          </div>
        }
      />
    </div>
  );
};
export default SelectField;

// import React from "react";
// import { Select } from "@mantine/core";
// import { Link } from "react-router-dom";
// import { IoMdSearch } from "react-icons/io";
// import { FiChevronDown } from "react-icons/fi";

// function SelectField({
//   id,
//   labelWidth,
//   inputWidth,
//   label,
//   placeholder,
//   data,
//   required,
//   onChange,
//   value,
//   marginBottom,
//   onKeyPress,
//   noMarginRight,
//   defaultValue,
//   color,
//   readOnly,
//   cursor,
//   dropdownPosition,
// }) {
//   //   const dat = ["male", "female", "other"];
//   if (data) {
//     data = data;
//   } else {
//     data = ["No data"];
//   }
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         marginBottom: marginBottom,
//         whiteSpace: "nowrap",
//         color: "rgb(92, 92, 92)",
//       }}
//     >
//       <label
//         style={{
//           fontFamily: "Poppins",
//           width: labelWidth,
//           fontSize: "85%",
//           textAlign: "right",
//           marginRight: noMarginRight ? 0 : "20px",
//           color: color,
//         }}
//       >
//         {label}
//         {required ? <span style={{ color: "red" }}> *</span> : null}
//       </label>
//       <Select
//         styles={(theme) => ({
//           dropdown: {
//             fontFamily: "Poppins",
//           },
//           item: {
//             fontFamily: "Poppins",
//           },
//           input: {
//             fontFamily: "Poppins",
//           },
//           rightSection: { pointerEvents: "none" },
//         })}
//         onKeyPress={onKeyPress}
//         onChange={onChange}
//         value={value}
//         required={required}
//         placeholder={placeholder}
//         style={{
//           width: inputWidth,
//           cursor: cursor,
//         }}
//         readOnly={readOnly}
//         maxDropdownHeight={155}
//         variant="unstyled"
//         searchable
//         size={"xs"}
//         className="selectField"
//         id={id}
//         dropdownPosition={dropdownPosition}
//         rightSection={
//           <FiChevronDown
//             style={{ marginLeft: "15px" }}
//             size={18}
//             color="grey"
//           />
//         }
//         data={data}
//         defaultValue={defaultValue}
//       />
//     </div>
//   );
// }

// export default SelectField;
