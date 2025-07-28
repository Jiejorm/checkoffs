import React, { useState, useEffect } from "react";
import { GiReceiveMoney } from "react-icons/gi/index.esm";
// import "./components/vault-activities.css";

// import Label from "../../../components/others/Label/Label";
// import ButtonComponent from "../../../components/others/Button/ButtonComponent";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";

import ListOfValue from "../components/ListOfValue";
import InputField from "../components/inputField";
import { DatePicker, Result } from "antd";
import swal from "sweetalert";
import axios from "axios";
// import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
// import AccountSummary from "../../../components/others/AccountSummary";
// import { checkInternetConnection } from "../components/checkConnection";
import { API_SERVER } from "../../../../config/constant";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import CashLimit from "../components/CashLimit";
import Header from "../../../../components/others/Header/Header";
import Swal from "sweetalert2";
import SpecieCashToVault from "./components/SpecieCashToVault";

export default function VaultActivities({
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
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [page, setPage] = useState("");
  const [selected, setSelected] = useState("");

  const [currency, setCurrency] = useState("");
  const [extra, setExtra] = useState(0);

  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2 });
    return formatted;
  }

  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/vault-activities",
        {
          lov: true,
          branchCode: JSON.parse(localStorage.getItem("userInfo")).branchCode,
        },
        { headers }
      )
      .then((response) => {
        setCurrency(response.data);
        // setExtra();
      });
  }, []);

  useEffect(() => {
    if (nav === "Pending Cash In") {
      setPage(<PCashIn selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Main") {
      setPage(
        <Main
          selectedCurrency={selectedCurrency}
          setExtra={setExtra}
          setNav={setNav}
        />
      );
    } else if (nav === "Pending Cash Out") {
      setPage(<PCashOut selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Cash Received") {
      setPage(<CashR selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Cash Sent") {
      setPage(<CashS selectedCurrency={selectedCurrency} setNav={setNav} />);
    } else if (nav === "Cash Limit") {
      setPage(
        <CashLimit selectedCurrency={selectedCurrency} setNav={setNav} />
      );
    }
  }, [nav, selectedCurrency]);

  return (
    <>
      {/* ${!(nav === "Main") ? "" : "-mt-7"} */}
      <div className={``} style={{ zoom: "0.95" }}>
        <div className=" rounded h-auto  bg-gray-200 -mb-8">
          <div style={{ width: "100%" }} className=" ">
            <div className="md:w-[100%] rounded    md:mr-2 md:mb-0 ">
              <div className=" py-1 px-1  bg-white shadow-sm mb-2">
                <div className="border-2 p-2 rounded flex justify-center w-full">
                  <div className="w-1/2 space-y-2">
                    <InputField
                      label={"Username"}
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
                      required={true}
                      label={"Cash Account"}
                      labelWidth={"40%"}
                      inputWidth={"60%"}
                      data={currency}
                      value={selectedCurrency}
                      onChange={(value) => {
                        setSelectedCurrency(value);
                      }}
                    />
                    <InputField
                      label={"Current Cash Balance"}
                      labelWidth={"40%"}
                      inputWidth={"60%"}
                      disabled={true}
                      value={
                        extra?.current_cash_bal
                          ? formatNumber(parseFloat(extra?.current_cash_bal))
                          : ""
                      }
                    />
                    <InputField
                      label={"Opening Cash Balance"}
                      labelWidth={"40%"}
                      inputWidth={"60%"}
                      disabled={true}
                      value={
                        extra?.closing_cash_bal
                          ? formatNumber(parseFloat(extra?.closing_cash_bal))
                          : ""
                      }
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

function Main({ selectedCurrency, setNav, setExtra }) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [contact, setContact] = useState("");
  const [tillPosition, setTillPosition] = useState("");
  const [state, setState] = useState("");

  const [form, setForm] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const [total, setTotal] = useState("");
  // const total = [];
  let totals = 0;
  let curr_totals = 0;
  // function formatNumber(num) {
  //   if (num) {
  //     const formatted = parseFloat(num).toLocaleString("en-US", {
  //       minimumFractionDigits: 2,
  //     });

  //     return formatted;
  //   }
  // }

  function formatNumber(num) {
    if (num !== undefined && num !== null) {
      const formatted = parseFloat(num).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      });

      return formatted;
    } else {
      return "0.00";
    }
  }
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  console.log({ selectedCurrency }, "hereee");

  // console.log("from main", selectedCurrency);
  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/vault-activities",
        {
          fetchTill: true,
          isoCode: selectedCurrency.split("*")[0],
          // username: "PCOOMBER",
          // branchCode: "001",
          username: JSON.parse(localStorage.getItem("userInfo")).id,
          branchCode: JSON.parse(localStorage.getItem("userInfo")).branchCode,
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data, "reponse.data");
        setTillPosition(response.data);

        setExtra({
          current_cash_bal: selectedCurrency.split("*")[1],
          closing_cash_bal: selectedCurrency.split("*")[2],
        });
        console.log({ response });
      });
  }, [selectedCurrency]);

  console.log(tillPosition.till ? tillPosition.till[3] : null, "aa");
  return (
    <>
      <div className={`bg-white py-2 px-2 ${showModal ? "hidden" : ""}`}>
        <div className="flex  w-full items-center mb-2">
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
          <CustomModal
            setShowModal={setShowModal}
            showModal={showModal}
            form={form}
            setForm={setForm}
          />
        </div>

        <hr className="mb-[10px] mt-0 my-1" />
        {/* <div
          className="px-3 py-1 mb-2 font-semibold"
          style={{
            background: getTheme.theme.navBarColor,
          }}
        >
          VAULT POSITION
        </div> */}

        <div className="mb-2">
          <Header title={"VAULT POSITION"} headerShade={true} />
        </div>

        <div className="flex space-x-2">
          <div
            className="w-[65%] border-2 rounded  derrick"
            style={{
              position: "relative",
              height: "55vh",
              overflowY: "scroll",
            }}
          >
            <table
              style={{ zoom: "0.85" }}
              className="w-full  bg-white rounded-sm   even:bg-slate-300  border-spacing-2  border-2"
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  width: "",
                  padding: "",
                  background: "",
                }}
              >
                {/* style={{ background: "red" }} */}
                <tr
                  className=""
                  style={{
                    borderBottom: "3px solid white",
                    width: "",
                    background: "pink",
                    padding: "30px",
                  }}
                  colSpan={6}
                >
                  {/* border border-b-black */}

                  {/* style={{ background: "red" }} */}
                  <td
                    colSpan={4}
                    className="py-1 uppercase text-center border text-white  border-r-5 font-semibold"
                    style={{ background: "#0580c0" }}

                    // style={{ background: "blue" }}
                  >
                    Opening Vault Balance
                  </td>
                  <td
                    colSpan={2}
                    className="py-1 uppercase text-center border  bg-green-300  text-black font-semibold"
                    // style={{ background: "#daecfe" }}
                    // style={{ background: "#0580c0" }}
                  >
                    Current Vault Balance
                  </td>
                </tr>
                <tr
                  className="py-1 uppercase font-semibold  "
                  style={{
                    // background:
                    //   `url(` +
                    //   window.location.origin +
                    //   `/assets/images/background/` +
                    //   getTheme.theme.backgroundImage +
                    //   `)`,

                    borderBottom: "3px solid lightgrey",
                    // position:"sticky"
                  }}
                >
                  <th
                    style={{ background: "#0580c0" }}
                    colSpan={2}
                    className=" px-2 py-1  border-2 text-white"
                  >
                    Denomination
                  </th>
                  <th
                    style={{ background: "#0580c0" }}
                    className=" px-2 py-1  border-2 text-white"
                  >
                    Amount
                  </th>
                  <th
                    className=" px-2 py-1  w-32 border-2 text-white"
                    style={{ background: "#0580c0" }}
                    // style={{ borderRight: "3px solid lightgrey" }}
                  >
                    Quantity
                  </th>
                  <th className=" px-2 py-1 text-black border-2 bg-green-300">
                    Amount
                  </th>
                  <th className=" px-2 py-1 text-black  w-32 border-2 bg-green-300">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {tillPosition?.denominations?.map((i, key) => {
                  totals = totals + i.amount;
                  curr_totals = curr_totals + i.curr_amt;
                  // total.push(totals);
                  console.log(
                    { totals },
                    tillPosition.denominations.length - 1,
                    key
                  );

                  return (
                    <>
                      <tr
                        key={key}
                        className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-zinc-100  cursor-pointer  border-2 `}
                      >
                        <td
                          // style={{
                          //   background: getTheme.theme.navBarColor,
                          // }}
                          className="border-t border-b  capitalize px-2 py-1"
                        >
                          {i.denomination_code === "null"
                            ? "0.00"
                            : i.denomination_code}
                        </td>
                        <td className="  border-t border-b   px-2 py-1">
                          {i.denomination_desc}
                        </td>
                        <td className="  border-t border-b bg-[whitesmoke] text-right  px-2 py-1">
                          {i.amount === 0 ? "0.00" : formatNumber(i.amount)}
                        </td>
                        <td
                          className="  border-t border-b   px-2 py-1 text-right"
                          style={{ borderRight: "3px solid lightgrey" }}
                        >
                          {i.denomination_qty === 0
                            ? "0"
                            : `${formatNumber(i.denomination_qty)}`.replace(
                                ".00",
                                ""
                              )}
                        </td>
                        <td className="  border-t border-b bg-[whitesmoke] text-right  px-2 py-1">
                          {i.curr_amt === 0 ? "0.00" : formatNumber(i.curr_amt)}
                        </td>
                        <td className="  border-t border-b   px-2 py-1 text-right">
                          {i.curr_qty === 0
                            ? "0"
                            : `${formatNumber(i.curr_qty)}`.replace(".00", "")}
                        </td>
                      </tr>
                    </>
                  );
                })}
                <tr>
                  <td className="  border-t border-b   px-2 py-1">&nbsp;</td>
                  <td className="  border-t border-b font-semibold text-center   px-2 py-1">
                    Total
                  </td>
                  <td className="font-semibold  bg-[whitesmoke] border-t border-b text-right  px-2 py-1">
                    {/* {total[total.length - 1]} */}
                    {formatNumber(`${totals}`)}
                  </td>
                  <td
                    className="border-r-5 px-2 py-1"
                    style={{ borderRight: "3px solid lightgrey" }}
                  >
                    &nbsp;
                  </td>
                  <td className="font-semibold  bg-[whitesmoke] border-t border-b text-right  px-2 py-1">
                    {/* {total[total.length - 1]} */}
                    {formatNumber(`${curr_totals}`)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-[35%] border-t border-b rounded p-1">
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
                <div className="mb-2 text-red-500 font-semibold">
                  Unapproved Cash
                </div>
                <div className="flex space-x-2 rounded mb-2">
                  <InputField
                    label={"Pending Cash In"}
                    labelWidth={"48%"}
                    inputWidth={"52%"}
                    disabled={true}
                    textAlign={"right"}
                    value={formatNumber(
                      tillPosition.till?.length > 0
                        ? tillPosition.till[0]
                        : null
                    )}
                    // onChange={(e) => {
                    //   setTillPosition((prev) => ({
                    //     ...prev,
                    //     till: {
                    //       pending_cash_in: e.target.value,
                    //     },
                    //   }));
                    // }}
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
                      // formatNumber(
                      tillPosition.till?.length > 0
                        ? tillPosition.till[1]
                        : null
                      // )
                    )}
                    // onChange={(e) => {
                    //   setTillPosition((prev) => ({
                    //     ...prev,
                    //     till: {
                    //       pending_cash_out: e.target.value,
                    //     },
                    //   }));
                    // }}
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
              </div>
              <div className="mt-2">
                <div className="mb-2 text-green-500 font-semibold">
                  Approved Cash{" "}
                </div>
                <div className="flex space-x-2 rounded mb-2">
                  <InputField
                    label={"Cash Received"}
                    labelWidth={"48%"}
                    inputWidth={"52%"}
                    disabled={true}
                    textAlign={"right"}
                    value={formatNumber(
                      tillPosition.till?.length > 0
                        ? tillPosition.till[2]
                        : null
                    )}
                    // onChange={(e) => {
                    //   setTillPosition((prev) => ({
                    //     ...prev,
                    //     till: {
                    //       cash_received: e.target.value,
                    //     },
                    //   }));
                    // }}
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
                      tillPosition.till?.length > 0
                        ? tillPosition.till[3]
                        : tillPosition.till?.length > 0 &&
                          tillPosition.till[3] === 0
                        ? "0.00"
                        : null
                    )}
                    // onChange={(e) => {
                    //   setTillPosition((prev) => ({
                    //     ...prev,
                    //     till: {
                    //       cash_sent: e.target.value,
                    //     },
                    //   }));
                    // }}
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
      <div className="  px-2 mt-2 w-full flex justify-start">
        <div className="flex space-x-3 w-[80%]">
          <ButtonComponent
            onClick={() => {
              setForm("Cash Movement Outward");
              setShowModal(true);
            }}
            label="Cash Movement Outward"
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
        </div>
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
  const [batchNumber, setBatchNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [requestedCash, setRequestedCash] = useState([]);
  const [requestedCash2, setRequestedCash2] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [form, setForm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [batchNumberValidator, setBatchNumberValidator] = useState("");
  const [showReceiveForm, setShowReceiveForm] = useState(false);

  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }

  // get error message
  useEffect(() => {
    // const [err1] = Promise.all([])
    const errorMsg = axios.post(
      API_SERVER + "/api/get-error-message",
      { code: "05847" },
      { headers }
    );
    errorMsg.then((response) => {
      setErrorMsg(response.data);
      console.log(response, "error");
    });
  }, []);

  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/vault-activities",
        {
          type: "Pending Cash In",
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
          date: "",
          branch: JSON.parse(localStorage.getItem("userInfo"))?.branchCode,
        },
        { headers }
      )
      .then((response) => {
        console.log(response, "jjj");
        const arr = [];
        response.data?.teller?.map((i) => {
          const [a, b, c] = i;
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

        const arr2 = [];
        response.data?.specie?.map((i) => {
          const [a, b, c, d, e] = i;
          arr2.push([
            a,
            b,
            c,
            d,
            <div className="flex justify-center">
              <span className="bg-[#e4c6a2aa] hover:border-orange-500 hover:border-2  rounded flex justify-center items-center w-[35px] h-[30px]">
                <svg
                  onClick={() => fetchDenominations(e, d)}
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
        setRequestedCash2(arr2);
      });
  }, [refresh]);
  // console.log(batchNumber, "llllll");

  function fetchDenominations(value, value2) {
    let arrd = [];
    setBatchNumber(value);
    setBatchNumberValidator(value2);

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

  function CashConfirmation() {
    axios
      .post(
        API_SERVER + "/api/post_prc_teller_cash_confirmation",
        {
          batchNumber: batchNumber,
          // batchNumber:"2023211111115555",
          branch: JSON.parse(localStorage.getItem("userInfo"))?.branchCode,
        },
        { headers }
      )
      .then((response) => {
        if (response.data.responseCode == "000") {
          Swal.fire({
            text: response.data.message,
            icon: "success",
          });
          setRefresh(!refresh);
          setDenominations([]);
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
        console.log(batchNumber + "1", "respppppppppp");
      });
  }

  // accept function for the procedure
  const acceptFunction = () => {
    const acceptProcedure = axios.post(
      API_SERVER + "/api/vault-activities",
      {
        type: "Pending Cash In",
        batchNumber: batchNumber,
        procedureType: "accept",
        branch: JSON.parse(localStorage.getItem("userInfo"))?.branchCode,
      },
      { headers }
    );
    acceptProcedure.then((response) => {
      Swal.fire({
        icon: "success",
        text: response?.data,
      });
      setDenominations([]);
      setRefresh(!refresh);
      console.log(response, "feelings");
    });
  };

  const rejectFunction = () => {
    const rejectProcedure = axios.post(
      API_SERVER + "/api/vault-activities",
      {
        type: "Pending Cash In",
        batchNumber: batchNumber,
        procedureType: "reject",
      },
      { headers }
    );
    rejectProcedure
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: response?.data,
        });
        setDenominations([]);
        setRefresh(!refresh);
        console.log(response, "feelings");
      })
      .catch((e) => {
        // console.log()
        Swal.fire({
          icon: "error",
          text: e.toString(),
        });
      });
  };
  // receive function
  const receiveFunction = () => {
    if (batchNumberValidator === "Pending Mgr Approval") {
      Swal.fire({
        text: errorMsg,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    } else {
      setShowReceiveForm(true);
    }
  };

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
        <div className="px-3 mx-2 py-1 mb-2 font-semibold bg-[#0580c0] text-white">
          CASH PENDING
        </div>

        <div className="flex space-x-2 px-2">
          <div className="w-[55%] border-2 rounded py-2 px-1 min-h-[250px]">
            <div className="mb-4 w-full">
              <div className="mb-1 bg-[#daecfe] text-gray-600 px-2 py-2 font-semibold">
                TELLER CASH TO VAULT
              </div>
              <CustomTable
                headers={["Posted By", "Amount", "Batch Number", "Action"]}
                data={requestedCash}
                style={{ columnFormat: [2], columnAlignRight: [2] }}
                defaultMessage={"No pending Cash in"}
              />
            </div>
            <div className="mb-4 w-full">
              <div className="mb-1 bg-[#daecfe] text-gray-600 px-2 py-2 font-semibold">
                EXTERNAL CASH TO VAULT
              </div>
              <CustomTable
                headers={[
                  "Posted By",
                  "Document Ref",
                  "Amount",
                  "Batch Number",
                  "Action",
                ]}
                data={requestedCash2}
                style={{ columnFormat: [3], columnAlignRight: [3] }}
                defaultMessage={"No pending Cash in"}
                rowsPerPage={5}
              />
            </div>
          </div>
          <div className="w-[45%] min-h-[250px] py-2 border-2 rounded px-1 relative">
            <div className="mb-1 bg-[#daecfe] text-gray-600 px-2 py-2 font-semibold">
              DENOMINATION BREAKDOWN
            </div>
            <CustomTable
              headers={["Denomination ++ 2", "Amount", "Quantity"]}
              data={denominations}
              style={{ columnFormat: [3], columnAlignRight: [3, 4] }}
              defaultMessage={"Pick an amount to show denomination breakdown"}
            />
            {requestedCash.length > 0 && denominations.length > 0 ? (
              <div className="flex justify-end w-full">
                <div className="flex space-x-2 w-full justify-end">
                  <ButtonComponent
                    label={"Accept"}
                    buttonWidth={"20%"}
                    buttonHeight={"30px"}
                    onClick={acceptFunction}
                  />
                  <ButtonComponent
                    label={"Reject"}
                    buttonWidth={"20%"}
                    buttonHeight={"30px"}
                    onClick={rejectFunction}
                  />
                </div>
              </div>
            ) : requestedCash2.length > 0 && denominations.length > 0 ? (
              <div className="flex justify-end w-full">
                <div className="flex space-x-2 w-full justify-end">
                  <ButtonComponent
                    label={"Receive"}
                    buttonWidth={"20%"}
                    buttonHeight={"30px"}
                    onClick={receiveFunction}
                  />
                </div>
              </div>
            ) : (
              " "
            )}

            {/* show receive  form   */}
            {showReceiveForm && (
              <SpecieCashToVault
                opened={showReceiveForm}
                handleClose={() => setShowReceiveForm(false)}
                batchNumber={batchNumber}
              />
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
  const [refetch, setRefetch] = useState(false);

  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }
  const handleRejectTelReq = async (batchNumber) => {
    const res = await Swal.fire({
      icon: "question",
      text: "Are you sure want to reject this transfer?",
    });
    if (res?.isConfirmed) {
      const response = await axios.post(
        API_SERVER + "/api/vault-activities",
        {
          type: "Pending Cash Out",
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
          subType: "rejectTellerRequest",
          batchNumber,
        },
        { headers }
      );

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          text: response?.data?.message,
          allowOutsideClick: false,
        }).then((res) => {
          if (res?.isConfirmed) setRefetch(!refetch);
        });
      }
    }
  };

  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/vault-activities",
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
            <div className="flex justify-center space-x-3">
              <div
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                onClick={() => {
                  handleRejectTelReq(c);
                }}
              >
                Reject
              </div>
              <div className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors">
                Grant
              </div>
              {/* <span className="bg-[#e4c6a2aa] hover:border-orange-500 hover:border-2  rounded flex justify-center items-center w-[35px] h-[30px]">
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
              </span> */}
            </div>,
          ]);
        });
        // console.log({ response });
        setTransferredCash(arr);
      });
  }, [refetch]);

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

            <CustomTable
              headers={["Received By", "Amount", "Batch Number", "Action"]}
              data={transferredCash}
              style={{
                columnFormat: [2],
                columnAlignRight: [2],
                columnAlignCenter: [3],
              }}
              defaultMessage={"No Pending Cash Out"}
            />
          </div>
          <div className="w-[45%] min-h-[250px] py-3 border-2 rounded px-1">
            <div className="mb-2  px-2 font-semibold uppercase">
              Denomination Breakdown
            </div>

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
        API_SERVER + "/api/vault-activities",
        {
          type: "Cash Received",
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        const arr = response?.data?.map((i) => [
          i[0],
          i[1],
          i[2],
          <div className="flex justify-center">
            <span className="bg-[#e4c6a2aa] hover:border-orange-500 hover:border-2  rounded flex justify-center items-center w-[35px] h-[30px]">
              <svg
                onClick={() => fetchDenominations(i[3])}
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
          // <button
          //   onClick={() => {
          //     fetchDenominations(i[3]);
          //   }}
          // >

          // </button>,
        ]);

        setReceivedCash(arr);
        console.log({ response });
        // alert("See me");c
      });
  }, []);

  function fetchDenominations(value) {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          key: "vault",
          type: "Cash Received",
          batchNumber: value,
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers }
      )
      .then((response) => {
        setDenominations(response.data);
        console.log({ fromss: response.data[0] });
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
            background: getTheme.theme.navBarColor,
          }}
        >
          CASH PENDING
        </div>

        <div className="flex space-x-2 px-2">
          <div className="w-[55%] min-h-[250px] border-2 rounded py-3 px-1">
            <div className="mb-2  px-2 font-semibold">
              Cash Received from Teller
            </div>

            <CustomTable
              headers={[
                "Sender",
                "Date Transferred",
                "Amount Transferred",
                "Action",
              ]}
              data={receivedCash}
              style={{
                columnFormat: [3],
                columnAlignRight: [3],
                columnAlignCenter: [2],
              }}
              defaultMessage={"No Pending Cash Received"}
            />
          </div>
          <div className="w-[45%] min-h-[250px] py-3 border-2 rounded px-1">
            <div className="mb-2  px-2 font-semibold">
              Denomination Breakdown
            </div>

            <CustomTable
              headers={["Denomination ++2", "Amount", "Quantity"]}
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
        API_SERVER + "/api/vault-activities",
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
        console.log("risk", response);
        const arr = [];
        let dTotal = 0;
        response?.data?.map((i, index) => {
          const [a, b, c, d] = i;
          dTotal += c;
          arr.push([a, b, c, formatNumber(d).split(".")[0]]);
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
              style={{ columnFormat: [3] }}
              defaultMessage={"Pick an amount to show denomination breakdown"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
