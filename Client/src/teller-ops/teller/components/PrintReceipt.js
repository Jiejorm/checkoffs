// import Modal from "react-bootstrap/Modal";
import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";

import { API_SERVER } from "../../../../../config/constant";
import InputField from "../../components/inputField";
import swal from "sweetalert";
import axios from "axios";

import ButtonComponent from "../../../../../components/others/Button/ButtonComponent";
import CustomTable from "../../components/CustomTable";
import AutoReceiptModal from "../../components/AutoReceiptModal";
import { headers } from "../teller-activities";

const PrintReceipt = ({ showModal, setShowModal, body, handleSelected }) => {
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dayTrans, setDayTrans] = useState([]);
  const [autoReceipt, setAutoReceipt] = useState(false);
  const [tMessage, setTMessage] = useState("");

  const handleClose = () => {
    setShowModal(false);
    setFilter([]);
  };

  const handleShow = () => setShowModal(true);

  const [modalSize, setModalSize] = useState("lg");
  const [selected, setSelected] = useState("");
  const [accountDescription, setAccountDescription] = useState("");

  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  useEffect(() => {
    setTMessage("Loading your day's transactions , Please wait ...");
    async function getDayTrans() {
      const response = await axios.post(
        API_SERVER + "/api/getTransactionDetails",
        { key: "0", username: JSON.parse(localStorage.getItem("userInfo")).id },
        { headers }
      );

      console.log({ response });
      const arr = [];

      response.data.map((i) => {
        arr.push([
          ...i,
          <div
            onClick={() => {
              print(i[0]);
            }}
            className="bg-[#39394351] rounded py-1 w-[45px] hover:ring-[2px] ring-zinc-900 transition duration-300 ease-in-out flex justify-center items-center "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 stroke-zinc-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
              />
            </svg>
          </div>,
        ]);
      });
      if (arr.length > 0) {
        setTMessage("");
        setDayTrans(arr);
      } else {
        setTMessage("You have made no transactions today");
        setDayTrans(arr);
      }
    }

    try {
      getDayTrans();
    } catch (error) {}
    if (showModal === false) {
      setFilter([]);
    }
  }, [showModal]);

  function print(batch_no) {
    setAutoReceipt({ status: true, batchNo: batch_no });
    // swal({
    //   text: `Print Receipt for this transaction ${batch_no}`,
    //   icon: "question",
    //   buttons: ["Cancel", "Ok"],
    //   dangerMode: true,
    // }).then((result) => {});
  }

  async function handleFind(e) {
    setLoading(true);
    try {
      const response = await axios.post(
        API_SERVER + "/api/find-by-name",
        {
          accountName: accountDescription,
        },
        { headers }
      );

      if (response.data.length > 0) {
        setLoading(false);

        setFilter(response.data);
      } else {
        swal({
          title: "Oops !!!",
          text: `No record match for account name '${accountDescription}' `,
          icon: "warning",
          buttons: "Ok",
          dangerMode: true,
        }).then((result) => {
          setFilter([]);
          setLoading(false);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log({ filter });

  return (
    <Modal
      size={"70%"}
      padding={0}
      opened={showModal}
      onClose={handleClose}
      withCloseButton={false}
      // centered
    >
      <div className style={{ zoom: "85%" }}>
        <div
          style={{
            backgroundColor: "#0580c0",
          }}
          className=" w-full "
        >
          <div className=" flex justify-between py-1 px-2 items-center ">
            <div className="text-white font-semibold uppercase">
              Print Receipt
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
        <div className=" rounded-b ">
          <AutoReceiptModal
            title={"Print Receipt"}
            showModal={autoReceipt.status}
            batchNo={autoReceipt.batchNo}
            setShowModal={setAutoReceipt}
          />
          <div className="mt-3 px-2">
            <div className="">
              <div style={{ maxHeight: "400px", overflow: "auto" }}>
                <CustomTable
                  headers={[
                    "Batch No.",
                    "Account No.",
                    "Account Name",
                    "Trans Type",
                    "Amount",
                    "Posted at",
                    "Teller",
                    "Action",
                  ]}
                  style={{ columnAlignRight: [5], columnFormat: [5] }}
                  rowsPerPage={10}
                  data={dayTrans}
                  defaultMessage={tMessage}
                />
              </div>
            </div>
          </div>

          <br />
        </div>
      </div>
    </Modal>
  );
};

export default PrintReceipt;
