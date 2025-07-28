import React, { useState } from "react";

function ButtonWColor({
  label,
  buttonIcon,
  buttonBackgroundColor,
  buttonColor,
  buttonWidth,
  margin,
  buttonHeight,
  onClick,
  marginBottom,
  type,
  id,
}) {
  const [isPEP, setIsPEP] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // height should be in percentages and width should be in pixels
  const [getButtonColor, setButtonColor] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  return (
    <button
      id={id}
      className="button space-x-4"
      onClick={onClick}
      type={type}
      style={{
         backgroundColor: buttonBackgroundColor,
         
        display: "flex",
        // background:getButtonColor.theme.buttonBGColor,

        // background:
        //   `url(` +
        //   window.location.origin +
        //   `/assets/images/headerBackground/` +
        //   getButtonColor.theme.headerImage +
        //   `)`,
        color: buttonColor,
        border: "none",
        borderRadius: "4px",
        height: buttonHeight,
        width: buttonWidth,
        marginBottom: marginBottom,
        whiteSpace: "nowrap",
        padding: "0px 5px",
        margin: margin,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {buttonIcon}
      {label}
    </button>
  );
}

export default ButtonWColor;
