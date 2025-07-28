import React from "react";
import { Select } from "antd";
import "./index.css";
import { IoMdClose } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";

const ListOfValue = ({
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
  // if (!data) {
  //   data = ["No data"];
  // }

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
        showSearch
        clearIcon={
          // #f2f7fd
          <div
            className="w-[30px] rounded-tr-[4px] rounded-br-[4px]"
            style={{ backgroundColor: "#f2f7fd", height: "20px" }}
          >
            <IoMdClose size={28} className="scale-[0.6] pb-1" color="rgb(196, 196, 196)" />
          </div>
        }
        size={"medium"}
        onChange={onChange}
        id={id}
        onKeyPress={onKeyPress}
        value={value}
        loading={loading}
        options={data || []}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={onKeyDown}
        style={{
          width: inputWidth,
        }}
        suffixIcon={
          <div
            className="border-l-2 h-auto w-[30px] rounded-tr-[4px] rounded-br-[4px]"
            style={{ backgroundColor: "#f2f7fd", height: "25px" }}
          >
            <IoIosSearch size={28} className="scale-[0.6]" color="rgb(196, 196, 196)" />
          </div>
        }
      />
    </div>
  );
};
export default ListOfValue;

// ---------

// import React, { useState } from "react";
// import { Select } from "@mantine/core";
// import { IoMdSearch } from "react-icons/io";

// function ListOfValue({
//   labelWidth,
//   inputWidth,
//   label,
//   placeholder,
//   data,
//   margin,
//   title,
//   marginBottom,
//   onChange,
//   required,
//   onKeyPress,
//   value,
//   id,
//   defaultValue,
//   onKeyDown,
//   onFocus,
//   disabled,
//   onSearchChange,
//   marginRight,
//   className,
//   onBlur,
//   noMarginRight,
//   whiteSpace,
// }) {
//   if (!data) {
//     data = ["No data"];
//   }
//   const [v, setV] = useState();
//   return (
//     <div
//       style={{
//         fontFamily: "Poppins",
//         display: "flex",
//         alignItems: "center",
//         marginBottom: marginBottom,
//         margin: margin,
//       }}
//     >
//       <label
//         style={{
//           fontFamily: "Poppins",
//           width: labelWidth,
//           fontSize: "85%",
//           textAlign: "right",
//           color: "rgb(92, 92, 92)",
//           marginRight: noMarginRight ? 0 : marginRight ? marginRight : "20px",
//           whiteSpace: whiteSpace ? "nowrap" : "normal",
//         }}
//       >
//         {label}
//         {required && <span style={{ color: "red" }}> *</span>}
//       </label>
//       <Select
//         disabled={disabled}
//         value={value}
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
//         })}
//         placeholder={placeholder}
//         style={{ width: inputWidth, backgroundColor: "white" }}
//         variant="unstyled"
//         searchable
//         clearable
//         size="xs"
//         className={
//           disabled ? "inputFieldDisabled " : `selectField ${className}`
//         }
//         id={id}
//         rightSection={
//           (!v || value === "") && <IoMdSearch size={18} color="grey" />
//         }
//         rightSectionProps={{
//           style: {
//             height: "25px",
//             backgroundColor: "#f2f7fd",
//             borderLeft: "1px solid rgb(196, 196, 196)",
//           },
//         }}
//         title={title}
//         data={data}
//         onChange={(value) => {
//           setV(value);
//           onChange(value);
//         }}
//         onKeyPress={onKeyPress}
//         defaultValue={defaultValue}
//         onKeyDown={onKeyDown}
//         onFocus={onFocus}
//         onBlur={onBlur}
//         onSearchChange={onSearchChange}
//       />
//     </div>
//   );
// }

// export default ListOfValue;
