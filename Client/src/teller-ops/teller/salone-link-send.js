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
import Phone_number from "../components/Phone_number";
import SelectField from "../../../../components/others/Fields/SelectField";
function SaloneLinkSend({ setActiveAccountNumber }) {
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
        "http://localhost:3020/get-deposit-currency",
        { deposit_currency: "KES" }
      );
      setAllDepositCurrency(response.data);
      console.log({ response });
    }
    // fetchDepositCurrency();
  }, []);
  return (
    <>
      <div className=" flex space-x-4  ">
        <div className=" w-[70%] pt-3">
          <div className=" space-y-3 px-4">
            <SelectField
              labelWidth={"32.5%"}
              label={"Product"}
              inputWidth={"50%"}
            />
            <InputField
              labelWidth={"32.5%"}
              inputWidth={"20%"}
              label={"Remittance Amount"}
            />
            <InputField
              labelWidth={"32.5%"}
              inputWidth={"20%"}
              label={"Total Amount"}
            />
          </div>

          <div className=" mt-3 space-y-3 border-2  rounded relative pb-3 px-4">
            <span className="absolute left-3 top-[-10px] bg-white rounded font-semibold   text-blue-500  text-sm px-2 ">
              Sender's Details
            </span>
            {/* <ListOfValue labelWidth={"32.5%"} label={"Product"} /> */}
            <InputField labelWidth={"40%"} label={"Name"} />
            <InputField labelWidth={"40%"} label={"Address"} />
            <Phone_number
              required={true}
              marginBottom={"8px"}
              label={"Contact"}
              labelWidth={"49.7%"}
              inputWidth={"50%"}
              // onChange={(value) => {
              //   setContact(value);
              //   setFormData((prev) => ({ ...prev, contact: value }));
              // }}
            />
          </div>
          <div className=" mt-3 space-y-3 border-2  relative pb-3 px-4">
            <span className="absolute left-3 top-[-10px] bg-white rounded font-semibold   text-blue-500  text-sm px-2 ">
              Receiver's Details
            </span>
            <InputField labelWidth={"40%"} label={"Name"} />
            <InputField labelWidth={"40%"} label={"Address"} />
            <Phone_number
              required={true}
              marginBottom={"8px"}
              label={"Contact"}
              labelWidth={"49.7%"}
              inputWidth={"50%"}
              // onChange={(value) => {
              //   setContact(value);
              //   setFormData((prev) => ({ ...prev, contact: value }));
              // }}
            />
          </div>
          <div className=" mt-3 space-y-3 border-2  relative pb-3 px-4">
            <span className="absolute left-3 top-[-10px] bg-white rounded font-semibold   text-blue-500  text-sm px-2 ">
              Security Details
            </span>
            <ListOfValue labelWidth={"32.5%"} label={"Question"} />
            <InputField labelWidth={"40%"} label={"Answer"} />
            <InputField labelWidth={"40%"} label={"Narration"} />
          </div>
          <div className=" mt-3 space-y-3 border relative pb-3 px-4">
            <InputField labelWidth={"40%"} label={"Credit Account"} />
            <InputField labelWidth={"40%"} label={"Teller Contra"} />
            <InputField labelWidth={"40%"} label={"Host Message"} />
          </div>
          <div className="mb-[30px]">fj</div>
        </div>
        <div className=" w-[30%]">
          <div className="flex justify-end my-4">
            <InputField labelWidth={"40%"} label={"Remittance No"} />
          </div>
          <table className="border w-full">
            <thead>
              <tr className="border">
                <th>Description</th>
                <th>Value</th>
              </tr>
            </thead>
            <thead>
              <tr>
                <td>LC Amount</td>
                <td>Value</td>
              </tr>

              <tr>
                <td>Commission Amount</td>
                <td>Value</td>
              </tr>
              <tr>
                <td>Transaction Reference</td>
                <td>Value</td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
}

export default SaloneLinkSend;
