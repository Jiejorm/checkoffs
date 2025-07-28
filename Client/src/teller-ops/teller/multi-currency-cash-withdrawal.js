import React, { useState } from "react";
import { GiReceiveMoney } from "react-icons/gi/index.esm";
import Label from "../../../../components/others/Label/Label";
// import SelectField from "./components/SelectField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import TextAreaField from "../components/TextArea";
import ListOfValue from "../components/ListOfValue";
import InputField from "../components/inputField";
import { DatePicker } from "antd";
import axios from "axios";
import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
import AccountSummary from "../../../../components/others/AccountSummary";
import { checkInternetConnection } from "../components/checkConnection";
import Modal from "../components/Modal";
import { API_SERVER } from "../../../../config/constant";
import { headers } from "./teller-activities";
import swal from "sweetalert";

function CashDeposit() {
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState("");
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumberChange, setAccountNumberChange] = useState("");
  const [denomination, setDenomination] = useState("");

  function onBlur(e) {
    checkInternetConnection();
    setAccountNumber(e.target.value);
  }

  function onKeyPress(e) {
    checkInternetConnection();
    if (e.key === "Enter") {
      setAccountNumber(e.target.value);
    }
  }
  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }
  function onChange(e) {
    setAccountNumber(e.target.value);
  }
  async function fetchAccountDetails() {
    const response = await axios.post(
      API_SERVER + "/get-account-balance",
      { accountNumber: document.getElementById("accountNumber").value }
    );
    setResponse(response.data[0]);
  }

  function handleSelected(value) {
    setAccountNumberChange(value);
    setAccountNumber(value);
    // setActiveAccountNumber(value);
    // document.getElementById("Amount").focus();
    setShowModal(false);
  }

  function onKeyPress(e) {
    checkInternetConnection();
    if (e.key === "Enter") {
      setAccountNumberChange(e.target.value);
      axios
        .post(
          API_SERVER + "/getBalance",
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
                var input = document.getElementById("accountNumber");
                input.focus();
                setAccountName("");
              }
            });
          } else {
            setAccountNumberChange(e.target.value);
          }
        });
    }
  }
  function onAccountNumberChange(e) {
    setAccountNumber(e.target.value);
    // setActiveAccountNumber(e.target.value);
    // console.log(e.target.value);
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
  console.log(response, "response");
  return (
    <>
      <div className="bg-gray-200 -mb-24">
        {/* <div className=" rounded h-auto pb-2 px-2 pt-2 bg-white ">
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
            Multi-Currency Cash Withdrawal
          </div>
          <div style={{ width: "100%" }} className="wrapper  md:flex  ">
           
            <div className="md:w-[65%] border-2 rounded py-4 px-2  md:mr-2 md:mb-0 ">
              <div className="flex space-x-7 w-full items-center mb-2">
                <div className="md:w-[65%] w-full">
                  <ListOfValue
                    label={"Treasury Deal Number"}
                    labelWidth={"37%"}
                    inputWidth={"32%"}
                    required={true}
                    // type={"number"}
                    id={""}
                  />
                </div>
              </div>
              <hr className="mb-[10px] mt-0 my-3" />
              <div>
                <div className="w-[65%] mb-2 space-x-2 flex items-center">
                  <InputField
                    label={"Debit Account"}
                    labelWidth={"44.5%"}
                    inputWidth={"55%"}
                    required={true}
                    type={"number"}
                    id={"accountNumber"}
                    name={"accountNumber"}
                    value={accountNumber}
                    onBlur={onBlur}
                    onKeyPress={(e) => {
                      onKeyPress(e);
                      switchFocus(e, "Amount");
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
                  <Modal
                    setShowModal={setShowModal}
                    showModal={showModal}
                    handleSelected={handleSelected}
                  />
                </div>
                <div className="mb-2">
                  <InputField
                    label={"Account Name"}
                    labelWidth={"24%"}
                    inputWidth={"70%"}
                    disabled={true}
                    value={accountDetails?.accountName}
                  />
                </div>

                <hr className="mb-[10px] mt-0 my-3" />
              </div>

              <div className="w-1/2 mb-2">
                <ListOfValue
                  label={"Withdrawal currency "}
                  type="number"
                  labelWidth={"48%"}
                  inputWidth={"45%"}
                  required={true}
                />
              </div>
              <hr className="my-[5px]" />

              <div className="bg-gray-100 rounded-sm my-[2px] py-[2px] px-[4px]">
                <div className="flex space-x-3 mt-2  items-center">
                  <div className="w-[40%] mb-2">
                    <InputField
                      label={"Withdrawal Amount"}
                      labelWidth={"66%"}
                      inputWidth={"30%"}
                    />
                  </div>
                  <div className="w-1/3 mb-2">
                    <InputField
                      label={"Reference"}
                      labelWidth={"40%"}
                      inputWidth={"60%"}
                    />
                  </div>
                  <div className="w-1/3 mb-2">
                    <InputField
                      label={"Value Date"}
                      labelWidth={"35%"}
                      inputWidth={"60%"}
                      type={"date"}
                    />
                  </div>

                  
                </div>
                <div className="flex space-x-3 mt-2  items-center">
                  <div className="w-[40%] mb-2">
                    <InputField
                      label={"Debit Amount"}
                      labelWidth={"66%"}
                      inputWidth={"30%"}
                    />
                  </div>
                  <div className="w-1/3 mb-2">
                    <InputField
                      label={"Acqui Rate"}
                      labelWidth={"40%"}
                      inputWidth={"40%"}
                    />
                  </div>
                  <div className="w-1/3 mb-2">
                    <InputField
                      label={"Agreed Rate"}
                      labelWidth={"50%"}
                      inputWidth={"50%"}
                    />
                  </div>

                 
                </div>
              </div>
              <hr className="my-[5px]" />
              <div className="space-y-2 mt-2">
                <InputField
                  labelWidth={"24.5%"}
                  inputWidth={"75%"}
                  label={"Narration"}
                  required={true}
                />

                <InputField
                  label={"Withdrawal By"}
                  required={true}
                  labelWidth={"24.5%"}
                  inputWidth={"70%"}
                />
                <InputField
                  label={"Contact / Telephone"}
                  type="number"
                  labelWidth={"24.5%"}
                  inputWidth={"35%"}
                  required={true}
                />
              </div>
            </div>

           
            <div className=" md:w-[35%] p-2 border-2 rounded ">
              <AccountSummary
                accountNumber={accountNumber}
                setAccountDetails={setAccountDetails}
              />
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default CashDeposit;
