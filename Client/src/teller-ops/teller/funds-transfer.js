// 004009110949770160
import React, { useState, useEffect } from "react";
import { GiReceiveMoney } from "react-icons/gi/index.esm";
import ListOfValue from "../components/ListOfValue";
import InputField from "../components/inputField";
import Label from "../../../../components/others/Label/Label";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import swal from "sweetalert";
import AccountSummary from "../../../../components/others/AccountSummary";
import { checkInternetConnection } from "../components/checkConnection";
import FindBy from "../components/Modal";
import { API_SERVER } from "../../../../config/constant";
import axios from "axios";
import Denominations from "../components/Denominations";
import PhoneNumber from "../components/Phone_number";
import ThirdPartyModalX from "../components/ThirdPartyModal";
import { Modal } from "@mantine/core";
function FundsTransfer({
  handleSubmit,
  formData,
  setFormData,
  setBatchNo,
  body,
  setChecked,
  checked,
  batchNo,
  setActiveAccountNumber,
  setDenominationEntries,
}) {
  const [response, setResponse] = useState("");
  const [inWords, setInWords] = useState("");
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedSourceOfFund, setSelectedSourceOfFund] = useState("");

  const [accountNumberChange, setAccountNumberChange] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [withdrawalBy, setWithdrawalBy] = useState("");
  const [contact, setContact] = useState("233");
  const [isThirdParty, setisThirdParty] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [inWord, setInWord] = useState("");
  const [sourceOfFund, setSourceOfFund] = useState("");
  const [narration2, setNarration2] = useState("");
  const [denomination, setDenomination] = useState(false);
  const [ThirdPartyModal, setThirdPartyModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [success, setSuccess] = useState(false);

  const [validate, setValidate] = useState(false);
  const [validateResponse, setValidateResponse] = useState(false);

  function formatNumber(amount) {
    const formattedAmount = amount.toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
    });

    const amountWithoutCurrency = formattedAmount.replace("$", "");
    return amountWithoutCurrency;
  }

  // useEffect(() => {
  //   setAccountName(accountDetails?.account_name);
  // }, [accountDetails]);

  useEffect(() => {
    if (accountDetails) {
      if (accountDetails.summary?.length > 0) {
        setAccountName(accountDetails?.summary[0]?.account_name);
        document.getElementById("Amount").focus();
      }
      console.log("ghanaaa", accountDetails);
      if (accountDetails.message) {
        console.log("togo", accountDetails.message);

        setShowMessage(true);
      }
    }
  }, [accountDetails]);

  const dates = new Date(
    JSON.parse(localStorage.getItem("userInfo")).postingDate
  );
  const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
  const day = dates.getDate();
  const year = dates.getFullYear();

  const eDate = new Date(
    JSON.parse(localStorage.getItem("userInfo")).postingDate
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
      amount,
      reference,
      isThirdParty,
      narration,
      withdrawalBy,
      contact,
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
  ]);

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  useEffect(() => {
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
    setAccountNumber("");
    // setValueDate: value_date,
    // setInWord("");
    setAccountNumberChange("");
    setAmount("");
    setReference("");
    setisThirdParty(false);
    setNarration("");
    setWithdrawalBy("");
    setContact("233");
    setOtherInfo("");
    setAccountName("");
    setSuccess(false);
  }, [checked]);

  function onBlur(e) {
    checkInternetConnection();
    setAccountNumber(e.target.value);
    // getAccountName();
  }

  function onKeyPress(e) {
    checkInternetConnection();
    if (e.key === "Enter") {
      e.persist();
      setAccountNumberChange(e.target.value);
      axios
        .post(
          API_SERVER + "/api/getBalance",
          {
            accountNumber: accountNumber,
          },
          { headers }
        )
        .then((response) => {
          let data = response.data[0];

          if (data === undefined) {
            swal({
              title: "Invalid Account Number",
              text: "The account number could not be found in our records..",
              icon: "warning",
              buttons: "OK",
              dangerMode: true,
            }).then((result) => {
              if (result) {
                setAccountName("");
                var input = document.getElementById("accountNumber");
                input.focus();
              }
            });
          } else {
            setAccountNumberChange(e.target.value);
          }
        });
    }
  }

  function onOtherInfoChange(e) {
    setOtherInfo(e.target.value);
    // setFormData((prev) => ({ ...prev, withdrawalBy: narration }));
  }
  function onAccountNumberChange(e) {
    setAccountNumber(e.target.value);
    // console.log(e.target.value);
  }

  function onAmountChange(e) {
    const inputValue = e.target.value;
    if (!inputValue || /^\d*\.?\d*$/.test(inputValue)) {
      setAmount(inputValue);
    }
    if (e.target.value !== "") {
      setInWords(e.target.value);
    } else if (e.target.value === "") {
      setInWords("");
    }
    // console.log(amount, "hfjh");
    // console.log(e.target.value);
  }

  function onValueDate(e) {
    setValueDate(e.target.value);
  }
  function onReference(e) {
    setReference(e.target.value);
  }
  function onContactChange(e) {
    setContact(e);
  }
  function onThirdPartyChange(e) {
    console.log(e);
    setisThirdParty(e);
  }

  function onWithdrawalByChange(e) {
    setWithdrawalBy(e.target.value);
    // setFormData((prev) => ({ ...prev, withdrawalBy: narration }));
  }

  function onNarrationChange(e) {
    setNarration(e.target.value);
    // setFormData((prev) => ({ ...prev, narration: narration }));
  }

  function switchFocus(e, nextFieldId) {
    if (e.key === "Enter") {
      if (e.target.id === "Amount") {
        console.log(formatNumber(parseFloat(e.target.value)), "ghanananan");
        setAmount(formatNumber(parseFloat(e.target.value)));
        setDenomination(true);
      }
      document.getElementById(nextFieldId).focus();
      // console.log(document.getElementById(nextFieldId), "component");
    }
  }
  function handleSelected(value) {
    setAccountNumberChange(value);
    setAccountNumber(value);
    setActiveAccountNumber(value);
    document.getElementById("Amount").focus();
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
  console.log({
    // accountNumber,
    // valueDate,
    // amount,
    // reference,
    // isThirdParty,
    // narration,
    // withdrawalBy,
    // contact,
    showMessage,
  });

  function AccountMessage() {
    return (
      <div className="">
        <div className="p-2    bg-[#F5F5F5] text-gray-800  ">
          <div className="flex font-semibold space-x-3 items-center mb-4">
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
            <div
              className="flex items-center space-x-2 rounded py-[8px] px-2 mb-2"
              key={key}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-green-500"
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
      <div className="">
        <div className="p-2   text-gray-800  ">
          <div className="flex font-semibold space-x-3 items-center mb-4">
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

          <div className="bg-[#d1d1d1] shadow-sm flex items-center space-x-2 rounded py-[8px] px-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 stroke-green-500"
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
        setAmount={setAmount}
        amount={amount}
        checked={checked}
        setSuccess={setSuccess}
        setShowModal={setDenomination}
        setDenominationEntries={setDenominationEntries}
        transType={"O"}
      />
      <ThirdPartyModalX
        setContact={setContact}
        showModal={ThirdPartyModal}
        setShowModal={setThirdPartyModal}
        setisThirdParty={setisThirdParty}
      />
      <Modal
        className="z-[999999999]"
        opened={showMessage}
        title={
          <div className="font-semibold uppercase text-gray-800">
            Account Message
          </div>
        }
        onClose={(e) => {
          setShowMessage(false);
          // switchFocus(e, "Amount");
          document.getElementById("Amount")?.focus();
        }}
        centered
      >
        <AccountMessage />
      </Modal>

      <Modal
        className="z-[999999999]"
        opened={validate}
        title={
          <div className="font-semibold uppercase text-gray-800">
            Account validation
          </div>
        }
        onClose={(e) => {
          setChecked(!checked);
          setValidate(false);
          // switchFocus(e, "Amount");
          // document.getElementById("Amount")?.focus();
        }}
        centered
      >
        <AccountValidate />
      </Modal>
      <div className="">
        <div className=" rounded h-auto pb-2 pt-2 px-2 -mb-20  bg-white ">
          <div
            style={{
              background:
                `url(` +
                window.location.origin +
                `/assets/images/headerBackground/` +
                getTheme.theme.headerImage +
                `)`,
            }}
            className="text-white py-1 px-3 mb-2 "
          >
            Funds Transfer
          </div>
          <div
            style={{ width: "100%" }}
            className="wrapper border-2  rounded  md:flex  "
          >
            {/**Right Section */}
            <div className="md:w-[65%] rounded py-2 px-3     md:mr-2 md:mb-0 first  ">
              <div className=" w-full  mb-[28px]">
                <div className="w-[65%] mb-2  flex items-center">
                  <InputField
                    label={"Debit Account"}
                    labelWidth={"40.5%"}
                    inputWidth={"55%"}
                    required={true}
                    type={"number"}
                    id={"accountNumber"}
                    name={"accountNumber"}
                    value={accountNumber}
                    onBlur={onBlur}
                    onKeyPress={(e) => {
                      onKeyPress(e);
                      // switchFocus(e, "Amount");
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
                    buttonWidth="20%"
                    buttonHeight="30px"
                    buttonColor="white"
                  />
                  <FindBy
                    setShowModal={setShowModal}
                    showModal={showModal}
                    handleSelected={handleSelected}
                  />
                </div>
                {/* <div className="w-[35%]">
                  <InputField
                    label={"Value Date"}
                    labelWidth={"35%"}
                    inputWidth={"65%"}
                    name={"valueDate"}
                    disabled={true}
                    value={`${day}/${month}/${year}`}
                  />
                </div> */}
                <div className="flex items-center w-[100%] mb-2">
                  <div className="w-[100%]">
                    <InputField
                      label={"Account Name"}
                      labelWidth={"22%"}
                      inputWidth={"78%"}
                      disabled={true}
                      name={"accountName"}
                      value={accountName}
                      // setFormData={setFormData}
                      // onChange={(e) => handleChange(e, "amount")}
                    />
                  </div>
                </div>
              </div>
              {/* <hr className="mb-[10px] mt-0 my-3" /> */}
              <div className="mb-2">
                {/* <div className="flex space-x-7 mb-2">
                  <div className="w-[80%]">
                    <InputField
                      label={"Product"}
                      labelWidth={"28.5%"}
                      inputWidth={"60%"}
                      disabled={true}
                    />
                  </div>
                </div> */}
                {/* <hr className="mb-[10px] mt-0 my-3" /> */}

                <div className="  mb-2">
                  <InputField
                    id={"Amount"}
                    label={"Amount "}
                    value={amount}
                    labelWidth={"22%"}
                    inputWidth={"16%"}
                    required={true}
                    disabled={success}
                    textAlign={true}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        if (!(e.target.value === "")) {
                          setAmount(formatNumber(parseFloat(e.target.value)));

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
                              },
                              { headers }
                            )
                            .then((response) => {
                              if (response.data?.responseMessage) {
                                setValidateResponse(
                                  response.data.responseMessage
                                );
                                setValidate(true);
                              } else {
                                setDenomination(true);
                              }
                            });
                        }
                        if (success) {
                          switchFocus(e, "voucherRef");
                        }
                      }

                      // return e.charCode >= 48 && e.charCode <= 57;
                    }}
                    onChange={onAmountChange}
                    onBlur={(e) => {
                      if (!(amount === "")) {
                        setAmount(formatNumber(parseFloat(e.target.value)));
                      }
                    }}
                  />
                </div>
                <div className="  mb-2">
                  <InputField
                    id={"Amount"}
                    label={"Transaction Ref No"}
                    value={amount}
                    labelWidth={"22%"}
                    inputWidth={"16%"}
                    required={true}
                    disabled={success}
                    textAlign={true}
                    onChange={onAmountChange}
                    onBlur={(e) => {
                      if (!(amount === "")) {
                        setAmount(formatNumber(parseFloat(e.target.value)));
                      }
                    }}
                  />
                </div>

                <div className="w-[71%] mb-2  flex items-center">
                  <InputField
                    label={"Document Ref No"}
                    labelWidth={"40.5%"}
                    inputWidth={"55%"}
                    required={true}
                    type={"number"}
                    id={"accountNumber"}
                    name={"accountNumber"}
                    // value={accountNumber}
                    onBlur={onBlur}
                    onKeyPress={(e) => {
                      onKeyPress(e);
                      // switchFocus(e, "Amount");
                    }}
                    // onChange={onAccountNumberChange}
                  />
                  <ButtonComponent
                    onClick={() => {
                      setShowModal(true);
                    }}
                    label="View Document"
                    buttonBackgroundImage={
                      `url(` +
                      window.location.origin +
                      `/assets/images/headerBackground/` +
                      getTheme.theme.headerImage +
                      `)`
                    }
                    buttonWidth="31%"
                    buttonHeight="30px"
                    buttonColor="white"
                  />
                  <FindBy
                    setShowModal={setShowModal}
                    showModal={showModal}
                    handleSelected={handleSelected}
                  />
                </div>

                <InputField
                  id={"Debit Narration"}
                  labelWidth={"22%"}
                  inputWidth={"78%"}
                  label={"Debit Narration"}
                  required={true}
                  onChange={onNarrationChange}
                  value={narration}
                  onKeyPress={(e) => {
                    switchFocus(e, "narration2");
                  }}
                />

                {/* <div className=" mb-2">
                  <InputField
                    id={"reference"}
                    label={"Reference"}
                    labelWidth={"22%"}
                    inputWidth={"16%"}
                    onChange={onReference}
                    value={reference}
                    onKeyPress={(e) => {
                      switchFocus(e, "sourceOfFunds");
                    }}
                  />
                </div> */}
              </div>
            </div>

            <div className=" md:w-[35%] py-2  rounded px-4 ">
              <InputField
                label={"MIS Codes"}
                labelWidth={"40%"}
                marginBottom={"8px"}
                inputWidth={"60%"}
                type={"number"}
                name={"accountNumber"}
                // value={accountNumber}
                // onBlur={onBlur}
                // onKeyPress={(e) => {
                //   onKeyPress(e);
                //   switchFocus(e, "Amount");
                // }}
                // onChange={onAccountNumberChange}
              />
              <AccountSummary
                transType={"CAW"}
                accountNumber={accountNumberChange}
                setAccountDetails={setAccountDetails}
              />
            </div>
          </div>
          <div className="border-2 rounded mt-2">
            <div className="md:w-[65%] rounded py-2 px-3     md:mr-2 md:mb-0 first  ">
              <div className=" w-full  mb-[28px]">
                <div className="w-[65%] mb-2  flex items-center">
                  <InputField
                    label={"Credit Account"}
                    labelWidth={"40.5%"}
                    inputWidth={"55%"}
                    required={true}
                    type={"number"}
                    id={"accountNumber"}
                    name={"accountNumber"}
                    // value={accountNumber}
                    onBlur={onBlur}
                    onKeyPress={(e) => {
                      onKeyPress(e);
                      // switchFocus(e, "Amount");
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
                    buttonWidth="20%"
                    buttonHeight="30px"
                    buttonColor="white"
                  />
                  <FindBy
                    setShowModal={setShowModal}
                    showModal={showModal}
                    handleSelected={handleSelected}
                  />
                </div>
                {/* <div className="w-[35%]">
                  <InputField
                    label={"Value Date"}
                    labelWidth={"35%"}
                    inputWidth={"65%"}
                    name={"valueDate"}
                    disabled={true}
                    value={`${day}/${month}/${year}`}
                  />
                </div> */}
                <div className="flex items-center w-[100%] mb-2">
                  <div className="w-[100%]">
                    <InputField
                      label={"Account Name"}
                      labelWidth={"22%"}
                      inputWidth={"78%"}
                      disabled={true}
                      name={"accountName"}
                      value={accountName}
                      // setFormData={setFormData}
                      // onChange={(e) => handleChange(e, "amount")}
                    />
                  </div>
                </div>
              </div>
              {/* <hr className="mb-[10px] mt-0 my-3" /> */}
              <div className="">
                {/* <div className="flex space-x-7 mb-2">
                  <div className="w-[80%]">
                    <InputField
                      label={"Product"}
                      labelWidth={"28.5%"}
                      inputWidth={"60%"}
                      disabled={true}
                    />
                  </div>
                </div> */}
                {/* <hr className="mb-[10px] mt-0 my-3" /> */}

                <InputField
                  id={"Credit Narration"}
                  labelWidth={"22%"}
                  inputWidth={"78%"}
                  label={"Credit Narration"}
                  required={true}
                  onChange={onNarrationChange}
                  value={narration}
                  onKeyPress={(e) => {
                    switchFocus(e, "narration2");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FundsTransfer;
