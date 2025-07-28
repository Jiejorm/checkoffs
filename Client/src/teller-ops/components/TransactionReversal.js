import React, { useEffect, useState } from "react";
import { API_SERVER } from "../../../../config/constant";
import axios from "axios";
import InputField from "./inputField";
import ListOfValue from "./ListOfValue";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import CustomTable from "./CustomTable";
// import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";
import { Modal } from "@mantine/core";
import { headers } from "../teller/teller-activities";
import ActionButtons from "../../../../components/others/action-buttons/ActionButtons";
import DetailsModal from "../teller/components/ReversalDetails";
function TransactionReversal({ from }) {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [statusChange, setStatusChange] = useState(false);
  const [transType, setTransType] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2 });
    return formatted;
  }
  function formatDate(value) {
    const eDate = new Date(value);
    const value_date = eDate
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

    return value_date;
  }
  useEffect(() => {
    setLoading(true);
    setMessage("Processing data , Please wait ...");
    axios
      .post(
        API_SERVER + "/api/transaction-reversal",
        {
          username: JSON.parse(localStorage.getItem("userInfo")).id,
          ...formData,
        },
        { headers }
      )
      .then((res) => {
        console.log({ res });
        setMessage("");
        const arr = [];
        res.data?.map((i) => {
          const [a, b, c, d, e, f, g, h, k] = i;
          arr.push([
            a,
            b,
            c,
            d,
            e,
            f,
            <div className="text-red-500">
              {g ? formatNumber(parseFloat(g)) : ""}
            </div>,
            h ? formatNumber(parseFloat(h)) : "",
            formatDate(k),
            <div
              onClick={() => {
                setShowModal(true);
                setContent({ transNo: i[1], batchNo: i[0] });
              }}
              className="bg-[#87d4d579] rounded py-1  w-[45px] text-center hover:ring-[2px] ring-cyan-300 transition duration-300 ease-in-out flex justify-center items-center "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 stroke-cyan-300 fill-gray-800"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>,
          ]);
        });
        setData(arr);
        setLoading(false);
        // console.log({ res });
      });
  }, [statusChange]);

  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/transaction-reversal",
        { key: "lov" },
        { headers }
      )
      .then((res) => {
        setTransType(res.data);
        // console.log({ res });
      });
  }, []);

  function handleFilter() {
    setMessage("Processing data , Please wait ...");
    axios
      .post(
        API_SERVER + "/api/transaction-reversal",
        {
          username: JSON.parse(localStorage.getItem("userInfo")).id,
          ...formData,
        },
        { headers }
      )
      .then((res) => {
        setMessage("");
        console.log({ res });
        const arr = [];
        res.data?.map((i) => {
          const [a, b, c, d, e, f, g, h, k] = i;
          arr.push([
            a,
            b,
            c,
            d,
            e,
            f,
            <div className="text-red-500">
              {g ? formatNumber(parseFloat(g)) : ""}
            </div>,
            h ? formatNumber(parseFloat(h)) : "",
            formatDate(k),
            <div
              onClick={() => {
                setShowModal(true);
                setContent({ transNo: i[1], batchNo: i[0] });
              }}
              className="bg-[#87d4d579] rounded py-1  w-[45px] text-center hover:ring-[2px] ring-cyan-300 transition duration-300 ease-in-out flex justify-center items-center "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 stroke-cyan-300 fill-gray-800"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>,
          ]);
        });
        setData(arr);
        // console.log({ res });
      });
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        // Perform your desired function here
        document.getElementById("filter").click();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };
  return (
    // <></>
    <div
      className={`transform ${
        from === "Main"
          ? "scale-[0.95] -mx-12 -mt-[1%]"
          : "scale-[0.85] -mx-24 -mt-[4%]"
      }  `}
    >
      <div className="flex justify-center space-x-3 mb-3 px-3">
        <div className="w-[100%] px-4 py-3 border-2 rounded">
          <div className="flex space-x-4 justify-between ">
            <InputField
              label={"Username"}
              labelWidth={"40%"}
              inputWidth={"60%"}
              disabled={true}
              marginBottom={"8px"}
              value={JSON.parse(localStorage.getItem("userInfo")).id}
            />

            <InputField
              label={"Posting Date"}
              labelWidth={"40%"}
              inputWidth={"60%"}
              disabled={true}
              marginBottom={"8px"}
              value={formatDate(
                JSON.parse(localStorage.getItem("userInfo"))?.postingDate
              )}
            />
          </div>

          <div className="font-bold text-gray-400 text-sm">FILTERS</div>
          <hr className="mb-2" />
          <div className="flex space-x-4 justify-between ">
            <ListOfValue
              label={"Transaction Status"}
              labelWidth={"40%"}
              inputWidth={"60%"}
              data={transType}
              value={formData?.transType}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, transType: value }));
                setStatusChange(!statusChange);
              }}
            />
            <div className="w-full">
              <InputField
                label={"Amount"}
                labelWidth={"40%"}
                inputWidth={"60%"}
                type={"number"}
                value={formData?.amount}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
          <div className="flex space-x-4 justify-between mt-2">
            <InputField
              label={"Batch Number"}
              labelWidth={"29%"}
              inputWidth={"43%"}
              value={formData?.batchNo}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  batchNo: e.target.value,
                }));
              }}
            />
            <div className="flex justify-end mt-2 w-[50%]">
              <ButtonComponent
                id={"filter"}
                label={"Filter"}
                buttonWidth={"20%"}
                buttonHeight={"30px"}
                onClick={handleFilter}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="px-2">
        <Modal
          size={"65%"}
          opened={showModal}
          trapFocus={false}
          // onHide={handleClose}
          withCloseButton={false}
          padding={0}
          // zIndex={"inherit"}
          centered
          onClose={() => {}}
        >
          <div className="p-0 m-0 ">
            <div
              style={{
                background: "#0580c0",
              }}
              className=" w-full rounded-t shadow"
            >
              <div className=" flex justify-between py-1 px-2 items-center ">
                <div className="text-white font-semibold uppercase tracking-wider">
                  Same day Reversal
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
          <DetailsModal
            showModal={showModal}
            setShowModal={setShowModal}
            content={content}
          />
        </Modal>
        <CustomTable
          loading={{
            status: loading,
            message: "Processing data...",
          }}
          // title={"Transaction Status"}
          headers={[
            "Batch Number",
            "Trans Number",
            "Account Number",
            "Account Description",
            "Currency",
            "Transaction Details",
            "Debit",
            "Credit",
            "Value Date",
            "Action",
          ]}
          data={data}
          defaultMessage={message}
          rowsPerPage={10}
          style={{ columnAlignRight: [7, 8] }}
        />
      </div>
    </div>
  );
}

export default TransactionReversal;
