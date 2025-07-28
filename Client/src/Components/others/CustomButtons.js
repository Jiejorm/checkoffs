import React from "react";
import { AiOutlineDelete, AiOutlineFileText, AiOutlineEye } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight, HiPrinter } from "react-icons/hi";
import { FiSave } from "react-icons/fi";
import { FaSignature } from "react-icons/fa";
import { SlRefresh } from "react-icons/sl";
import { TbWorldDownload } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { MdDeleteSweep } from "react-icons/md";
import { VscClose } from "react-icons/vsc";
import { IoExitOutline } from "react-icons/io5";

const CustomButtons = {
  insert: {
    bgColor: "#40c057",
    icon: <BiAddToQueue size={20} color={"white"} />,
  },

  removeAll: {
    bgColor: "#fa5252",
    icon: <MdDeleteSweep size={20} color={"white"} />,
  },

  print: {
    bgColor: "#6c6c6c",
    icon: <HiPrinter size={20} color={"white"} />,
  },

  exit: {
    bgColor: "#f04355",
    icon: <IoExitOutline size={20} color={"white"} />,
  },

  save: {
    bgColor: "#12b886",
    icon: <FiSave size={20} color={"white"} />,
  },

  sigVer: {
    bgColor: "#fab005",
    icon: <FaSignature size={20} color={"white"} />,
  },

  viewDoc: {
    bgColor: "#c4549c",
    icon: <AiOutlineFileText size={20} color={"white"} />,
  },

  refresh: {
    // bgColor: "#7950f2",
    // bgColor: "#4c6ef5",
    bgColor: "#FF8C8A",
    icon: <SlRefresh size={20} color={"white"} />,
  },

  fetch: {
    bgColor: "#4c6ef5",
    icon: <TbWorldDownload size={20} color={"white"} />,
  },

  viewDetails: {
    bgColor: "#48c1d8",
    icon: <AiOutlineEye size={20} color={"white"} />,
  },

  next: {
    bgColor: "#48c1d8",
    icon: <HiOutlineArrowNarrowRight size={20} color={"white"} />,
  },

  return: {
    bgColor: "#48c1d8",
    icon: <HiOutlineArrowNarrowLeft size={20} color={"white"} />,
  },

  edit: {
    bgColor: "#48c1d8",
    icon: <CiEdit size={20} color={"white"} />,
  },

  delete: {
    bgColor: "#fc797e",
    icon: <AiOutlineDelete size={20} color={"white"} />,
  },

  removeRow: {
    bgColor: "#48c1d8",
    icon: <VscClose size={20} color={"white"} />,
  },
};

export default CustomButtons;
