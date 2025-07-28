import React from "react";
import { Select } from "@mantine/core";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";

function SelectField({
  labelWidth,
  inputWidth,
  label,
  placeholder,
  onChange,
  value,
  data,
  defaultValue,
  required,
  marginBottom,
  id,
}) {
  return (
    <div
      className="w-full"
      style={{
        display: "flex",
        textAlign: "right",
        marginBottom: marginBottom,
        whiteSpace: "nowrap",
        color: "rgb(92, 92, 92)",
        alignItems: "center",
        fontSize: "90%",
      }}
    >
      <label
        style={{
          width: labelWidth,
          textAlign: "right",
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
        variant="unstyled"
        searchable
        size={"xs"}
        className="selectField"
        id={id}
        rightSection={
          <FiChevronDown
            style={{ marginLeft: "15px" }}
            size={18}
            color="grey"
          />
        }
        value={value}
        styles={{ rightSection: { pointerEvents: "none" } }}
        onChange={onChange}
        data={data}
      />
    </div>
  );
}

export default SelectField;
