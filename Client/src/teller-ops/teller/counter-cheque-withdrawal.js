import React, { useState, useEffect } from "react";
import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";

import ListOfValue from "../components/ListOfValue";
import InputField from "../components/inputField";
import Label from "../../../../components/others/Label/Label";
// import SelectField from "../components/SelectField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
// import TextAreaField from "./components/TextArea";
import AccountSummary from "../../../../components/others/AccountSummary";
import DataTable from "../../../../components/others/Datatable/DataTable";
import axios from "axios";
import FindBy from "../components/Modal";
import { API_SERVER } from "../../../../config/constant";
import { headers } from "./teller-activities";
import swal from "sweetalert";
import { Modal } from "@mantine/core";
// import { headers } from "./teller-activities";
import CustomTable from "../components/CustomTable";
import Denominations from "../components/Denominations";
function CounterChequeWithdrawal({
  checked,
  okClick,
  setActiveAccountNumber,
  batchNo,
  setChecked,
}) {
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [accountNumber, setAccountNumber] = useState("");

  const [accountName, setAccountName] = useState("");
  const [denomination, setDenomination] = useState(false);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [prevAmount, setPrevAmount] = useState("");
  const [noAc, setNoAc] = useState(false);
  const [accountNumberChange, setAccountNumberChange] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [denominationEntries, setDenominationEntries] = useState("");
  const [chequeDate, setChequeDate] = useState(
    new Date(JSON.parse(localStorage.getItem("userInfo")).postingDate)
      .toISOString()
      .split("T")[0]
  );
  const [chequeNumber, setChequeNumber] = useState("");
  const [withdrawalBy, setWithdrawalBy] = useState("");
  const [contact, setContact] = useState("");
  const [reference, setReference] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [validate, setValidate] = useState(false);
  const [validateResponse, setValidateResponse] = useState(false);
  const [contraAcNo, setContraAcNo] = useState("");
  const [narration, setNarration] = useState("COUNTER CHEQUE WITHDRAWAL");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  function onAccountNumberChange(e) {
    setAccountNumber(e.target.value);
    setActiveAccountNumber(e.target.value);
    // console.log(e.target.value);
  }

  useEffect(() => {
    // alert("ghana");
    // console.log("clickessss");
    if (isFirstRender) {
      // Skip the useEffect on the first render
      setIsFirstRender(false);
      return;
    }
    try {
      if (
        accountNumber === "" ||
        amount === "" ||
        chequeNumber === "" ||
        withdrawalBy === "" ||
        narration === "" ||
        contact === ""
      ) {
        swal({
          title: "Kindly Fill all required fields",
          text: "Kindly fill all required fields",
          icon: "warning",
          buttons: "OK",
          dangerMode: true,
        }).then((result) => {
          if (result) {
            // setShowModal(false);
          }
        });
      } else {
        axios
          .post(
            API_SERVER + "/api/counter-cheque-withdrawal",
            {
              username: JSON.parse(localStorage.getItem("userInfo")).id,
              accountNumber,

              amount,
              transaction_desc: withdrawalBy,
              voucherNumber: chequeNumber,
              postedBy: JSON.parse(localStorage.getItem("userInfo"))?.id,
              approvedBy: JSON.parse(localStorage.getItem("userInfo"))?.id,
              terminal: localStorage.getItem("ipAddress"),
              branch: JSON.parse(localStorage.getItem("userInfo"))?.branchCode,
              transaction_code: batchNo,

              batchNumber: batchNo,
              documentRef: reference,
              appFlag: null,
              narration,
              transactionRef: reference,

              formCode: "CADD",
            },
            { headers }
          )
          .then((res) => {
            if (res) {
              swal({
                title: "Success",
                text:
                  res.data.responseMessage + " with Batch number " + batchNo,
                icon: "success",
                buttons: "OK",
              }).then((result) => {
                if (result) {
                  setChecked(!checked);
                }
              });
            }
          });
      }
    } catch (err) {}
  }, [okClick]);

  function onAmountChange(e) {
    const inputValue = e.target.value;
    if (!inputValue || /^\d*\.?\d*$/.test(inputValue)) {
      setAmount(inputValue);
    } else {
      setAmount(inputValue.replaceAll(",", ""));
    }
  }
  function handleSelected(value) {
    setAccountNumberChange(value);
    setAccountNumber(value);
    // setActiveAccountNumber(value);
    // document.getElementById("Amount").focus();
    setShowModal(false);
  }

  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }

  useEffect(() => {
    if (accountDetails) {
      if (accountDetails.summary?.length > 0) {
        setAccountName(accountDetails?.summary[0]?.account_name);
        document.getElementById("chequeDate")?.focus();
        axios
          .post(
            API_SERVER + "/api/counter-cheque-withdrawal",
            {
              key: "contra",
              currency: accountDetails?.summary[0]?.currency_code,
              username: JSON.parse(localStorage.getItem("userInfo")).id,
            },
            { headers }
          )
          .then((res) => {
            console.log({ contra: res });
            setContraAcNo(res.data);
          });
      }
    }
  }, [accountDetails]);
  console.log({
    chequeDate,
    contraAcNo,
    // accountDetails: accountDetails?.summary[0]?.currency_code,
    f: new Date(JSON.parse(localStorage.getItem("userInfo")).postingDate)
      .toISOString()
      .split("T")[0],
  });
  function onKeyPress(e) {
    if (e.key === "Enter") {
      //   setAccountNumberChange(e.target.value);
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

            swal({
              text: response.data,
              icon: "warning",
              buttons: "OK",
              dangerMode: true,
            }).then((result) => {
              if (result) {
                var input = document.getElementById("accountNumber");
                input?.focus();
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
  }

  function switchFocus(e, nextFieldId) {
    if (e.key === "Enter") {
      if (e.target.id === "Amount") {
        console.log(formatNumber(parseFloat(e.target.value)), "ghanananan");
        if (!(amount === "")) {
          setAmount(formatNumber(parseFloat(e.target.value)));
        }
        setDenomination(true);
      }
      document.getElementById(nextFieldId).focus();
      // console.log(document.getElementById(nextFieldId), "component");
    }
  }

  useEffect(() => {
    setActiveAccountNumber("");
    setAccountNumber("");
    setNoAc(false);
    setAccountNumberChange("");
    setChequeNumber("");
    setChequeDate(
      new Date(JSON.parse(localStorage.getItem("userInfo")).postingDate)
        .toISOString()
        .split("T")[0]
    );
    setContraAcNo("");
    setAmount("");

    setNarration("COUNTER CHEQUE WITHDRAWAL");

    setWithdrawalBy("");
    setContact("");

    setAccountName("");
    setSuccess(false);
    setPrevAmount("");
    document.getElementById("accountNumber")?.focus();
  }, [checked]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        document.getElementById("narration")?.focus();
      }, 500);
    }
  }, [success]);

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

      <Modal
        className="px-2 rounded "
        opened={showMessage}
        backdrop="static"
        closeOnClickOutside={false}
        onClose={(e) => {
          setShowMessage(false);
          // switchFocus(e, "Amount");
          document.getElementById("Amount")?.focus();
        }}
        withCloseButton={false}
        centered
        padding={0}
      >
        <AccountMessage />
      </Modal>

      <Modal
        closeOnClickOutside={false}
        className=""
        title={<div className="font-semibold uppercase text-gray-800"></div>}
        opened={validate}
        onClose={() => {
          setValidate(false);
          setChecked(!checked);
        }}
        withCloseButton={false}
        centered
        padding={0}
      >
        <AccountValidate />
      </Modal>
      <div className="w-full bg-gray-200">
        <div className=" rounded h-auto pb-2 px-2 pt-2 bg-white  ">
          <div
            style={{
              background: "#daecfe",
            }}
            className="font-semibold py-1 px-3 mb-2 uppercase text-gray-800"
          >
            COUNTER CHEQUE WITHDRAWAL
          </div>
          <div
            style={{ width: "100%" }}
            className="wrapper border-2  md:flex  "
          >
            {/**Right Section */}
            <div className="w-[65%] rounded py-4 px-2  md:mr-2 md:mb-0 first  ">
              <div className="mb-2 w-[65%] space-x-2 flex items-center">
                <InputField
                  label={"Account Number"}
                  labelWidth={"35%"}
                  inputWidth={"57%"}
                  required={true}
                  type={"number"}
                  id={"accountNumber"}
                  name={"accountNumber"}
                  value={accountNumber}
                  // onBlur={onBlur}

                  onKeyPress={(e) => {
                    onKeyPress(e);
                    // switchFocus(e, "Amount");
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== "" && showModal === false) {
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
              </div>

              <div>
                <div className="w-[100%] mb-2">
                  <InputField
                    label={"Account Name"}
                    labelWidth={"18%"}
                    inputWidth={"70%"}
                    disabled={true}
                    value={accountName}
                  />
                </div>

                <hr className="mb-[10px] mt-0 my-3" />
              </div>

              <InputField
                marginBottom={"8px"}
                id={"chequeDate"}
                label={"Cheque Date "}
                type="date"
                labelWidth={"18%"}
                inputWidth={"30%"}
                required={true}
                value={chequeDate}
                onChange={(e) => {
                  e.persist();
                  setChequeDate(e.target.value);
                }}
                onKeyPress={(e) => {
                  switchFocus(e, "chequeNumber");
                }}
              />

              <InputField
                marginBottom={"8px"}
                id={"chequeNumber"}
                label={"Cheque Number "}
                type="number"
                labelWidth={"18%"}
                inputWidth={"30%"}
                required={true}
                textAlign={"right"}
                value={chequeNumber}
                onChange={(e) => {
                  e.persist();
                  setChequeNumber(e.target.value);
                }}
                onKeyPress={(e) => {
                  switchFocus(e, "Amount");
                }}
              />

              <InputField
                marginBottom={"8px"}
                label={"Amount"}
                id={"Amount"}
                textAlign={"right"}
                type="number"
                labelWidth={"18%"}
                inputWidth={"30%"}
                required={true}
                value={amount}
                onChange={onAmountChange}
                onKeyPress={(e) => {
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
                              setAmount("");

                              document.getElementById("accountNumber")?.focus();
                              return;
                            }
                          });
                        });
                    } else if (
                      !(e.target.value === "") &&
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
                            branch: JSON.parse(localStorage.getItem("userInfo"))
                              .branchCode,
                          },
                          { headers }
                        )
                        .then((response) => {
                          // console.log("validate", response.data);
                          if (response.data?.responseMessage) {
                            setValidateResponse(response.data.responseMessage);
                            setValidate(true);
                          } else {
                            // setAmount(amount);
                            // console.log({a})
                            if (
                              (accountDetails?.summary[0]?.availabe_balance.includes(
                                "*"
                              )
                                ? 0.0
                                : parseFloat(
                                    accountDetails?.summary[0]?.availabe_balance?.replaceAll(
                                      ",",
                                      ""
                                    )
                                  )) < parseFloat(amount?.replaceAll(",", ""))
                            ) {
                              axios
                                .post(
                                  API_SERVER + "/api/get-error-message",
                                  { code: "07132" },
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
                                      setAmount("");
                                      document.getElementById("Amount").focus();
                                    }
                                  });
                                });
                            } else {
                              setDenomination(true);
                            }
                          }
                        });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (!(amount === "")) {
                    setAmount(formatNumber(parseFloat(e.target.value)));
                  }
                  if (!success && prevAmount !== amount && !validate && !noAc) {
                    setDenomination(true);
                  }
                }}
              />

              <InputField
                marginBottom={"8px"}
                id={"contraAcNo"}
                label={"Contra A/c Number "}
                labelWidth={"18%"}
                inputWidth={"30%"}
                disabled={true}
                value={contraAcNo}
                onKeyPress={(e) => {
                  switchFocus(e, "reference");
                }}
              />

              <InputField
                marginBottom={"8px"}
                id={"reference"}
                label={"Reference"}
                type="number"
                value={reference}
                labelWidth={"18%"}
                inputWidth={"30%"}
                disabled={true}
                onKeyPress={(e) => {
                  switchFocus(e, "narration");
                }}
              />
              <hr className="mb-[10px] mt-0 " />
              <div className="space-y-2">
                <InputField
                  labelWidth={"18%"}
                  inputWidth={"70%"}
                  id={"narration"}
                  label={"Narration"}
                  required={true}
                  value={narration}
                  onChange={(e) => {
                    e.persist();
                    setNarration(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    switchFocus(e, "withdrawalBy");
                  }}
                />

                <InputField
                  label={"Withdrawal By"}
                  required={true}
                  id={"withdrawalBy"}
                  labelWidth={"18%"}
                  inputWidth={"70%"}
                  value={withdrawalBy}
                  onChange={(e) => {
                    e.persist();
                    setWithdrawalBy(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    switchFocus(e, "contact");
                  }}
                />
                <InputField
                  id={"contact"}
                  label={"Contact / Telephone"}
                  type="number"
                  labelWidth={"18%"}
                  inputWidth={"30%"}
                  required={true}
                  value={contact}
                  onChange={(e) => {
                    e.persist();
                    setContact(e.target.value);
                  }}
                />
              </div>
            </div>

            {/**Left Section  */}
            <div className="w-[35%] px-2 rounded ">
              <div className=" py-2  ">
                <AccountSummary
                  accountNumber={accountNumberChange}
                  setAccountDetails={setAccountDetails}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CounterChequeWithdrawal;
