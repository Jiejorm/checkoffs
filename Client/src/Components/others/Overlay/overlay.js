import React from "react";
import { Spin } from "antd";

const Overlay = () => {
  return (
    <div className="h-full w-full grid place-items-center bg-white top-0 right-0 left-0 opacity-90 absolute z-10">
      <div className="z-30 opacity-100  rounded-full">
        <Spin size="large" />
      </div>
    </div>
  );
};

export default Overlay;
