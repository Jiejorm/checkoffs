// import Modal from "react-bootstrap/Modal";
import { Modal } from "@mantine/core";
import { useState } from "react";

// import SigVer from "../../../../components/ImageVerification";
import SigVer from "../../../../components/others/ImageVerification";
const GlobalModal = ({
  showModal,
  setShowModal,
  accountNumber,
  setChecked,
  checked,
}) => {
  const handleClose = () => {
    // setChecked(!checked);
    setShowModal(false);
  };

  const [modalSize, setModalSize] = useState("md");
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  return (
    <>
      <Modal
        className=""
        size={"50%"}
        opened={showModal}
        onClose={handleClose}
        withCloseButton={false}
        padding={0}
        // centered
      >
        <div>
          <div
            style={{
              backgroundColor: "#0580c0",
            }}
            className=" w-full "
          >
            <div className=" flex justify-between py-1 px-2 items-center ">
              <div className="text-white font-semibold">
                SIGNATURE VERIFICATION
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
          {/* <hr style={{ marginTop: "-10%" }} /> */}
        </div>
        <div style={{ background: "whitesmoke" }}>
          <div className="h-[600px] overflow-hidden">
            <SigVer accountNumber={accountNumber} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GlobalModal;
