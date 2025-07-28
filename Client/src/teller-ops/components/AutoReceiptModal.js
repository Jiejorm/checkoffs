import { Modal } from "@mantine/core";
import { useState } from "react";

// import AutoReceiptPrinting from "../../../../components/AutoReceiptPrinting";
import AutoReceiptPrinting from "../../../../components/others/AutoReceiptPrinting";
import InputField from "./inputField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
const AutoReceiptModal = ({
  showModal,
  setShowModal,
  batchNo,
  setChecked,
  checked,
  title,
}) => {
  const handleClose = () => {
    if (!title) {
      // setChecked(!checked);
    } else {
      setBatchNoT("");
      setBatchNoY("");
    }
    setShowModal(false);
  };

  const [modalSize, setModalSize] = useState("sm");
  const [batchNoT, setBatchNoT] = useState("");
  const [batchNoY, setBatchNoY] = useState("");
  const [validate, setValidate] = useState(false);
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  return (
    <>
      <Modal
        id="globalModal"
        key="globalModal"
        backdrop="static"
        size={modalSize}
        fullscreen={false}
        opened={showModal}
        onHide={handleClose}
        // className="mt-8"
        lockScroll={false}
        padding={0}
        // centered
        withCloseButton={false}
      >
        <div>
          <div
            style={{
              background: "#daecfe",
            }}
            className=" w-full "
          >
            <div className=" flex justify-between py-1 px-2 items-center ">
              <div className="text-text-gray-800 font-semibold">
                {title ? title : "AUTORECEIPT PRINTING"}
              </div>

              <svg
                onClick={() => handleClose()}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                // style={{ padding: "10px" }}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer fill-cyan-500 stroke-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 2023030275976 */}
        <div style={{ background: "whitesmoke", overflow: "hidden" }}>
          <div className="bg-white -m-2 py-6 px-2  ">
            <div className="">
              <AutoReceiptPrinting batchNo={batchNo} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AutoReceiptModal;
