import React from "react";
import { Select } from "@mantine/core";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";

import "./index.css";
function ListOfValue({
  labelWidth,
  inputWidth,
  label,
  placeholder,
  data,
  columns,
  title,
  marginBottom,
  onChange,
  value,
  required,
  disabled,
  id,
  ref,
  onKeyPress,
}) {
  if (!data) {
    data = ["No data"];
  } else {
    data = data;
  }

  const selectStyles = {
    focus: {
      outline: "none",
      border: "2px solid red !important",
      boxShadow: "none !important",
    },
  };
  return (
    <div
      className="w-full"
      style={{
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        color: "rgb(92, 92, 92)",
        marginBottom: marginBottom,
      }}
    >
      <label
        style={{
          width: labelWidth,
          textAlign: "right",
          fontSize: "90%",
          color: "rgb(92, 92, 92)",
          marginRight: "20px",
        }}
      >
        {label}
        {required ? <span style={{ color: "red" }}> *</span> : null}
      </label>
      <Select
        placeholder={placeholder}
        style={{
          width: inputWidth,
        }}
        // className="bg-white"
        variant="unstyled"
        searchable
        disabled={disabled}
        size={"xs"}
        className="listOfValue selectField focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
        id={id}
        rightSection={
          <IoMdSearch style={{ marginLeft: "7px" }} size={18} color="grey" />
        }
        rightSectionProps={{
          style: {
            height: "25px",
            backgroundColor: "#f2f7fd",
            borderLeft: "1px solid rgb(196, 196, 196)",
          },
        }}
        value={value}
        title={title}
        columns={columns}
        styles={{
          rightSection: { pointerEvents: "none" },
          focus: {
            outline: "1",
            border: "2px solid red !important",
            boxShadow: "none !important",
          },
        }}
        data={data}
        onChange={onChange}
        onKeyDown={onKeyPress}
      />
    </div>
  );
}

export default ListOfValue;
