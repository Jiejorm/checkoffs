import { Modal, ScrollArea } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import CashOperation from "../teller/cash-operation";
import DenominationExchange from "../teller/denomination-exchange";
import CashRequestFromVault from "../teller/cash-request-from-vault";
import TransactionStatus from "./TransactionStatus";
import TransactionReversal from "./TransactionReversal";
// import AutoReceiptPrinting from "../../../../../components/AutoReceiptPrinting";
import CashLimit from "./CashLimit";
import CashMovementOutwards from "../vault/components/CashMovementOutwards";
import TransactionJournal from "./TransactionJournal";
import CashTransferToVault from "../teller/cash-transfer-to-vault";
// import TellerCallover from "../../teller/components/TellerCallover";
import TellerCallover from "../teller/components/TellerCallover";
import TellerClosure from "./TellerClosure";
import { globalContext } from "../../../../App";

const GlobalModal = ({
  showModal,
  setRefetch,
  refetch,
  setShowModal,
  setModalsize,
  form,
  setForm,
  msize,
  content,
  type,
}) => {
  const [body, setBody] = useState("");
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setForm("");
    setShowModal(false);
    // setModalsize("");
    if (refetch !== undefined) {
      setRefetch((prev) => !prev);
    }
  };

  const [modalSize, setModalSize] = useState("xl");
  const [selected, setSelected] = useState("");
  const [resize, setResize] = useState(false);
  const { approvalClick, setApprovalClick } = useContext(globalContext);
  console.log({ form });
  useEffect(() => {
    switch (form) {
      case "Cash Operation":
        localStorage.removeItem("cashOperation");
        setApprovalClick("");
        setBody(<CashOperation resize={!resize} />);
        break;
      case "Cash Request From Vault":
        setBody(<CashRequestFromVault />);
        break;
      case "Denomination Exchange":
        setBody(<DenominationExchange />);
        break;
      case "Transaction Status":
        setBody(<TransactionStatus />);
        break;
      case "Transaction Reversal":
        setBody(<TransactionReversal />);
        break;
      case "Cash Limit":
        setBody(<CashLimit />);
        break;
      case "Account Message":
        setBody(content);
        break;
      case "Cash Movement Outward":
        setBody(<CashMovementOutwards />);
        break;
      case "Transaction Journal":
        setBody(<TransactionJournal type={type} />);
        break;
      case "Cash Transfer To Vault":
        setBody(<CashTransferToVault />);
        break;
      case "Teller Callover":
        setBody(<TellerCallover />);
        break;
      case "Teller Closure":
        setBody(<TellerClosure />);
        break;

      default:
        setBody("");
        break;
    }
  }, [showModal]);

  return (
    <Modal
      className=""
      size={"80%"}
      opened={showModal}
      withCloseButton={false}
      padding={0}
      onClose={() => {
        setShowModal(false);
      }}
      trapFocus={true}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <div className="w-full ">
        <div className="p-0 m-0 w-full fixed top-0 z-50">
          <div
            style={{
              backgroundColor: "#0580c0",
            }}
            className=" w-full rounded-t shadow"
          >
            <div className=" flex justify-between py-1 px-2 text-[90%] items-center ">
              <div className="text-white font-semibold uppercase tracking-wider">
                {form}
              </div>

              <svg
                onClick={() => handleClose()}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                // style={{ padding: "10px" }}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 z-50 cursor-pointer fill-cyan-500 stroke-white"
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
        <div className=" p-0 mt-12 ">
          <div className="px-2 w-full ">{body}</div>
        </div>
        <div className="p-0 m-0" style={{ display: "none" }}>
          {/* <Button id="globalModalCloseBtn" style={{ background: "#0047AB", color: "white", paddingLeft: "20px", paddingRight: "20px" }} variant='dark' onClick={props.onHide}>Close Form</Button> */}
        </div>
      </div>
    </Modal>
  );
};

export default GlobalModal;
