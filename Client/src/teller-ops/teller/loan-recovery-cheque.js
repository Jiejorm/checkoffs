import React, { useState, useEffect, useRef } from "react";
import { GiReceiveMoney } from "react-icons/gi/index.esm";
import ListOfValue from "../components/ListOfValue";

import InputField from "../components/inputField";
import Label from "../../../../components/others/Label/Label";
import SelectField from "../components/SelectField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
// import TextAreaField from "./components/TextArea";
import AccountSummary from "../../../../components/others/AccountSummary";
import { checkInternetConnection } from "../components/checkConnection";
import FindBy from "../components/Modal";
import { API_SERVER } from "../../../../config/constant";
import axios from "axios";
import ThirdPartyModalX from "../components/ThirdPartyModal";
import Denominations from "../components/Denominations";
import { headers } from "../../../../App";
import { Modal } from "@mantine/core";
// import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";
import Swal from "sweetalert2";
import Phone_number from "../components/Phone_number";
function LoanRecoveryCheque({
  setSigVer,
  handleSubmit,
  formData,
  setFormData,
  setBatchNo,
  body,
  checked,
  setActiveAccountNumber,
  batchNo,
  setDenominationEntries,
  setChecked,
  setThirdPartyEntries,
}) {
  const [response, setResponse] = useState("");
  const [inWords, setInWords] = useState("");
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumberChange, setAccountNumberChange] = useState("");
  const [selectedSourceOfFund, setSelectedSourceOfFund] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [noAc, setNoAc] = useState(false);
  const [amount, setAmount] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("LOAN RECOVERY - CHEQUE");
  const [narration2, setNarration2] = useState("");
  const [withdrawalBy, setWithdrawalBy] = useState("");
  const [contact, setContact] = useState("");
  const [isThirdParty, setisThirdParty] = useState(false);
  const [accountDetails, setAccountDetails] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [inWord, setInWord] = useState("");
  const [sourceOfFund, setSourceOfFund] = useState("");
  const [ThirdPartyModal, setThirdPartyModal] = useState(false);
  const [denomination, setDenomination] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [validate, setValidate] = useState(false);
  const [validateResponse, setValidateResponse] = useState(false);
  const [prevAmount, setPrevAmount] = useState("");
  const [dummy, setDummy] = useState(false);
  const thirdPartyRef = useRef(null);
  const voucherRef = useRef(null);
  const inputRef = useRef(null);

  const dates = new Date(
    JSON.parse(localStorage.getItem("userInfo"))?.postingDate
  );
  const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
  const day = dates.getDate();
  const year = dates.getFullYear();

  const eDate = new Date(
    JSON.parse(localStorage.getItem("userInfo"))?.postingDate
  );
  const value_date = eDate
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "/");

  useEffect(() => {
    // format(8494849);
    setFormData({
      accountNumber,
      valueDate: value_date,
      amount: amount.replaceAll(",", ""),
      reference,
      ThirdPartyModal: isThirdParty ? "Yes" : "No",
      isThirdParty,
      narration,
      withdrawalBy,
      contact: contact ? contact : "233504880391",
      narration2,
      accountName,
      ledgerBalance: accountDetails?.ledger_balance,
      availableBalance: accountDetails?.available_balance,
      selectedSourceOfFund,
      memberId: accountDetails?.customer_number,
      accountName,
    });
  }, [
    narration,
    withdrawalBy,
    amount,
    reference,
    isThirdParty,
    narration,
    withdrawalBy,
    contact,
    narration2,
    accountDetails,
    accountName,
    selectedSourceOfFund,
  ]);

  useEffect(() => {
    document.getElementById("accountNumber")?.focus();
    const getSourceofFund = () => {
      axios
        .post(
          API_SERVER + "/api/get-code-details",
          {
            code: "SOF",
          },
          { headers }
        )
        .then(function (response) {
          console.log({ response });
          setSourceOfFund(response.data);
        });
    };
    getSourceofFund();
  }, []);

  useEffect(() => {
    setActiveAccountNumber("");
    setAccountNumber("");
    setSelectedSourceOfFund("");
    setAccountNumberChange("");
    setInWord("");
    setAmount("");
    setReference("");
    setisThirdParty(false);
    setNarration("LOAN RECOVERY - CHEQUE");
    setNarration2("");
    setWithdrawalBy("");
    setContact("");
    setOtherInfo("");
    setAccountName("");
    setSuccess(false);
    setPrevAmount("");
    document.getElementById("accountNumber").focus();
  }, [checked]);

  useEffect(() => {
    if (accountDetails) {
      if (accountDetails.summary?.length > 0) {
        setAccountName(accountDetails?.summary[0]?.account_name);

        setSigVer(true);

        document.getElementById("Amount").focus();
      }
      console.log("ghanaaa", accountDetails.message);
      if (accountDetails.message) {
        console.log("togo", accountDetails.message);
        setShowMessage(true);

        // Swal.fire({
        //   title: "ACCOUNT MESSAGE",
        //   html: `${accountDetails?.message?.map(
        //     (i, key) =>
        //       `  <div class=" shadow-sm text-sm justify-start flex items-center space-x-2 rounded  px-2 py-1 mb-2">
        //         <svg
        //           xmlns="http://www.w3.org/2000/svg"
        //           fill="none"
        //           viewBox="0 0 24 24"
        //           strokeWidth={1.5}
        //           stroke="currentColor"
        //           class="w-7 h-7 stroke-green-500"
        //         >
        //           <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        //           />
        //         </svg>
        //         <div>${i}</div>
        //       </div>`
        //   )}`,
        // }).then((result) => {
        //   /* Read more about isConfirmed, isDenied below */
        //   if (result.isConfirmed) {
        //     document.getElementById("Amount")?.focus();
        //   }
        // });
        // setShowMessage(true);
      }
    }
  }, [accountDetails]);

  function onKeyPress(e) {
    e.persist();
    checkInternetConnection();

    // setAccountNumberChange(e.target.value);
    axios
      .post(
        API_SERVER + "/api/getBalance",
        {
          accountNumber: accountNumber,
        },
        { headers }
      )
      .then(async (response) => {
        let data = response.data[0];

        if (data === undefined) {
          const response = await axios.post(
            API_SERVER + "/api/get-error-message",
            { code: "01330" },
            { headers }
          );
          // console.log({ kilik: response });
          console.log();
          swal({
            text: response.data,
            icon: "warning",
            buttons: "OK",
            dangerMode: true,
          }).then((result) => {
            if (result) {
              var input = document.getElementById("accountNumber");
              input.focus();
              setAccountName("");
              setAccountNumberChange("");
            }
          });
        } else {
          // switchFocus(e, "Amount");
          // var input = document.getElementById("Amount");
          // input.focus();
          setAccountNumberChange(e.target.value);
        }
      });
  }

  function onAccountNumberChange(e) {
    setAccountNumber(e.target.value);
    setActiveAccountNumber(e.target.value);
  }

  function onReference(e) {
    setReference(e.target.value);
  }

  function switchFocus(e, nextFieldId) {
    if (e.key === "Enter") {
      document.getElementById(nextFieldId).focus();
    }
  }

  function handleSelected(value) {
    setAccountNumberChange(value);
    setAccountNumber(value);
    setActiveAccountNumber(value);
    // switchFocus(e, "Amount");

    // console.log(document.getElementById("Amount"), "ghanaX");
    setShowModal(false);
  }

  function onNarrationChange(e) {
    setNarration(e.target.value);
    // setFormData((prev) => ({ ...prev, narration: narration }));
  }

  function onNarration2Change(e) {
    setNarration2(e.target.value);
    // setFormData((prev) => ({ ...prev, narration: narration }));
  }

  useEffect(() => {
    if (showMessage) {
      Swal.fire({
        title: "<div class='text-[17px] font-semibold'>Account Message</div>",
        html: generateAccountMessageHtml(accountDetails?.message),
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          setShowMessage(false);
          document.getElementById("Amount")?.focus();
        }
      });

      function generateAccountMessageHtml(messages) {
        if (!messages || messages.length === 0) {
          return "<p>No messages to display.</p>";
        }

        return messages
          .map(
            (message) => `
              <div class="text-sm shadow-sm flex items-center space-x-2 rounded px-2 py-1 mb-2">
              <svg
               xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
               stroke="currentColor"
               class="w-6 h-6 stroke-green-500"
              >
               <path
                 strokeLinecap="round"
      strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
             </svg>
                <div class="">${message}</div>
              </div>
            `
          )
          .join("");
      }
    }
  }, [showMessage]);

  useEffect(() => {
    if (validate) {
      Swal.fire({
        allowOutsideClick: false,
        showDenyButton: true,
        denyButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Proceed",
        denyButtonText: "Cancel",

        title: `<div class="text-[17px]">Account Validation</div>`,
        html: ` <div class="text-sm">${validateResponse}</div>`,
      }).then((result) => {
        if (result.isConfirmed) {
          setValidate(false);
          setChecked(!checked);
          document.getElementById("accountNumber").focus();
        } else if (result.isDenied) {
          setAmount("");
        }
      });
    }
  }, [validate]);
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        document.getElementById("voucherRef").focus();
      }, 500);
    }
  }, [success]);

  // console.log({ validate });
  console.log({ validate, success, amount, prevAmount, noAc });
  useEffect(() => {
    if (denomination === true) {
      // setSuccess(false);
      setPrevAmount(amount);
    }
  }, [denomination]);

  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2 });
    return formatted;
  }

  function onAmountChange(e) {
    const inputValue = e.target.value;
    if (!inputValue || /^\d*\.?\d*$/.test(inputValue)) {
      setAmount(inputValue);
    } else {
      setAmount(inputValue.replaceAll(",", ""));
    }
  }
  function AccountMessage() {
    return (
      <div
        className="border-4 rounded  bg-[#ffffffbc] backdrop-filter backdrop-blur-sm"
        style={{ zoom: "85%" }}
      >
        <div className="font-semibold border-b-2 flex justify-between uppercase py-2 px-1  text-gray-800">
          <div>Account Message</div>
          <svg
            onClick={(e) => {
              setShowMessage(false);
              // switchFocus(e, "Amount");
              document.getElementById("Amount")?.focus();
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 stroke-red-500 font-bold"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="p-2   text-gray-800  ">
          <div className="flex font-semibold space-x-3 items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 stroke-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <div>Please Note :</div>
          </div>

          {accountDetails?.message?.map((i, key) => (
            <div className="bg-[#d1d1d1] shadow-sm flex items-center space-x-2 rounded  px-2 py-1 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 stroke-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>{i}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  function AccountValidate() {
    return (
      <div
        className="border-4 rounded  bg-[#ffffffbc] backdrop-filter backdrop-blur-sm"
        style={{ zoom: "85%" }}
      >
        <div className="font-semibold border-b-2 flex justify-between uppercase py-2 px-1  text-gray-800">
          <div>Account Validation</div>
          <svg
            onClick={() => {
              setValidate(false);
              setChecked(!checked);
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 stroke-red-500 font-bold"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="p-2   text-gray-800  ">
          <div className="flex font-semibold space-x-3 items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 stroke-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <div>Please Note :</div>
          </div>

          <div className="bg-[#d1d1d1] shadow-sm flex items-center space-x-2 rounded  px-2 py-1 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 stroke-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>{validateResponse}</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Denominations
        showModal={denomination}
        setShowModal={setDenomination}
        amount={amount}
        setSuccess={setSuccess}
        prevAmount={prevAmount}
        setPrevAmount={setPrevAmount}
        setDenominationEntries={setDenominationEntries}
        checked={checked}
        setAmount={setAmount}
        currency_code={
          accountDetails.summary?.length > 0
            ? accountDetails?.summary[0]?.currency_code
            : null
        }
      />

      <ThirdPartyModalX
        batchNo={batchNo}
        setContact={setContact}
        showModal={ThirdPartyModal}
        setShowModal={setThirdPartyModal}
        setisThirdParty={setisThirdParty}
        isThirdParty={isThirdParty}
        setThirdPartyEntries={setThirdPartyEntries}
      />

      <div className="">
        <div className=" rounded h-auto pb-2 pt-2 px-2 -mb-8  bg-white ">
          <div
            style={{
              background: "#daecfe",
            }}
            className=" uppercase py-1 px-3 mb-2 font-bold text-gray-800 "
          >
            Loan Recovery - Cheque
          </div>
          <div
            style={{ width: "100%" }}
            className="wrapper  rounded  md:flex border-2"
          >
            {/**Right Section */}
            <div className="md:w-[65%] rounded py-2 px-3     md:mr-2 md:mb-0 first  ">
              <div className="mb-2">
                <ListOfValue
                  id={"sourceOfFunds"}
                  label={"Customer Number"}
                  labelWidth={"18%"}
                  inputWidth={"70%"}
                  data={sourceOfFund}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      setTimeout(() => {
                        if (thirdPartyRef.current) {
                          thirdPartyRef.current.focus();
                        }
                      }, 0);
                      // if (thirdPartyRef.current) {
                      //   thirdPartyRef.current.focus();
                      // }
                    }
                  }}
                  onChange={(value) => {
                    setTimeout(() => {
                      if (thirdPartyRef.current) {
                        thirdPartyRef.current.focus();
                      }
                    }, 0);

                    // if (value && thirdPartyRef.current) {
                    //   thirdPartyRef.current.focus();
                    // }
                    setSelectedSourceOfFund(value);
                  }}
                  value={selectedSourceOfFund}
                />
              </div>
              <div className="mb-2">
                <ListOfValue
                  id={"sourceOfFunds"}
                  label={"Facilty Number"}
                  labelWidth={"18%"}
                  inputWidth={"70%"}
                  data={sourceOfFund}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      setTimeout(() => {
                        if (thirdPartyRef.current) {
                          thirdPartyRef.current.focus();
                        }
                      }, 0);
                      // if (thirdPartyRef.current) {
                      //   thirdPartyRef.current.focus();
                      // }
                    }
                  }}
                  onChange={(value) => {
                    setTimeout(() => {
                      if (thirdPartyRef.current) {
                        thirdPartyRef.current.focus();
                      }
                    }, 0);

                    // if (value && thirdPartyRef.current) {
                    //   thirdPartyRef.current.focus();
                    // }
                    setSelectedSourceOfFund(value);
                  }}
                  value={selectedSourceOfFund}
                />
              </div>
              <div className="w-[100%]">
                <InputField
                  label={"Repayment Account"}
                  labelWidth={"18%"}
                  inputWidth={"70%"}
                  disabled={true}
                  name={"accountName"}
                  value={accountName}
                  // setFormData={setFormData}
                  // onChange={(e) => handleChange(e, "amount")}
                />
              </div>
              <div className="flex mt-2">
                <div className="space-y-2 w-1/2">
                  <div className="w-[100%]">
                    <InputField
                      label={"Amount Granted"}
                      labelWidth={"36%"}
                      inputWidth={"50%"}
                      disabled={true}
                      name={"accountName"}
                      value={accountName}
                      // setFormData={setFormData}
                      // onChange={(e) => handleChange(e, "amount")}
                    />
                  </div>
                  <div className="w-[100%]">
                    <InputField
                      label={"Total Recovered"}
                      labelWidth={"36%"}
                      inputWidth={"50%"}
                      disabled={true}
                      name={"accountName"}
                      value={accountName}
                      // setFormData={setFormData}
                      // onChange={(e) => handleChange(e, "amount")}
                    />
                  </div>
                </div>
                <div className="space-y-2 w-1/2">
                  <div className="w-[100%]">
                    <InputField
                      label={"Write-Off Amount"}
                      labelWidth={"26%"}
                      inputWidth={"50%"}
                      disabled={true}
                      name={"accountName"}
                      value={accountName}
                      // setFormData={setFormData}
                      // onChange={(e) => handleChange(e, "amount")}
                    />
                  </div>
                  <div className="w-[100%]">
                    <InputField
                      id={"accountNumber"}
                      label={"Unrecovered"}
                      labelWidth={"26%"}
                      inputWidth={"50%"}
                      disabled={true}
                      name={"accountName"}
                      value={accountName}
                      // setFormData={setFormData}
                      // onChange={(e) => handleChange(e, "amount")}
                    />
                  </div>
                </div>
              </div>
              <hr className="my-4" />

              {/* <div className="w-[65%] mb-2  flex items-center">
                  <InputField
                    label={"Credit Account"}
                    labelWidth={"33.5%"}
                    inputWidth={"57%"}
                    required={true}
                    type={"number"}
                    id={"accountNumber"}
                    name={"accountNumber"}
                    value={accountNumber}
                    onBlur={(e) => {
                      if (e.target.value !== "" && showModal === false) {
                        onKeyPress(e);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        onKeyPress(e);
                      }
                    }}
                    onChange={onAccountNumberChange}
                  />
                  <ButtonComponent
                    onClick={() => {
                      setShowModal(true);
                    }}
                    label="Search"
                    buttonBackgroundImage={
                      `url(` +
                      window.location.origin +
                      `/assets/images/headerBackground/` +
                      getTheme.theme.headerImage +
                      `)`
                    }
                    buttonWidth="22.5%"
                    buttonHeight="30px"
                    buttonColor="white"
                  />
                  <FindBy
                    setShowModal={setShowModal}
                    showModal={showModal}
                    handleSelected={handleSelected}
                  />
                </div> */}

              {/* <hr className="mb-[10px] mt-0 my-3" /> */}
              <div className="mb-[28px]">
                <div className=" mb-2">
                  <InputField
                    id={"Amount"}
                    label={"Amount"}
                    value={amount}
                    labelWidth={"18%"}
                    inputWidth={"30%"}
                    required={true}
                    textAlign={true}
                    // disabled={success}
                    onKeyPress={(e) => {
                      e.persist();
                      if (e.key === "Enter") {
                        if (accountNumber === "") {
                          setNoAc(true);

                          axios
                            .post(
                              API_SERVER + "/api/get-error-message",
                              { code: "06497" },
                              { headers }
                            )
                            .then((response) => {
                              swal({
                                // title: "Required ",
                                text: response.data,
                                icon: "warning",
                                buttons: "OK",
                              }).then((res) => {
                                if (res) {
                                  document
                                    .getElementById("accountNumber")
                                    .focus();
                                  setAmount("");
                                }
                              });
                            });
                        } else if (
                          e.target.value !== "" ||
                          parseFloat(e.target.value) !== 0
                        ) {
                          axios
                            .post(
                              API_SERVER + "/api/transaction-validation",
                              {
                                vaultAccount: JSON.parse(
                                  localStorage.getItem("userInfo")
                                ).id,
                                amount,
                                accountNumber,
                                batchNo,
                                branch: JSON.parse(
                                  localStorage.getItem("userInfo")
                                ).branchCode,
                                transType: "I",
                              },
                              { headers }
                            )
                            .then((response) => {
                              // console.log("validate", response.data);
                              if (response.data?.responseMessage) {
                                setValidateResponse(
                                  response.data.responseMessage
                                );
                                setValidate(true);
                              } else {
                                // setAmount(amount);
                                setDenomination(true);
                              }
                            });
                        }
                      }
                    }}
                    onChange={onAmountChange}
                    onBlur={(e) => {
                      if (!amount.includes(",")) {
                        if (!(amount === "")) {
                          setAmount(formatNumber(parseFloat(e.target.value)));
                        }
                      }
                      if (
                        parseFloat(amount.replaceAll(",", "")) !==
                          parseFloat(prevAmount.replaceAll(",", "")) &&
                        validate === false &&
                        !noAc &&
                        amount !== ""
                      ) {
                        swal({
                          allowOutsideClick: false,
                          text: success
                            ? "Kindly re-enter the denominations as the amount has been altered"
                            : "Kindly enter the denominations ",
                          icon: "warning",
                          buttons: "Proceed",
                          dangerMode: true,
                        }).then((result) => {
                          if (result) {
                            setDenomination(true);
                          }
                        });
                      }
                    }}
                  />
                </div>
                <div className=" mb-2">
                  {/* <label>Voucher Reference</label>
                  <input
                    id="voucherRef"
                    type="text"
                    ref={voucherRef}
                    className="focus:ring-2 focus:ring-blue-500 border"
                  /> */}
                  <InputField
                    id={"voucherRef"}
                    ref={voucherRef}
                    label={"Voucher Reference"}
                    labelWidth={"18%"}
                    inputWidth={"30%"}
                    onChange={onReference}
                    value={reference}
                    onKeyPress={(e) => {
                      switchFocus(e, "sourceOfFunds");
                      // if (sourceOfFundsRef.current) {
                      //   console.log(
                      //     sourceOfFundsRef.current,
                      //     document.getElementsByClassName("listOfValue").focus()
                      //   );
                      // }
                      // sourceOfFundsRef.current.focus();
                    }}
                  />
                </div>
                <div className="mb-2">
                  <ListOfValue
                    id={"sourceOfFunds"}
                    label={"Source of Funds"}
                    labelWidth={"18%"}
                    inputWidth={"30%"}
                    data={sourceOfFund}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        setTimeout(() => {
                          if (thirdPartyRef.current) {
                            thirdPartyRef.current.focus();
                          }
                        }, 0);
                        // if (thirdPartyRef.current) {
                        //   thirdPartyRef.current.focus();
                        // }
                      }
                    }}
                    onChange={(value) => {
                      setTimeout(() => {
                        if (thirdPartyRef.current) {
                          thirdPartyRef.current.focus();
                        }
                      }, 0);

                      // if (value && thirdPartyRef.current) {
                      //   thirdPartyRef.current.focus();
                      // }
                      setSelectedSourceOfFund(value);
                    }}
                    value={selectedSourceOfFund}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className=" ">
                  <div className=" mb-2 flex items-center ">
                    <label className="w-[18%] text-[90%] whitespace-nowrap text-gray-600 text-right mr-[20px]">
                      Third Party Transaction
                    </label>
                    <input
                      id={"thirdParty"}
                      ref={thirdPartyRef}
                      checked={isThirdParty}
                      type="checkbox"
                      // disabled={isThirdParty}
                      className="h-[13px] w-[13px] border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500  rounded-sm ring-offset-0"
                      // style={{ border: "1px solid blue" }}
                      onChange={(e) => {
                        setThirdPartyModal(true);
                        // if (e.target.checked) {
                        //   // setisThirdParty(true);

                        // } else {
                        //   // setisThirdParty(false);
                        //   setThirdPartyModal(false);
                        // }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setTimeout(() => {
                            document.getElementById("narration1").focus();
                          }, 0);
                        }
                        // switchFocus(e, "narration1");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" md:w-[35%] py-2  rounded px-4 ">
              {/* <InputField
                label={"MIS Codes"}
                labelWidth={"40%"}
                marginBottom={"8px"}
                inputWidth={"60%"}
                type={"number"}
                name={"accountNumber"}
              /> */}
              <AccountSummary
                accountNumber={accountNumberChange}
                setAccountDetails={setAccountDetails}
                transType={"CADD"}
              />
            </div>
          </div>
          <div className="space-y-2  px-2 py-3 border-2 rounded mt-2">
            <div className="w-[100%]">
              <InputField
                label={"Recovery Officer"}
                labelWidth={"12%"}
                inputWidth={"44.5%"}
                disabled={true}
                name={"accountName"}
                value={accountName}
                // setFormData={setFormData}
                // onChange={(e) => handleChange(e, "amount")}
              />
            </div>
            <InputField
              id={"narration1"}
              labelWidth={"12%"}
              inputWidth={"44.5%"}
              label={"Narration 1"}
              required={true}
              onChange={onNarrationChange}
              value={narration}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setTimeout(() => {
                    document.getElementById("narration2").focus();
                  }, 0);
                }
                // switchFocus(e, "narration2");
              }}
            />
            <InputField
              labelWidth={"12%"}
              inputWidth={"44.5%"}
              id={"narration2"}
              label={"Deposited By"}
              // required={true}
              value={narration2}
              onChange={onNarration2Change}
            />
            <Phone_number
              required={true}
              marginBottom={"8px"}
              label={"Contact"}
              labelWidth={"13.7%"}
              inputWidth={"22%"}
              // onChange={(value) => {
              //   setContact(value);
              //   setFormData((prev) => ({ ...prev, contact: value }));
              // }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoanRecoveryCheque;
