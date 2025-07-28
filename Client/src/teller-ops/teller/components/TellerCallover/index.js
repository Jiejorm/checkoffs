import React, { useEffect, useState } from "react";
// import DataTable from "../../../../../components/others/Datatable/DataTable";
import { API_SERVER } from "../../../../../../config/constant";
import axios from "axios";
import InputField from "../../../components/inputField";
import ListOfValue from "../../../components/ListOfValue";
import ButtonComponent from "../../../../../../components/others/Button/ButtonComponent";
import CustomTable from "../../../components/CustomTable";
import { FiEdit } from "react-icons/fi";
import { Checkbox, Modal } from "@mantine/core";
import CalloverDetails from "./CalloverDetails";
import Header from "../../../../../../components/others/Header/Header";

function TellerCallover() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    status: "All Transactions",
  });
  const [amount, setAmount] = useState("");
  const [trans, setTrans] = useState({
    credit: 0,
    debit: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showCalledOver, setShowCalledOver] = useState(false);
  const [check, setCheck] = useState(false);
  const [data1, setData1] = useState([]);
  const [dataItems, setDataItems] = useState({});
  const [amountOne, setAmountOne] = useState("");
  const [count, setCount] = useState("");
  const [transNumber, setTransNumber] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };
  const userName = JSON.parse(localStorage.getItem("userInfo")).id;
  console.log({ dataItems });
  function formatDate(dateString) {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(dateString);

    // Get individual parts of the date
    const day = date.toLocaleString("en-GB", { day: "2-digit" });
    const month = date
      .toLocaleString("en-GB", { month: "short" })
      .toUpperCase();
    const year = date.toLocaleString("en-GB", { year: "numeric" });

    // Combine the parts with hyphens
    return `${month}-${day}-${year}`;
  }

  function formatNumber(amount) {
    const formattedAmount = amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    const amountWithoutCurrency = formattedAmount.replace("$", "");
    return amountWithoutCurrency;
  }
  const callOver = [];

  let totalDb = 0;
  let totalCr = 0;
  function handleFilter(type) {
    axios
      .post(
        API_SERVER + "/api/get-callover",
        {
          username: userName,
          batchNo: batchNumber,
          amt: amount,
          amt1: amountOne,
          tran_type: transactionType,
          key: showCalledOver ? "calledOver" : null,
        },
        { headers }
      )
      .then((res) => {
        callOver.length = 0;
        console.log(res, "ppp");

        res.data.map((item) => {
          const dbValue = parseFloat(item.local_equivalent_db);
          const crValue = parseFloat(item.local_equivalent_cr);

          // Add the values to the totals if they are not NaN
          if (!isNaN(dbValue)) {
            totalDb += dbValue;
          }
          if (!isNaN(crValue)) {
            totalCr += crValue;
          }

          callOver.push([
            <div>{item.batch_no}</div>,
            <div>{item.acct_link}</div>,
            <div>{item.acct_name}</div>,
            <div>{item.currency_code}</div>,
            <div>{item.transaction_details}</div>,
            <div style={{ textAlign: "right", color: "red" }}>
              {item.local_equivalent_db === "null"
                ? ""
                : formatNumber(+item.local_equivalent_db)}
            </div>,
            <div style={{ textAlign: "right" }}>
              {item.local_equivalent_cr === "null"
                ? ""
                : formatNumber(+item.local_equivalent_cr)}
            </div>,
            <div>{formatDate(item.voucher_date)}</div>,
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                onClick={() => {
                  setDataItems((prev) => ({
                    ...prev,
                    [item?.batch_no]: true,
                  }));
                  handleCheck(item.trans_no, showCalledOver);
                }}
                className="rounded group border-2 h-5 w-5 bg-white border-gray-300
                active:border-green-500 hover:bg-"
              >
                <div className="group-active:block hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      opacity=".4"
                      d="M17.1 2h-4.2C9.45 2 8.05 3.37 8.01 6.75h3.09c4.2 0 6.15 1.95 6.15 6.15v3.09c3.38-.04 4.75-1.44 4.75-4.89V6.9C22 3.4 20.6 2 17.1 2Z"
                      fill="#37d67a"
                    ></path>
                    <path
                      d="M11.1 8H6.9C3.4 8 2 9.4 2 12.9v4.2C2 20.6 3.4 22 6.9 22h4.2c3.5 0 4.9-1.4 4.9-4.9v-4.2C16 9.4 14.6 8 11.1 8Zm1.19 5.65-3.71 3.71a.71.71 0 0 1-.51.21.71.71 0 0 1-.51-.21L5.7 15.5a.712.712 0 0 1 0-1.01c.28-.28.73-.28 1.01 0l1.35 1.35 3.21-3.21c.28-.28.73-.28 1.01 0s.29.74.01 1.02Z"
                      fill="#37d67a"
                    ></path>
                  </svg>
                </div>
                {/* <Checkbox color="lime" checked={false} onChange={() => {}} /> */}
              </div>
              <div
                onClick={() => {
                  setShowModal(true);
                  setTransNumber(item.trans_no);
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
              </div>
            </div>,
          ]);
        });

        setTrans({ credit: totalCr, debit: totalDb });
        callOver.push([]);

        if (type || showCalledOver) {
          console.log({ callOver });
          setData1(callOver);
        } else {
          setData(callOver);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleCheck(trans_no, uncheck) {
    console.log({ uncheck });
    try {
      const response = await axios.post(
        API_SERVER + "/api/teller-callover",
        {
          key: uncheck ? "uncheck" : "check",
          trans_no,
        },
        { headers }
      );
      // alert("Gahan");
      console.log({ uncheck }, "2", response.data);
      setCheck(!check);
    } catch (error) {
      console.log({ uncheck }, error, "3");
    }
    // handleFilter();
  }

  async function handleCallOver() {
    const response = await axios.post(
      `${API_SERVER}/api/teller-callover`,
      { username: JSON.parse(localStorage.getItem("userInfo")).id },
      { headers }
    );

    setCount(response.data[0]);
    // console.log(response, "ppppp");
  }

  useEffect(() => {
    console.log("ppppp");
    // alert("ppp");
    handleFilter();
    handleCallOver();
  }, [check, showCalledOver]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        // Perform your desired function here
        document?.getElementById("btn")?.click();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    // <></>
    <div
      className="transform scale-[0.95] -mx-[1%] -mt-[1.5%]"
      style={{ zoom: 0.9 }}
    >
      <CalloverDetails
        trans_no={transNumber}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      {/* <hr className="my-[6px]" /> */}

      <div className="flex justify-center space-x-3 mb-3 px-3 ">
        <div className="w-[80%]  px-4 py-3 border rounded">
          <div className="flex space-x-4">
            <InputField
              label={"Username"}
              labelWidth={"33%"}
              inputWidth={"60%"}
              disabled={true}
              marginBottom={"8px"}
              value={JSON.parse(localStorage.getItem("userInfo")).id}
            />
            <div className="w-full flex justify-end space-x-4">
              <div className="flex space-x-8">
                <div className="flex  items-center  space-x-2">
                  <span className="text-gray-500 text-[95%]">Credit </span>
                  <div
                    className="font-semibold py-1 px-3"
                    style={{
                      textAlign: "right",
                      backgroundColor: "#e9e9ea",
                      // padding: "5px",
                      borderRadius: "3px",
                    }}
                  >
                    {formatNumber(trans?.credit)}
                  </div>
                </div>
                <div className="flex  items-center  space-x-2">
                  <span className="text-gray-500 text-[95%]">Debit </span>
                  <div
                    className="font-semibold text-red-500 py-1 px-3"
                    style={{
                      textAlign: "right",
                      backgroundColor: "#e9e9ea",
                      // padding: "5px",
                      borderRadius: "3px",
                    }}
                  >
                    {formatNumber(trans?.debit)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="font-bold text-gray-400 text-sm">FILTERS</div>
          <hr className="mt-0 mb-3" />
          <div className="flex space-x-4 justify-between ">
            <ListOfValue
              label={"Transaction Type"}
              labelWidth={"35%"}
              inputWidth={"65%"}
              // data={[
              //   "All Transactions",
              //   "Cheque Withdrawals",
              //   "Cash Withdrawals",
              //   "Cash Deposits",
              //   "Cheque Deposits",
              //   "Others",
              // ]}
              data={[
                { label: "All Transactions", value: "" },
                { label: "Cheque Withdrawals", value: "CHW" },
                { label: "Cash Withdrawals", value: "CAW" },
                { label: "Cash Deposits", value: "CAD" },
                { label: "Cheque Deposits", value: "CHD" },
                { label: "Others", value: "OTH" },
              ]}
              value={transactionType}
              // value={"ATT"}
              onChange={(value) => {
                setTransactionType(value);
                setTimeout(() => {
                  document.getElementById("btn").click();
                }, 500);
              }}
              onKeyPress={handleFilter}
            />

            <InputField
              label={"Batch Number"}
              labelWidth={"35%"}
              inputWidth={"65%"}
              type={"number"}
              value={batchNumber}
              onChange={(e) => {
                setBatchNumber(e.target.value);
              }}
              onKeyPress={handleFilter}
            />
          </div>
          <div className="flex mt-2 space-x-4">
            <InputField
              label={"Amount Between"}
              labelWidth={"34%"}
              inputWidth={"30%"}
              type={"number"}
              textAlign={"right"}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              onKeyPress={handleFilter}
            />
            <InputField
              label={"And"}
              labelWidth={"34%"}
              inputWidth={"30%"}
              textAlign={"right"}
              type={"number"}
              value={amountOne}
              onChange={(e) => {
                setAmountOne(e.target.value);
              }}
              onKeyPress={handleFilter}
            />
          </div>
          <div className="flex justify-end mt-2">
            <ButtonComponent
              id={"btn"}
              label={"Filter"}
              buttonWidth={"10%"}
              buttonHeight={"30px"}
              onClick={() => handleFilter("")}
            />
          </div>
        </div>
      </div>
      <hr />

      <div className="flex justify-between items-center my-2">
        <div className="flex items-center space-x-5 ">
          <div className="flex  items-center font-semibold space-x-2">
            <span>Count</span>
            <div
              className="font-bold py-1 px-3"
              style={{
                textAlign: "right",
                backgroundColor: "#e9e9ea",
                // padding: "5px",
                borderRadius: "3px",
              }}
            >
              {showCalledOver ? data1?.length : data?.length}
            </div>
          </div>
        </div>
        {showCalledOver ? (
          <div className="relative ">
            <button
              onClick={() => {
                setShowCalledOver(false);
              }}
              className="flex space-x-2 bg-black w-full justify-center   px-3 py-1 text-white rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="29"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fill="#d9e3f0"
                  d="M7.81 2h8.37C19.83 2 22 4.17 22 7.81v8.37c0 3.64-2.17 5.81-5.81 5.81H7.81C4.17 22 2 19.83 2 16.19V7.81C2 4.17 4.17 2 7.81 2z"
                  opacity=".4"
                ></path>
                <path
                  fill="#d9e3f0"
                  d="M13.92 8.98H8.77l.33-.33c.29-.29.29-.77 0-1.06a.754.754 0 00-1.06 0L6.47 9.16c-.29.29-.29.77 0 1.06l1.57 1.57c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-.26-.26h5.08c1.28 0 2.33 1.04 2.33 2.33s-1.04 2.33-2.33 2.33H9c-.41 0-.75.34-.75.75s.34.75.75.75h4.92c2.11 0 3.83-1.72 3.83-3.83 0-2.11-1.72-3.82-3.83-3.82z"
                ></path>
              </svg>
              <span>Back</span>
            </button>
          </div>
        ) : (
          <div className="relative flex justify-between ">
            <button
              onClick={() => {
                setShowCalledOver(true);
              }}
              className="whitespace-nowrap px-4 flex bg-black w-full justify-center space-x-2 text-[95%]  py-[4px] text-white rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  opacity=".4"
                  d="M20.5 10.19h-2.89c-2.37 0-4.3-1.93-4.3-4.3V3c0-.55-.45-1-1-1H8.07C4.99 2 2.5 4 2.5 7.57v8.86C2.5 20 4.99 22 8.07 22h7.86c3.08 0 5.57-2 5.57-5.57v-5.24c0-.55-.45-1-1-1Z"
                  fill="#d9e3f0"
                ></path>
                <path
                  d="M15.8 2.21c-.41-.41-1.12-.13-1.12.44v3.49c0 1.46 1.24 2.67 2.75 2.67.95.01 2.27.01 3.4.01.57 0 .87-.67.47-1.07-1.44-1.45-4.02-4.06-5.5-5.54ZM13.5 13.75h-6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75ZM11.5 17.75h-4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75Z"
                  fill="#d9e3f0"
                ></path>
              </svg>
              <span>View Transactions Called Over</span>
            </button>
            <span className="absolute top-[-19px] -right-4  bg-green-600 border-[3px] border-white text-white font-[500] rounded-full py-1 px-[10px]">
              {count}
            </span>
          </div>
        )}
      </div>
      {!showCalledOver ? (
        <div>
          <div className="" style={{ zoom: 0.9 }}>
            <div className="mb-1">
              <Header title="Transactions" headerShade={true} />
            </div>
            <CustomTable
              // loading={{
              //   status: true,
              //   message: "Fetching data please wait ...",
              // }}
              defaultMessage={<div>No Transactions have been called-over</div>}
              rowsPerPage={10}
              title={"Transaction Status"}
              headers={[
                "Batch Number",
                "Account Number",
                "Account Description",
                "Currency",
                "Transaction Details",
                "Debit",
                "Credit",
                "Value Date",
                "Check",
              ]}
              //   pagination={true}
              data={data}
            />
          </div>
        </div>
      ) : (
        <CalledOver
          getCallover={handleFilter}
          showModal={showCalledOver}
          setShowModal={setShowCalledOver}
          data={data1}
          setData={setData1}
        />
      )}
    </div>
  );
}

export default TellerCallover;

function CalledOver({ getCallover, showModal, setShowModal, data, setData }) {
  // const [data, setData] = useState([]);

  function handleClose() {
    setShowModal(false);
  }
  useEffect(() => {
    getCallover("calledOver", setData);
  }, [showModal]);

  return (
    <div>
      {/* <div className="flex justify-end my-3"></div> */}
      <div style={{ zoom: 0.9 }} className="mt-4  -mx-2">
        <div className="mb-1">
          <Header title="Transactions Called Over" headerShade={true} />
        </div>

        <CustomTable
          rowsPerPage={10}
          title={"Transaction Status"}
          headers={[
            "Batch Number",
            "Account Number",
            "Account Description",
            "Currency",
            "Transaction Details",
            "Debit",
            "Credit",
            "Value Date",
            "Check",
          ]}
          //   pagination={true}
          data={data}
        />
      </div>
    </div>
  );
}
