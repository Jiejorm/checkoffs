import React, { useEffect, useState } from "react";
import { GiReceiveMoney } from "react-icons/gi/index.esm";
import ListOfValue from "../components/ListOfValue";
import InputField from "../components/inputField";
import Label from "../../../../components/others/Label/Label";
// import SelectField from "./components/SelectField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import TextAreaField from "../components/TextArea";
import AccountSummary from "../../../../components/others/AccountSummary";
import axios from "axios";
import { MDBIcon } from "mdb-react-ui-kit";
import Modal from "../components/Modal";
import { API_SERVER } from "../../../../config/constant";
import { headers } from "./teller-activities";
import swal from "sweetalert";
import { checkInternetConnection } from "../components/checkConnection";
function CashDeposit({ setActiveAccountNumber }) {
  const [allDepositCurrency, setAllDepositCurrency] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  // const [ActiveAccountNumber, setActiveAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumberChange, setAccountNumberChange] = useState("");
  const [amount, setAmount] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [withdrawalBy, setWithdrawalBy] = useState("");
  const [contact, setContact] = useState("");
  const [isThirdParty, setisThirdParty] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  const dates = new Date(
    JSON.parse(localStorage.getItem("userInfo")).postingDate
  );
  const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
  const day = dates.getDate();
  const year = dates.getFullYear();

  // console.log({ allDetails });
  function onBlur(e) {
    checkInternetConnection();
    setAccountNumber(e.target.value);
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

  function onChange(e) {
    setAccountNumber(e.target.value);
  }

  useEffect(() => {
    async function fetchDepositCurrency() {
      const response = await axios.post(
        API_SERVER + "/get-deposit-currency",
        { deposit_currency: "KES" }
      );
      setAllDepositCurrency(response.data);
      console.log({ response });
    }
    fetchDepositCurrency();
  }, []);
  return (
    <>
      <div className="-mb-9">
        {/* <div className=" rounded h-auto pb-2 pt-2  bg-gray-200">
          

          <div
            style={{ width: "100%" }}
            className="wrapper   md:flex py-4 px-2 bg-white  "
          >
          
            <div className="md:w-[65%] rounded px-2  md:mr-2 md:mb-0 ">
              <div className="flex space-x-7  w-full items-center mb-2">
                <div className="w-[65%] ">
                  <ListOfValue
                    label={"Treasury Deal Number"}
                    labelWidth={"39%"}
                    inputWidth={"32%"}
                    required={true}
                    type={"number"}
                    id={""}
                  />
                </div>
               
              </div>
              <hr className="mb-[10px] mt-0 my-3" />
              <div>
                <div className="flex space-x-2 items-center mb-2">
                  <div className="w-[58%]">
                    <InputField
                      label={"Credit Account"}
                      labelWidth={"42.5%"}
                      inputWidth={"57%"}
                      onKeyPress={onKeyPress}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={accountNumber}
                    />
                  </div>
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
                    buttonWidth="11%"
                    buttonHeight="30px"
                    buttonColor="white"
                  />
                  <Modal
                    setShowModal={setShowModal}
                    showModal={showModal}
                    handleSelected={handleSelected}
                  />
                
                </div>
                <div className="w-full mb-1">
                  <InputField
                    label={"Account Name"}
                    labelWidth={"24.5%"}
                    inputWidth={"70%"}
                    disabled={true}
                    value={accountDetails?.account_name}
                  />
                </div>
                <hr className="mb-[10px] mt-0 my-3" />
              </div>

              <div className="w-1/2 mb-1">
                <ListOfValue
                  label={"Deposit currency "}
                  type="number"
                  labelWidth={"48%"}
                  inputWidth={"40%"}
                  required={true}
                  data={allDepositCurrency}
                />
              </div>
              <hr />

              <div className="bg-gray-200 my-[2px] py-[2px] px-[4px]">
                <div className="flex space-x-2 mt-2  items-center">
                  <div className="w-[40%] mb-2">
                    <InputField
                      label={"Deposit Amount"}
                      labelWidth={"60%"}
                      inputWidth={"34%"}
                      type={"number"}
                      required={true}
                    />
                  </div>
                  <div className="w-[60%] mb-2">
                    <InputField
                      label={"Reference"}
                      labelWidth={"20%"}
                      inputWidth={"80%"}
                    />
                  </div>
            
                </div>
                <div className="flex space-x-2 mt-2  items-center">
                  <div className="w-[40%] mb-2">
                    <InputField
                      label={"Credit Amount"}
                      labelWidth={"60%"}
                      inputWidth={"34%"}
                    />
                  </div>
                  <div className="w-[20%] mb-2">
                    <InputField
                      label={"Acqui Rate"}
                      labelWidth={"60%"}
                      inputWidth={"40%"}
                    />
                  </div>
                  <div className="w-[40%] space-x-1 flex items-center mb-2">
                    <div className="w-[70%] ">
                      <InputField
                        label={"Agreed Rate"}
                        labelWidth={"50%"}
                        inputWidth={"50%"}
                      />
                    </div>
                    <ButtonComponent
                      // onClick={() => {
                      //   setShowModal(true);
                      // }}
                      label="Pick rate"
                      buttonBackgroundImage={
                        `url(` +
                        window.location.origin +
                        `/assets/images/headerBackground/` +
                        getTheme.theme.headerImage +
                        `)`
                      }
                      buttonWidth="30%"
                      buttonHeight="30px"
                      buttonColor="white"
                    />
                  </div>

                
                </div>
              </div>
              <hr />
              <div className="space-y-2 mt-2">
                <TextAreaField
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

            <div className=" md:w-[35%] rounded  border-2 p-2 ">
              <AccountSummary
                accountNumber={accountNumberChange}
                setAccountDetails={setAccountDetails}
              />
            </div>
          </div>
        </div> */}

        {/* <p>
              Timer :{timer}{" "}
              <button
                onClick={() => {
                  interval.current = setInterval(counter, 1000);
                }}
              >
                Start
              </button>
              <button onClick={() => clearInterval(interval.current)}>
                Stop
              </button>
            </p> */}
      </div>
    </>
  );
}

export default CashDeposit;
