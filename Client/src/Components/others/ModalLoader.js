import React from "react";
import { Loader } from "@mantine/core";

const ModalLoader = ({ color, textColor, displayText }) => {
  return (
    <div className="">
      <span className="h-10 animate-bounce flex items-center font-semibold space-x-2 ">
        <Loader color={color ? color : "rgba(66, 66, 66, 1)"} />
        <span className={textColor ? `text-black` : null}>
          {displayText ? displayText : "Loading..."}
        </span>
      </span>
    </div>
  );
};

export default ModalLoader;
