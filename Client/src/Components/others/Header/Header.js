import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

function Header({
  icon,
  title,
  fontWeight,
  handleClose,
  backgroundColor,
  fontSize,
  textTransform,
  closeIcon,
  color,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "33px",
        paddingLeft: "3px",
        color: color ? color : "grey",
        backgroundColor: backgroundColor ? backgroundColor : "#daecfe",
        fontSize: fontSize ? fontSize : "16px",
        textTransform: textTransform ? textTransform : "capitalize",
        fontWeight: fontWeight ? fontWeight : 500,
      }}
      className="poppins-regular"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <>{icon && icon}</>
          <label style={{ paddingLeft: "10px" }}>{title}</label>
        </div>
        {closeIcon && (
          <div
            style={{
              display: "flex",
              marginRight: "10px",
            }}
            onClick={handleClose}
          >
            <AiOutlineCloseCircle size={20} color={color ? color : "grey"} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;

// import React, { useState } from "react";
// import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";

// function Header({
//   icon,
//   title,
//   fontWeight,
//   textAlign,
//   handleClose,
//   backgroundColor,
//   borderRadius,
//   fontSize,
//   fontColor,
//   closeIcon,
//   headerShade,
//   greenShade,
//   zoom,
//   padding,
// }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         width: "100%",
//         height: "32px",
//         paddingLeft: "3px",
//         color: headerShade ? "rgb(92, 92, 92)" : greenShade ? "black" : "white",
//         background: headerShade ? "#daecfe" : backgroundColor,
//         fontSize: fontSize ? fontSize : "16px",
//         fontWeight: fontWeight,
//         textTransform: "uppercase",
//         fontWeight: "500",
//         borderRadius: borderRadius,
//         zoom: zoom,
//         padding: padding,
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           width: "100%",
//           zoom: zoom,
//         }}
//       >
//         <div>
//           <>{icon}</>
//           <label
//             style={{ paddingLeft: "5px", color: fontColor, fontSize: fontSize }}
//           >
//             {title}
//           </label>
//         </div>
//         <div
//           style={{
//             display: closeIcon === true ? "flex" : "none",
//             marginRight: closeIcon === true ? "10px" : "0px",
//           }}
//           onClick={handleClose}
//         >
//           <AiOutlineCloseCircle
//             size={20}
//             color={headerShade ? "grey" : "white"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Header;
