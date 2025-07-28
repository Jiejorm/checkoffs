import React from "react";
import { Modal } from "antd";
import Header from "../Header/Header";
import "./modal.css";

const ModalComponent = ({ title, open, width, loading, content, centered, handleClose }) => {
  return (
    <Modal
      inert
      footer={null}
      destroyOnClose={true}
      closable={false}
      width={width || "30%"}
      maskClosable={true}
      className={"ant-modal"}
      centered={centered || false}
      loading={loading}
      open={open}
    >
      <Header title={title} handleClose={handleClose} closeIcon />
      <div className="p-3 pb-5">{content}</div>
    </Modal>
  );
};
export default ModalComponent;
