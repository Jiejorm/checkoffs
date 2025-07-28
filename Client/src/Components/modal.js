import { Modal, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import InvalidAccountsModal from "./InvalidAccountsModal";
import CurrencyMismatchesModal from "./CurrencyMismatchesModal";
import NonNormalModal from "./NonNormalModal";
import ViewExceptionsModal from "./viewExceptionsModal";
import AcctWithExcModal from "./AccountsWithExceptions";

const GlobalModal = ({
  showModal1,
  setShowModal1,
  form,
  setForm,
  content,
  documentNo,
  type,
  batch,
  currency_CODE,
  modalKey,
  acctData,
  // InvalidAccountData,
}) => {
  const [body, setBody] = useState("");
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [loading, setLoading] = useState(false);
  // console.log(documentNo);
  const handleClose = () => {
    setForm("");
    setShowModal1(false);
  };

  const [modalSize, setModalSize] = useState("xl");
  const [selected, setSelected] = useState("");
  const [resize, setResize] = useState(false);

  // console.log({ form });
  useEffect(() => {
    switch (form) {
      case "Invalid Accounts":
        setBody(<InvalidAccountsModal GETKey={modalKey} GETbatchNumber={batch}/>);
        break;
      case "Currency Mismatches":
        setBody(<CurrencyMismatchesModal GETKey={modalKey} GETbatchNumber={batch} GETCurrencyCode={currency_CODE}/>);
        break;
      case "Non Normal":
        setBody(<NonNormalModal GETKey={modalKey} GetBatch={batch} GetCurrencyCode={currency_CODE}/>);
        break;
        case "View Exceptions":
          setBody(<ViewExceptionsModal GETKey={modalKey} GetBatch={batch} GetCurrencyCode={currency_CODE}/>);
          break;  
      case "Accounts With Exceptions":
        setBody(<AcctWithExcModal  
          GetBatch={batch}
          //  TableData={acctData}
           />);
        break;
      default:
        setBody("");
        break;
    }
  }, [showModal1]);

  return (
    <Modal
      className=""
      size={"70%"}
      opened={showModal1}
      withCloseButton={false}
      trapFocus={false}
      padding={0}
      onClose={() => {
        setShowModal1(false);
      }}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <div className="">
        <div className="p-0 m-0">
          <div
            style={{
              backgroundColor: "#0580c0",
            }}
            className=" w-full rounded-t shadow"
          >
            <div className=" flex justify-between py-2 px-2 text-[90%] items-center ">
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
        <div className=" p-0 ">
          <div className=" overflow-x-hidden">{body}</div>
        </div>
        <div className="p-0 m-0" style={{ display: "none" }}>
          {/* <Button id="globalModalCloseBtn" style={{ background: "#0047AB", color: "white", paddingLeft: "20px", paddingRight: "20px" }} variant='dark' onClick={props.onHide}>Close Form</Button> */}
        </div>
      </div>
    </Modal>
  );
};

export default GlobalModal;
