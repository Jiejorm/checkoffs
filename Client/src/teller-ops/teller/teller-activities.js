import React, { useState, useEffect } from "react";
import { GiReceiveMoney } from "react-icons/gi/index.esm";

import Label from "../../../../components/others/Label/Label";
// import SelectField from "./components/SelectField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";

// import ListOfValue from "../components/ListOfValue";
// import InputField from "../components/inputField";
import ListOfValue from "../../../../components/others/Fields/ListOfValue";
import InputField from "../../../../components/others/Fields/InputField";
import { DatePicker } from "antd";
import axios from "axios";
import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
import AccountSummary from "../../../../components/others/AccountSummary";
// import { checkInternetConnection } from "./components/checkConnection";
import { API_SERVER } from "../../../../config/constant";
import CustomModal from "../components/CustomModal";
import CashLimit from "../components/CashLimit";
import CustomTable from "../components/CustomTable";
export const headers = {
  "x-api-key":
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "Content-Type": "application/json",
};
export default function TellerActivities({
  handleSubmit,
  //   formData,
  checked,
  //   setFormData,
  setBatchNo,
  body,
}) {
  const [formData, setFormData] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [nav, setNav] = useState("Main");
  const [selectedCurrency, setSelectedCurrency] = useState("010");
  const [page, setPage] = useState("");

  const [currency, setCurrency] = useState("");

  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  useEffect(() => {
    axios
      .get(API_SERVER + "/api/get-currency-breado/1", { headers })
      .then((response) => {
        setCurrency(response.data);
      });
  }, []);

  useEffect(() => {
    if (nav === "Pending Cash In") {
      setPage(<PCashIn selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Main") {
      setPage(<Main selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Pending Cash Out") {
      setPage(<PCashOut selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Ungranted Cash Request") {
      setPage(
        <UCashRequest selectedCurrency={selectedCurrency} setNav={setNav} />
      );
    } else if (nav === "Cash Received") {
      setPage(<CashR selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Cash Sent") {
      setPage(<CashS selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Cash Limit") {
      setPage(
        <CashLimit
          selectedCurrency={selectedCurrency}
          setNav={setNav}
          type={"T"}
        />
      );
    }
  }, [nav, selectedCurrency]);

  console.log({ nav });
  return (
    <>
      <div className="overflow-y-scroll">
        <div className=" rounded h-auto  bg-gray-200 ">
          <div style={{ width: "100%" }} className=" ">
            <div className="md:w-[100%] rounded    md:mr-2 md:mb-0 ">
              <div className="  px-1  bg-white shadow-sm mb-2">
                <div className="border-2 p-2 py-[10px] rounded flex justify-center w-full">
                  <div className="w-1/2 space-y-2">
                    <InputField
                      label={"Teller Name"}
                      labelWidth={"40%"}
                      inputWidth={"60%"}
                      disabled={true}
                      value={`${
                        JSON.parse(localStorage.getItem("userInfo")).id
                      } - ${
                        JSON.parse(localStorage.getItem("userInfo")).username
                      }`}
                    />
                    <ListOfValue
                      label={"Currency"}
                      labelWidth={"40%"}
                      inputWidth={"60%"}
                      data={currency}
                      disabled={nav !== "Main"}
                      value={selectedCurrency}
                      onChange={(value) => {
                        setSelectedCurrency(value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <hr className="my-[5px]" />
              {page}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Main({ selectedCurrency, setNav }) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [contact, setContact] = useState("");
  const [tillPosition, setTillPosition] = useState("");
  const [form, setForm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalsize, setModalsize] = useState("");
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  // const [total, setTotal] = useState("");
  // const total = [];
  let totals = 0;
  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }

  // console.log("from main", selectedCurrency);
  useEffect(() => {
    setLoading(true);
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers: headers }
      )
      .then((response) => {
        // console.log("ghana", response);
        const arr = [];
        let total = 0;
        response.data?.denominations?.map((i) => {
          const [a, b, c, d] = i;
          arr.push([
            a,
            <div className="text-left">{b}</div>,
            c,
            formatNumber(d).replace(".00", ""),
          ]);
          total += i[2];
        });

        arr.push([null, "Total", total, null]);

        // console.log({ arr });
        setTillPosition({
          denominations: arr,
          tillActivities: response?.data?.tillActivities,
        });
        setLoading(false);
        // console.log({ response });
      });
  }, [selectedCurrency, refetch]);
  return (
    <>
      <div className={`bg-white shadow py-2 px-2 `}>
        <div className="flex  w-full items-center justify-between mb-2">
          <div className="md:w-[65%] space-x-3 w-full flex items-center">
            <ButtonComponent
              onClick={() => {
                setShowModal(true);
                setNav("Cash Limit");
              }}
              label="Cash Limit"
              buttonBackgroundImage={
                `url(` +
                window.location.origin +
                `/assets/images/headerBackground/` +
                getTheme.theme.headerImage +
                `)`
              }
              buttonWidth="25%"
              buttonHeight="30px"
              buttonColor="white"
            />
            <ButtonComponent
              onClick={() => {
                setShowModal(true);
                setForm("Transaction Journal");
              }}
              label="Transaction Journal"
              buttonBackgroundImage={
                `url(` +
                window.location.origin +
                `/assets/images/headerBackground/` +
                getTheme.theme.headerImage +
                `)`
              }
              buttonWidth="20%"
              buttonHeight="30px"
              buttonColor="white"
            />
            <ButtonComponent
              onClick={() => {
                setShowModal(true);
                setForm("Transaction Status");
              }}
              label="Transaction Status"
              buttonBackgroundImage={
                `url(` +
                window.location.origin +
                `/assets/images/headerBackground/` +
                getTheme.theme.headerImage +
                `)`
              }
              buttonWidth="20%"
              buttonHeight="30px"
              buttonColor="white"
            />
          </div>
          <ButtonComponent
            onClick={() => {
              setShowModal(true);
              setForm("Teller Closure");
            }}
            label="Teller Closure"
            buttonBackgroundImage={
              `url(` +
              window.location.origin +
              `/assets/images/headerBackground/` +
              getTheme.theme.headerImage +
              `)`
            }
            buttonWidth="15%"
            buttonHeight="30px"
            buttonColor="white"
          />
          <CustomModal
            type={"T"}
            setShowModal={setShowModal}
            setModalsize={setModalsize}
            msize={modalsize}
            showModal={showModal}
            form={form}
            setForm={setForm}
            setRefetch={setRefetch}
            refetch={refetch}
          />
        </div>

        <hr className="mb-[10px] mt-0 my-3" />
        <div
          className="px-3 py-1 mb-2 text-gray-800 font-semibold"
          style={{
            background: "#daecfe",
          }}
        >
          TILL POSITION
        </div>
        <div className="flex space-x-2">
          <div className="w-[65%] border-2 rounded p-1">
            <CustomTable
              loading={{
                status: loading,
                message: "Processing data...",
              }}
              headers={["Denomination ++ 2", "Amount", "Quantity"]}
              style={{ columnFormat: [3], columnAlignRight: [3, 4] }}
              data={tillPosition?.denominations}
              rowsPerPage={10}
            />
          </div>
          <div className="w-[35%] border-2 rounded p-1">
            <div
              className="px-3 py-1 font-semibold"
              style={{
                background:
                  `url(` +
                  window.location.origin +
                  `/assets/images/background/` +
                  getTheme.theme.backgroundImage +
                  `)`,
              }}
            >
              CASH ACTIVITIES
            </div>
            <div className="mt-2 font-semibold px-2">
              <div className=" mb-5">
                <div className="mb-2 text-zinc-400">Cash Pending</div>
                <div className="flex space-x-2 rounded mb-2">
                  <InputField
                    label={"Pending Cash In"}
                    labelWidth={"48%"}
                    inputWidth={"52%"}
                    disabled={true}
                    textAlign={"right"}
                    value={formatNumber(
                      tillPosition?.tillActivities?.pending_cash_in ?? 0
                    )}
                    onChange={(e) => {
                      setTillPosition((prev) => ({
                        ...prev,
                        tillActivities: {
                          pending_cash_in: e.target.value,
                        },
                      }));
                    }}
                  />
                  <div
                    onClick={() => {
                      setNav("Pending Cash In");
                    }}
                    className="cursor-pointer rounded-sm bg-white border-[0.5px] border-gray-300 hover:shadow-md p-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex space-x-2 rounded mb-2">
                  <InputField
                    label={"Pending Cash Out"}
                    labelWidth={"48%"}
                    inputWidth={"52%"}
                    textAlign={"right"}
                    disabled={true}
                    value={formatNumber(
                      tillPosition?.tillActivities?.pending_cash_out ?? 0
                    )}
                    onChange={(e) => {
                      setTillPosition((prev) => ({
                        ...prev,
                        tillActivities: {
                          pending_cash_out: e.target.value,
                        },
                      }));
                    }}
                  />
                  <div
                    onClick={() => {
                      setNav("Pending Cash Out");
                    }}
                    className="cursor-pointer rounded-sm bg-white border-[0.5px] border-gray-300 hover:shadow-md p-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex space-x-2 rounded">
                  <InputField
                    label={"Ungranted Cash Request"}
                    labelWidth={"48%"}
                    inputWidth={"52%"}
                    disabled={true}
                    textAlign={"right"}
                    value={formatNumber(
                      tillPosition?.tillActivities?.ungranted_cash_request ?? 0
                    )}
                    onChange={(e) => {
                      setTillPosition((prev) => ({
                        ...prev,
                        tillActivities: {
                          ungranted_cash_request: e.target.value,
                        },
                      }));
                    }}
                  />
                  <div
                    onClick={() => {
                      setNav("Ungranted Cash Request");
                    }}
                    className="cursor-pointer rounded-sm bg-white border-[0.5px] border-gray-300 hover:shadow-md p-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-semibold mb-2 text-green-500">
                  Cash Confirmed
                </div>
                <div className="flex space-x-2 rounded mb-2">
                  <InputField
                    label={"Cash Received"}
                    labelWidth={"48%"}
                    inputWidth={"52%"}
                    disabled={true}
                    textAlign={"right"}
                    value={formatNumber(
                      tillPosition?.tillActivities?.cash_received ?? 0
                    )}
                    onChange={(e) => {
                      setTillPosition((prev) => ({
                        ...prev,
                        tillActivities: {
                          cash_received: e.target.value,
                        },
                      }));
                    }}
                  />
                  <div
                    onClick={() => {
                      setNav("Cash Received");
                    }}
                    className="cursor-pointer rounded-sm bg-white border-[0.5px] border-gray-300 hover:shadow-md p-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex space-x-2 rounded mb-2">
                  <InputField
                    label={"Cash Sent"}
                    labelWidth={"48%"}
                    inputWidth={"52%"}
                    disabled={true}
                    textAlign={"right"}
                    value={formatNumber(
                      tillPosition?.tillActivities?.cash_sent ?? 0
                    )}
                    onChange={(e) => {
                      setTillPosition((prev) => ({
                        ...prev,
                        tillActivities: {
                          cash_sent: e.target.value,
                        },
                      }));
                    }}
                  />
                  <div
                    onClick={() => {
                      setNav("Cash Sent");
                    }}
                    className="cursor-pointer rounded-sm bg-white border-[0.5px] border-gray-300 hover:shadow-md p-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 stroke-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" space-x-3 px-2 mt-2 w-full flex items-center justify-between">
        <ButtonComponent
          onClick={() => {
            setForm("Cash Request From Vault");
            setShowModal(true);
            setModalsize("50%");
          }}
          label="Cash Request From Vault"
          buttonBackgroundImage={
            `url(` +
            window.location.origin +
            `/assets/images/headerBackground/` +
            getTheme.theme.headerImage +
            `)`
          }
          buttonWidth="25%"
          buttonHeight="30px"
          buttonColor="white"
        />
        <ButtonComponent
          onClick={() => {
            setShowModal(true);
            setForm("Denomination Exchange");
          }}
          label="Denomination Exchange"
          buttonBackgroundImage={
            `url(` +
            window.location.origin +
            `/assets/images/headerBackground/` +
            getTheme.theme.headerImage +
            `)`
          }
          buttonWidth="25%"
          buttonHeight="30px"
          buttonColor="white"
        />
        <ButtonComponent
          onClick={() => {
            setForm("Cash Transfer To Vault");
            setShowModal(true);
            setModalsize("50%");
          }}
          label="Cash Transfer To Vault"
          buttonBackgroundImage={
            `url(` +
            window.location.origin +
            `/assets/images/headerBackground/` +
            getTheme.theme.headerImage +
            `)`
          }
          buttonWidth="25%"
          buttonHeight="30px"
          buttonColor="white"
        />
        <ButtonComponent
          onClick={() => {
            setForm("Cash Operation");
            setShowModal(true);
          }}
          label="Cash Operation"
          buttonBackgroundImage={
            `url(` +
            window.location.origin +
            `/assets/images/headerBackground/` +
            getTheme.theme.headerImage +
            `)`
          }
          buttonWidth="25%"
          buttonHeight="30px"
          buttonColor="white"
        />
        <ButtonComponent
          onClick={() => {
            setForm("Transaction Reversal");

            setShowModal(true);
          }}
          label="Transaction Reversal"
          buttonBackgroundImage={
            `url(` +
            window.location.origin +
            `/assets/images/headerBackground/` +
            getTheme.theme.headerImage +
            `)`
          }
          buttonWidth="20%"
          buttonHeight="30px"
          buttonColor="white"
        />
        <ButtonComponent
          onClick={() => {
            setForm("Teller Callover");
            setShowModal(true);
          }}
          label="Teller Callover"
          buttonBackgroundImage={
            `url(` +
            window.location.origin +
            `/assets/images/headerBackground/` +
            getTheme.theme.headerImage +
            `)`
          }
          buttonWidth="20%"
          buttonHeight="30px"
          buttonColor="white"
        />
      </div>
    </>
  );
}

function PCashIn({ selectedCurrency, setNav }) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [contact, setContact] = useState("");
  const [denominations, setDenominations] = useState([]);
  const [batchNumber, setBatchNumber] = useState([]);

  const [requestedCash, setRequestedCash] = useState([]);
  const [form, setForm] = useState("");
  const [showModal, setShowModal] = useState(false);

  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }
  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Pending Cash In",
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        const arr = [];
        console.log({ response });
        response.data?.map((i) => {
          arr.push([
            ...i,
            <div className="flex items-center justify-center">
              <svg
                onClick={() => fetchDenominations(i[2])}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-orange-500 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                />
              </svg>
            </div>,
          ]);
        });
        setRequestedCash(arr);
      });
  }, []);

  function fetchDenominations(value) {
    let arrd = [];
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Pending Cash In",
          batchNumber: value,
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        response.data.map((i) => {
          arrd.push([i[0], i[1], i[3], i[2]]);
        });
        setDenominations(arrd);
      });
  }
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  let total = 0;
  let dTotal = 0;
  return (
    <>
      <div className="bg-white shadow py-2 -mb-10  ">
        <div className="flex justify-end px-2 mb-2">
          <ButtonComponent
            label={"Back"}
            buttonHeight={"30px"}
            buttonWidth={"10%"}
            onClick={() => {
              setNav("Main");
            }}
          />
        </div>
        <div
          className="px-3 py-1 mb-2 font-semibold"
          style={{
            background: "#daecfe",
          }}
        >
          CASH PENDING
        </div>

        <div className="flex space-x-2 px-2">
          <div className="w-[55%] border-2 rounded py-2 px-1 min-h-[250px]">
            <div className="mb-1  text-gray-600 px-2 py-2 capitalize font-semibold">
              Cash Received from Vault
            </div>
            <CustomTable
              headers={["Requested By", "Amount", "Batch Number", "Action"]}
              data={requestedCash}
              style={{ columnFormat: [2], columnAlignRight: [2] }}
              defaultMessage={"No pending Cash in"}
            />
          </div>
          <div className="w-[45%] min-h-[250px] py-2 border-2 rounded px-1 relative">
            <div className="mb-1  text-gray-600 px-2 py-2 font-semibold">
              Denomination Breakdown
            </div>
            <CustomTable
              headers={["Denomination ++ 2", "Amount", "Quantity"]}
              data={denominations}
              style={{ columnFormat: [3], columnAlignRight: [3, 4] }}
              defaultMessage={"Pick an amount to show denomination breakdown"}
            />
            {denominations.length > 0 && (
              <div className="flex justify-end">
                <ButtonComponent
                  label={"Receive"}
                  buttonWidth={"20%"}
                  buttonHeight={"30px"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PCashOut({ selectedCurrency, setNav }) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [contact, setContact] = useState("");
  const [denominations, setDenominations] = useState([]);
  const [batchNumber, setBatchNumber] = useState([]);

  const [transferredCash, setTransferredCash] = useState([]);
  const [form, setForm] = useState("");
  const [showModal, setShowModal] = useState(false);

  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }
  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Pending Cash Out",
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        const arr = [];
        response.data.map((i) => {
          const [a, b, c] = i;
          console.log(i, "kl");
          arr.push([
            a,
            b,
            c,
            <div className="flex justify-center">
              <span className="bg-[#e4c6a2aa] hover:border-orange-500 hover:border-2  rounded flex justify-center items-center w-[35px] h-[30px]">
                <svg
                  onClick={() => fetchDenominations(c)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 stroke-orange-500 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                  />
                </svg>
              </span>
            </div>,
          ]);
        });
        // console.log({ response });
        setTransferredCash(arr);
      });
  }, []);

  function fetchDenominations(value) {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Pending Cash Out",
          batchNumber: value,
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        setDenominations(response.data);
        console.log({ response });
      });
  }
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };
  let total = 0;
  let dTotal = 0;
  return (
    <>
      <div className="bg-white shadow py-2 ">
        <div className="flex justify-end px-2 mb-2">
          <ButtonComponent
            label={"Back"}
            buttonHeight={"30px"}
            buttonWidth={"10%"}
            onClick={() => {
              setNav("Main");
            }}
          />
        </div>
        <div
          className="px-3 py-1 mb-2 font-semibold"
          style={{
            background: "#daecfe",
          }}
        >
          CASH PENDING
        </div>

        <div className="flex space-x-2 px-2">
          <div className="w-[55%] min-h-[250px] border-2 rounded py-3 px-1">
            <div className="mb-2  px-2 font-semibold">Cash Sent To Vault</div>
            {/* <table className="w-full  bg-white rounded-sm   even:bg-slate-300  border-spacing-2 border border-gray-800">
              <thead>
                <tr
                  className="py-1 uppercase font-semibold "
                  style={{
                    background:
                      `url(` +
                      window.location.origin +
                      `/assets/images/background/` +
                      getTheme.theme.backgroundImage +
                      `)`,
                  }}
                >
                  <th className=" px-2 py-1 border border-gray-800">
                    Received By
                  </th>
                  <th className=" px-2 py-1 border border-gray-800">Amount</th>
                  <th className=" px-2 py-1 border w-32 border-gray-800">
                    Batch Number
                  </th>
                  <th className=" px-2 py-1 border w-32 border-gray-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {transferredCash?.length > 0 ? (
                  <>
                    {transferredCash?.map((i, key) => {
                      total += i.amount;
                      return (
                        <tr
                          key={key}
                          className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-zinc-100   border border-gray-800`}
                        >
                          <td
                            // style={{
                            //   background: getTheme.theme.navBarColor,
                            // }}
                            className=" border border-gray-800  capitalize px-2 py-1"
                          >
                            {i?.transferred_to}
                          </td>

                          <td className=" border border-gray-800 bg-[whitesmoke]  px-2 py-1">
                            {i.amount === "null"
                              ? "0.00"
                              : formatNumber(i.amount)}
                          </td>
                          <td className=" border border-gray-800   px-2 py-1">
                            {i?.batch_no}
                          </td>
                          <td className=" border border-gray-800   px-2 py-1 flex justify-center">
                            <svg
                              onClick={() => fetchDenominations(i?.batch_no)}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 stroke-orange-500 cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                              />
                            </svg>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className=" border border-gray-800 font-semibold text-center   px-2 py-1">
                        Total
                      </td>
                      <td className="font-semibold border text-right bg-[whitesmoke] border-gray-800   px-2 py-1">
                       
                        {formatNumber(`${total}`)}
                      </td>
                      <td className=" border border-gray-800   px-2 py-1">
                        &nbsp;
                      </td>
                      <td className=" border border-gray-800   px-2 py-1">
                        &nbsp;
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={3} className="py-1 text-center animate-pulse">
                      No pending cash out...
                    </td>
                  </tr>
                )}
              </tbody>
            </table> */}

            <CustomTable
              headers={["Received By", "Amount", "Batch Number", "Action"]}
              data={transferredCash}
              style={{ columnFormat: [2] }}
              defaultMessage={"No Pending Cash Out"}
            />
          </div>
          <div className="w-[45%] min-h-[250px] py-3 border-2 rounded px-1">
            <div className="mb-2  px-2 font-semibold ">
              Denomination Breakdown
            </div>
            {/* <table className="w-full  bg-white rounded-sm   even:bg-slate-300  border-spacing-2 border border-gray-800">
              <thead>
                <tr
                  className="py-1 uppercase font-semibold "
                  style={{
                    background:
                      `url(` +
                      window.location.origin +
                      `/assets/images/background/` +
                      getTheme.theme.backgroundImage +
                      `)`,
                  }}
                >
                  <th colSpan={2} className=" px-2 py-1 border border-gray-800">
                    Denomination
                  </th>
                  <th className=" px-2 py-1 border border-gray-800">Amount</th>
                  <th className=" px-2 py-1 border w-32 border-gray-800">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {denominations.length <= 0 ? (
                  <tr
                    className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-zinc-100  cursor-pointer border border-gray-800`}
                  >
                    <td
                      // style={{
                      //   background: getTheme.theme.navBarColor,
                      // }}
                      colSpan={4}
                      className=" border border-gray-800 text-center animate-pulse  capitalize px-2 py-4"
                    >
                      Pick an amount to show denomination breakdown
                    </td>
                  </tr>
                ) : (
                  <>
                    {denominations.map((i) => {
                      dTotal += i[3];
                      return (
                        <tr>
                          <td className=" border border-gray-800   px-2 py-1">
                            {i[0]}
                          </td>
                          <td className=" border border-gray-800   px-2 py-1">
                            {i[1]}
                          </td>
                          <td className=" border border-gray-800 text-right bg-[whitesmoke]   px-2 py-1">
                            {formatNumber(parseFloat(i[3]))}
                          </td>
                          <td className=" border border-gray-800 text-right  px-2 py-1">
                            {formatNumber(parseFloat(i[2])).replace(".00", "")}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className=" border border-gray-800   px-2 py-1">
                        &nbsp;
                      </td>
                      <td className=" border border-gray-800 font-semibold text-center   px-2 py-1">
                        Total
                      </td>
                      <td className="font-semibold border text-right bg-[whitesmoke] border-gray-800   px-2 py-1">
                       
                        {formatNumber(`${dTotal}`)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table> */}
            <CustomTable
              headers={["Denomination ++ 2", "Amount", "Quantity"]}
              data={denominations}
              style={{ columnFormat: [3], columnAlignRight: [3] }}
              defaultMessage={"Pick an amount to show denomination breakdown"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function CashR({ selectedCurrency, setNav }) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [contact, setContact] = useState("");
  const [denominations, setDenominations] = useState([]);
  const [batchNumber, setBatchNumber] = useState([]);

  const [receivedCash, setReceivedCash] = useState([]);
  const [form, setForm] = useState("");
  const [showModal, setShowModal] = useState(false);

  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }
  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Cash Received",
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        setReceivedCash(response.data);
        console.log({ response });
      });
  }, []);

  function fetchDenominations(value) {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Cash Received",
          batchNumber: value,
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        setDenominations(response.data);
        // console.log({ fromss: response.data[0] });
      });
  }
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };
  let total = 0;
  let dTotal = 0;
  return (
    <>
      <div className="bg-white shadow py-2 ">
        <div className="flex justify-end px-2 mb-2">
          <ButtonComponent
            label={"Back"}
            buttonHeight={"30px"}
            buttonWidth={"10%"}
            onClick={() => {
              setNav("Main");
            }}
          />
        </div>
        <div
          className="px-3 py-1 mb-2 font-semibold"
          style={{
            background: "#daecfe",
          }}
        >
          CASH CONFIRMED
        </div>

        <div className="flex space-x-2 px-2">
          <div className="w-[55%] min-h-[250px] border-2 rounded py-3 px-1">
            <div className="mb-2  px-2 font-semibold">
              Cash Received from Vault
            </div>
            {/* <table className="w-full  bg-white rounded-sm   even:bg-slate-300  border-spacing-2 border border-gray-800">
              <thead>
                <tr
                  className="py-1 uppercase font-semibold "
                  style={{
                    background:
                      `url(` +
                      window.location.origin +
                      `/assets/images/background/` +
                      getTheme.theme.backgroundImage +
                      `)`,
                  }}
                >
                  <th className=" px-2 py-1 border border-gray-800">Sender</th>
                  <th className=" px-2 py-1 border border-gray-800">
                    Date Transferred
                  </th>
                  <th className=" px-2 py-1 border border-gray-800">
                    Amount Transferred
                  </th>
                  <th className=" px-2 py-1 border w-20 border-gray-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {receivedCash?.length ? (
                  <>
                    {receivedCash?.map((i, key) => {
                      total += i.amount;
                      return (
                        <tr
                          key={key}
                          className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-zinc-100   border border-gray-800`}
                        >
                          <td
                            // style={{
                            //   background: getTheme.theme.navBarColor,
                            // }}
                            className=" border border-gray-800  capitalize px-2 py-1"
                          >
                            {i?.sender}
                          </td>

                          <td className=" border border-gray-800 bg-[whitesmoke]  px-2 py-1">
                            {i?.transfer_date}
                          </td>
                          <td className=" border border-gray-800 text-right   px-2 py-1">
                            {i.amount === "null"
                              ? "0.00"
                              : formatNumber(i.amount)}
                          </td>
                          <td className=" border border-gray-800   px-2 py-1 flex justify-center">
                            <svg
                              onClick={() => fetchDenominations(i?.batchNumber)}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 stroke-orange-500 cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                              />
                            </svg>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className=" border border-gray-800   px-2 py-1">
                        &nbsp;
                      </td>
                      <td className=" border border-gray-800 font-semibold text-center   px-2 py-1">
                        Total
                      </td>
                      <td className="font-semibold border text-right bg-[whitesmoke] border-gray-800   px-2 py-1">
                       
                        {formatNumber(`${total}`)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={3} className="py-1 text-animate animate-pulse">
                      No cash received from vault ...
                    </td>
                  </tr>
                )}
              </tbody>
            </table> */}
            <CustomTable
              headers={[
                "Sender",
                "Date Transferred",
                "Amount Transferred",
                "Action",
              ]}
              data={receivedCash}
              style={{ columnFormat: [2] }}
              defaultMessage={"No Pending Cash Received"}
            />
          </div>
          <div className="w-[45%] min-h-[250px] py-3 border-2 rounded px-1">
            <div className="mb-2  px-2 font-semibold">
              Denomination Breakdown
            </div>
            {/* <table className="w-full  bg-white rounded-sm   even:bg-slate-300  border-spacing-2 border border-gray-800">
              <thead>
                <tr
                  className="py-1 uppercase font-semibold "
                  style={{
                    background:
                      `url(` +
                      window.location.origin +
                      `/assets/images/background/` +
                      getTheme.theme.backgroundImage +
                      `)`,
                  }}
                >
                  <th colSpan={2} className=" px-2 py-1 border border-gray-800">
                    Denomination
                  </th>
                  <th className=" px-2 py-1 border border-gray-800">Amount</th>
                  <th className=" px-2 py-1 border w-32 border-gray-800">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {denominations.length <= 0 ? (
                  <tr
                    className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-zinc-100  cursor-pointer border border-gray-800`}
                  >
                    <td
                      // style={{
                      //   background: getTheme.theme.navBarColor,
                      // }}
                      colSpan={4}
                      className=" border border-gray-800 text-center animate-pulse  capitalize px-2 py-4"
                    >
                      Pick an amount to show denomination breakdown
                    </td>
                  </tr>
                ) : (
                  <>
                    {denominations.map((i, key) => {
                      dTotal += i[3];
                      return (
                        <tr key={key}>
                          <td className=" border border-gray-800   px-2 py-1">
                            {i[0]}
                          </td>
                          <td className=" border border-gray-800   px-2 py-1">
                            {i[1]}
                          </td>
                          <td className=" border border-gray-800 text-right bg-[whitesmoke]   px-2 py-1">
                            {formatNumber(parseFloat(i[3]))}
                          </td>
                          <td className=" border border-gray-800 text-right  px-2 py-1">
                            {formatNumber(parseFloat(i[2])).replace(".00", "")}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className=" border border-gray-800   px-2 py-1">
                        &nbsp;
                      </td>
                      <td className=" border border-gray-800 font-semibold text-center   px-2 py-1">
                        Total
                      </td>
                      <td className="font-semibold border text-right bg-[whitesmoke] border-gray-800   px-2 py-1">
                        
                        {formatNumber(`${dTotal}`)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table> */}

            <CustomTable
              headers={["Denomination", "Amount", "Quantity"]}
              data={denominations}
              style={{ columnFormat: [2] }}
              defaultMessage={"Pick an amount to show denomination breakdown"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function CashS({ selectedCurrency, setNav }) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [contact, setContact] = useState("");
  const [denominations, setDenominations] = useState([]);
  const [batchNumber, setBatchNumber] = useState([]);

  const [transferredCash, setTransferredCash] = useState([]);
  const [form, setForm] = useState("");
  const [showModal, setShowModal] = useState(false);

  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }
  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Cash Sent",
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        const arr = [];
        response.data.map((i) => {
          const [a, b, c, d] = i;
          console.log(i, "kl");
          arr.push([
            a,
            b,
            c,
            <div className="flex justify-center">
              <span className="bg-[#e4c6a2aa] hover:border-orange-500 hover:border-2  rounded flex justify-center items-center w-[35px] h-[30px]">
                <svg
                  onClick={() => fetchDenominations(d)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 stroke-orange-500 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                  />
                </svg>
              </span>
            </div>,
          ]);
        });
        setTransferredCash(arr);
        console.log({ response });
      });
  }, []);

  function fetchDenominations(value) {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Cash Sent",
          batchNumber: value,
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        console.log(response, "kl");
        const arr = [];
        let dTotal = 0;
        response?.data?.map((i, index) => {
          const [a, b, c, d] = i;
          dTotal += c;
          arr.push([a, b, c, formatNumber(d).split(".")[0]]);
          if (index === response?.data?.length - 1) {
            arr.push([
              null,
              <div className="font-semibold">Total</div>,
              dTotal,
              null,
            ]);
          }
        });
        setDenominations(arr);
        // console.log({ response });
      });
  }
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  let total = 0;

  return (
    <>
      <div className="bg-white shadow py-2 ">
        <div className="flex justify-end px-2 mb-2">
          <ButtonComponent
            label={"Back"}
            buttonHeight={"30px"}
            buttonWidth={"10%"}
            onClick={() => {
              setNav("Main");
            }}
          />
        </div>
        <div
          className="px-3 py-1 mb-2 font-semibold"
          style={{
            background: "#daecfe",
          }}
        >
          CASH CONFIRMED
        </div>

        <div className="flex space-x-2 px-2">
          <div className="w-[55%] min-h-[250px] border-2 rounded py-3 px-1">
            <div className="mb-2  px-2 font-semibold">Cash Sent To Vault</div>
            {/* <table className="w-full  bg-white rounded-sm   even:bg-slate-300  border-spacing-2 border border-gray-800">
              <thead>
                <tr
                  className="py-1 uppercase font-semibold "
                  style={{
                    background:
                      `url(` +
                      window.location.origin +
                      `/assets/images/background/` +
                      getTheme.theme.backgroundImage +
                      `)`,
                  }}
                >
                  <th className=" px-2 py-1 border border-gray-800">
                    Receiver
                  </th>
                  <th className=" px-2 py-1 border  border-gray-800">
                    Date Transferred
                  </th>
                  <th className=" px-2 py-1 border border-gray-800">
                    Amount Transferred
                  </th>
                  <th className=" px-2 py-1 border w-20 border-gray-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {transferredCash?.length ? (
                  <>
                    {transferredCash?.map((i, key) => {
                      total += i.amount;
                      return (
                        <tr
                          key={key}
                          className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-zinc-100   border border-gray-800`}
                        >
                          <td
                            // style={{
                            //   background: getTheme.theme.navBarColor,
                            // }}
                            className=" border border-gray-800  capitalize px-2 py-1"
                          >
                            {i?.receiver}
                          </td>

                          <td className=" border border-gray-800   px-2 py-1">
                            {i?.transfer_date}
                          </td>
                          <td className=" border border-gray-800  bg-[whitesmoke] text-right  px-2 py-1">
                            {i.amount === "null"
                              ? "0.00"
                              : formatNumber(i.amount)}
                          </td>
                          <td className=" border border-gray-800   px-2 py-1 flex justify-center">
                            
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className=" border border-gray-800   px-2 py-1">
                        &nbsp;
                      </td>
                      <td className=" border border-gray-800 font-semibold text-center   px-2 py-1">
                        Total
                      </td>
                      <td className="font-semibold border text-right bg-[whitesmoke] border-gray-800   px-2 py-1">
                        
                        {formatNumber(`${total}`)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={3} className="py-1 text-center animate-pulse">
                      No Cash Sent to Vault ...
                    </td>
                  </tr>
                )}
              </tbody>
            </table> */}
            <CustomTable
              headers={[
                "Receiver",
                "Date Transferred",
                "Amount Transferred",
                "Action",
              ]}
              data={transferredCash}
              style={{ columnFormat: [3] }}
              defaultMessage={"No Pending Cash Sent"}
            />
          </div>
          <div className="w-[45%] min-h-[250px] py-3 border-2 rounded px-1">
            <div className="mb-2  px-2 font-semibold">
              Denomination Breakdown
            </div>
            {/* <table className="w-full  bg-white rounded-sm   even:bg-slate-300  border-spacing-2 border border-gray-800">
              <thead>
                <tr
                  className="py-1 uppercase font-semibold "
                  style={{
                    background:
                      `url(` +
                      window.location.origin +
                      `/assets/images/background/` +
                      getTheme.theme.backgroundImage +
                      `)`,
                  }}
                >
                  <th colSpan={2} className=" px-2 py-1 border border-gray-800">
                    Denomination
                  </th>
                  <th className=" px-2 py-1 border border-gray-800">Amount</th>
                  <th className=" px-2 py-1 border w-32 border-gray-800">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {denominations.length <= 0 ? (
                  <tr
                    className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-zinc-100  cursor-pointer border border-gray-800`}
                  >
                    <td
                      // style={{
                      //   background: getTheme.theme.navBarColor,
                      // }}
                      colSpan={4}
                      className=" border border-gray-800 text-center animate-pulse  capitalize px-2 py-4"
                    >
                      Pick an amount to show denomination breakdown
                    </td>
                  </tr>
                ) : (
                  //   <div>hjdj</div>
                  // )
                  <>
                    {denominations.map((i) => {
                      dTotal += i[3];
                      return (
                        <tr>
                          <td className=" border border-gray-800   px-2 py-1">
                            {i[0]}
                          </td>
                          <td className=" border border-gray-800   px-2 py-1">
                            {i[1]}
                          </td>
                          <td className=" border border-gray-800 text-right bg-[whitesmoke]   px-2 py-1">
                            {formatNumber(`${i[3]}`)}
                          </td>
                          <td className=" border border-gray-800  text-right  px-2 py-1">
                            {formatNumber(`${i[2]}`)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className=" border border-gray-800   px-2 py-1">
                        &nbsp;
                      </td>
                      <td className=" border border-gray-800 font-semibold text-center   px-2 py-1">
                        Total
                      </td>
                      <td className="font-semibold border text-right bg-[whitesmoke] border-gray-800   px-2 py-1">
                        
                        {formatNumber(`${dTotal}`)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table> */}
            <CustomTable
              headers={["Denomination ++ 2", "Amount", "Quantity"]}
              data={denominations}
              style={{ columnFormat: [3], columnAlignRight: [3, 4] }}
              defaultMessage={"Pick an amount to show denomination breakdown"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function UCashRequest({ selectedCurrency, setNav }) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [contact, setContact] = useState("");
  const [denominations, setDenominations] = useState([]);
  const [batchNumber, setBatchNumber] = useState([]);

  const [requestedCash, setRequestedCash] = useState([]);
  const [form, setForm] = useState("");
  const [showModal, setShowModal] = useState(false);

  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }
  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Ungranted Cash Request",
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        const arr = [];
        response.data.map((i) => {
          const [a, b, c] = i;
          // console.log(i, "kl");
          arr.push([
            a,
            b,
            c,
            <div className="flex justify-center">
              <span className="bg-[#e4c6a2aa] hover:border-orange-500 hover:border-2  rounded flex justify-center items-center w-[35px] h-[30px]">
                <svg
                  onClick={() => fetchDenominations(c)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 stroke-orange-500 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                  />
                </svg>
              </span>
            </div>,
          ]);
        });
        setRequestedCash(arr);
      });
  }, []);

  function fetchDenominations(value) {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          type: "Ungranted Cash Request",
          batchNumber: value,
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        console.log(response, "kl");
        const arr = [];
        let dTotal = 0;
        response?.data?.map((i, index) => {
          const [a, b, c] = i;
          dTotal += a * c;
          arr.push([a, b, a * c, formatNumber(c).split(".")[0]]);
          if (index === response?.data?.length - 1) {
            arr.push([null, "Total", dTotal, null]);
          }
        });
        setDenominations(arr);
        // console.log({ response });
      });
  }

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  return (
    <>
      <div className="bg-white shadow py-2 ">
        <div className="flex justify-end px-2 mb-2">
          <ButtonComponent
            label={"Back"}
            buttonHeight={"30px"}
            buttonWidth={"10%"}
            onClick={() => {
              setNav("Main");
            }}
          />
        </div>
        <div
          className="px-3 py-1 mb-2 font-semibold"
          style={{
            background: "#daecfe",
          }}
        >
          CASH PENDING
        </div>

        <div className="flex space-x-2 justify-center px-2">
          <div className="w-[55%]  rounded py-3 ">
            <div className="mb-2  px-2 font-semibold">
              Cash Request from Vault
            </div>

            <CustomTable
              headers={["Received By", "Amount", " Batch Number", "Action"]}
              data={requestedCash}
              style={{
                columnAlignRight: [2],
                columnAlignCenter: [3],
                columnFormat: [2],
              }}
            />
          </div>
          <div className="w-[45%] min-h-[250px] py-3 border-2 rounded px-1">
            <div className="mb-2  px-2 font-semibold">
              Denomination Breakdown
            </div>

            <CustomTable
              headers={["Denomination ++ 2", "Amount", "Quantity"]}
              data={denominations}
              style={{ columnFormat: [3], columnAlignRight: [3, 4] }}
              defaultMessage={"Pick an amount to show denomination breakdown"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
