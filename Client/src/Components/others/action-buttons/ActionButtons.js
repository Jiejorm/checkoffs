import React from "react";
// import { MDBIcon } from "mdb-react-ui-kit"; // Commented out as not currently used
import { SiFarfetch } from "react-icons/si";
import { MdOutlineOpenInNew } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { SiWebauthn } from "react-icons/si";
import { LuView } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { TiCancel } from "react-icons/ti";
import { BiHelpCircle } from "react-icons/bi";
import { ImExit } from "react-icons/im";
import { MdOutlineFilterList } from "react-icons/md";
import { HiOutlineWindow } from "react-icons/hi2";
import {
  IoCheckmarkDoneSharp,
  IoCheckmarkSharp,
  IoHelp,
  IoExitOutline,
} from "react-icons/io5";
import { AiOutlineStop } from "react-icons/ai";
import { IoIosRefresh } from "react-icons/io";

function ActionButtons({
  onNewClick,
  onExitClick,
  onHelpClick,
  onRejectClick,
  onCancelClick,
  onOkClick,
  onRefreshClick,
  onDeleteClick,
  onAuthoriseClick,
  onViewClick,
  onFetchClick,
  displayNew,
  displayFetch,
  displayRefresh,
  displayDelete,
  displayAuthorise,
  displayView,
  displayOk,
  displayCancel,
  displayReject,
  displayHelp,
  displayExit,
  setCloseModal,
  className,
}) {
  const handleExitClick = () => {
    if (document.getElementById("exitBTN1")) {
      const exitBTN = document.getElementById("exitBTN1");
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      exitBTN.dispatchEvent(clickEvent);
    }
  };

  const iconButtons = [
    {
      name: "Fetch",
      icon: <MdOutlineFilterList size={25} color="#B51CAF" />,
      function: onFetchClick,
      display: displayFetch,
    },
    {
      name: "New",
      icon: <HiOutlineWindow size={25} color="#2260ff" />,
      function: onNewClick,
      display: displayNew,
    },
    {
      name: "Refresh",
      icon: <IoIosRefresh size={25} color="#B51CAF" />,
      function: onRefreshClick,
      display: displayRefresh,
    },
    {
      name: "Approve",
      icon: <IoCheckmarkDoneSharp size={25} color="#12AF70" />,
      function: onAuthoriseClick,
      display: displayAuthorise,
    },
    {
      name: "Submit",
      icon: <IoCheckmarkSharp size={25} color="#12AF70" />,
      function: onOkClick,
      display: displayOk,
    },
    {
      name: "Return",
      icon: <AiOutlineStop size={25} color="red" />,
      function: onRejectClick,
      display: displayReject,
    },
    {
      name: "Suspend",
      icon: <IoHelp size={25} color="#000063" />,
      function: onHelpClick,
      display: displayHelp,
    },
    {
      name: "Exit",
      icon: <IoExitOutline size={25} color="red" />,
      function: onExitClick ? onExitClick : handleExitClick,
      display: displayExit,
    },
  ];

  
  return (
    <div className="flex w-full justify-end">
      <div
        className={` ${className} divide-x-[2px] divide-zinc-200 border-[2px] border-gray-400 w-fit `}
        style={{
          zoom: "0.90",
          display: "flex",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {iconButtons
          .filter((i) => i.display !== "none") // Filter buttons that shouldn't be displayed
          .map((i, index) => (
            <div
              key={index}
              className="flex items-center py-1 px-3 shadow-sm justify-center space-x-2 bg-white hover:bg-gray-200 hover:bg-opacity-75 hover:opacity-75 transition-all"
              onClick={i?.function ? i?.function : null}
            >
              <div className="flex active:scale-95 hover:scale-105 transition-all justify-center items-center">
                {i.icon}
              </div>
              <p className="text-gray-500 font-light text-[18px]">{i?.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ActionButtons;
