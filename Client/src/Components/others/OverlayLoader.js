import React from "react";
import ModalLoader from "./ModalLoader";
import { LoadingOverlay } from "@mantine/core";

function OverlayLoader({ postLoader, color, textColor, displayText }) {
  const customLoader = (
    <ModalLoader
      color={color}
      textColor={textColor}
      displayText={displayText}
    />
  );
  return (
    <div>
      {postLoader ? (
        <LoadingOverlay visible={postLoader} loader={customLoader} />
      ) : null}
    </div>
  );
}

export default OverlayLoader;
