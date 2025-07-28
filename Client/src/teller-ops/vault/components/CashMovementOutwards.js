import React, { useEffect, useState } from "react";
import ActionButtons from "../../../../../components/others/action-buttons/ActionButtons";
import AccountSummary from "../../../../../components/others/AccountSummary";
import InputField from "../../components/inputField";
import axios from "axios";
import ListOfValue from "../../components/ListOfValue";
import TextAreaField from "../../components/TextArea";
import SelectField from "../../components/SelectField";

// import TextAreaField from "../../../../../components/others/Fields/TextArea";

// import SelectField from "../../../../../components/others/Fields/SelectField";
import { API_SERVER } from "../../../../../config/constant";
// import TextAreaField from "../../components/TextArea";
import swal from "sweetalert";
import Swal from "sweetalert2";
import "../../../../../components/others/Fields/index.css";
// import GlobalModal from "../../components/Denominations";
// import SweetAlert from "../../../../components/others/SweetAlert";
import VaultDenominations from "./../../components/VaultDenominations";
import Header from "../../../../../components/others/Header/Header";
const headers = {
  // "x-api-key": process.env.REACT_APP_API_KEY,
  "x-api-key":
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "Content-Type": "application/json",
};

function CashMovementOutwards() {
  const [globalBranch, setGlobalBranch] = useState(
    JSON.parse(localStorage.getItem("userInfo")).branchCode
  );
  const [postingDate, setPostingDate] = useState(
    JSON.parse(localStorage.getItem("userInfo")).postingDate
  );
  const [tellerName, setTellerName] = useState(
    JSON.parse(localStorage.getItem("userInfo")).id
  );
  const [terminal, setTerminal] = useState(localStorage.getItem("ipAddress"));
  const [batchNo, setBatchNo] = useState("");
  const [allBranches, setAllBranches] = useState([]);
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [currencyCode, setCurrencyCode] = useState("");
  const [accountClassCode, setAccountClassCode] = useState("");
  const [tellerAccountDetails, setTellerAccountDetails] = useState([]);
  const [tellerContraDetails, setTellerContraDetails] = useState("");
  const [narration, setNarration] = useState("");
  const [accountDetails, setAccountDetails] = useState([]);
  const [amount, setAmount] = useState("");
  const [correspondingBranchCode, setCorrespondingBranchCode] = useState("");
  const [denominationsModal, setDenominationsModal] = useState(false);
  const [denominationEntries, setDenominationEntries] = useState([]);
  const [prevAmount, setPrevAmount] = useState("");
  const [toggle, setToggle] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [
    tellerAccountDetailsErrorMessage,
    setTellerAccountDetailsErrorMessage,
  ] = useState("");
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [narrationErrorMessage, setNarrationErrorMessage] = useState("");
  const [
    corrrespondingBranchCodeErrorMessage,
    setCorrrespondingBranchCodeErrorMessage,
  ] = useState("");
  const [amountLessThanZeroMessage, setAmountLessThanZeroMessage] =
    useState("");
  const [amountLessThanState, setAmountLessThanState] = useState(false);
  const [denominationState, setRunDenominationState] = useState(false);
  const [okErrorAlert, setOkErrorAlert] = useState(false);
  const [okErrorAlert2, setOkErrorAlert2] = useState(false);
  const [okErrorAlert3, setOkErrorAlert3] = useState(false);
  const [okErrorAlert4, setOkErrorAlert4] = useState(false);

  // account class data
  const accountClassData = [
    { value: "STA", label: "STA - Transit Account" },
    { value: "CBC", label: "CBC - Central Bank" },
  ];

  useEffect(() => {
    //  get amount error when it is less than or equal to 0
    const getErrorAlertForAmount = axios.post(
      API_SERVER + "/api/get-error-message",
      { code: "00019" },
      { headers }
    );
    getErrorAlertForAmount.then((response) => {
      if (Object.keys(response.data).length > 0) {
        setAmountLessThanZeroMessage(response.data);
        // setTellerAccountDetailsErrorMessage(response.data);
        // setOkErrorAlert(!okErrorAlert);
      }
    });

    const currencyArray = [];
    const branchArray = [];

    const batchNo = axios.get(API_SERVER + "/api/get-unique-ref", { headers });
    batchNo.then((response) => {
      console.log(response.data, "batch");
      setBatchNo(response.data[0].unique_ref);
    });

    const allLOVs = axios.post(
      API_SERVER + "/api/get-cash-movement-outwards-lovs",
      {
        currency: "currency",
        global_branch: globalBranch,
      },
      { headers }
    );

    allLOVs.then((response) => {
      console.log(response.data, "data here");
      // currency
      response?.data[0]["currency"]?.map((i) => {
        currencyArray.push({
          value: `${i.currency_code}`,
          label: `${i.currency_code} - ${i.iso_code} `,
        });
      });

      // branch
      response?.data[0]["branch"]?.map((i) => {
        branchArray.push({
          value: `${i.br_code}`,
          label: `${i.br_code} - ${i.br_description} `,
        });
      });
    });

    setAllCurrencies(currencyArray);
    setAllBranches(branchArray);
  }, []);

  // get new batch number
  const getNewBatchNo = () => {
    const batchNo = axios.get(API_SERVER + "/api/get-unique-ref", { headers });
    batchNo.then((response) => {
      console.log(response.data, "batch");
      setBatchNo(response.data[0].unique_ref);
    });
  };

  // // setting date
  // const date = new Date();
  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, "0");
  // const day = String(date.getDate()).padStart(2, "0");
  // const formattedDate = `${year}-${month}-${day}`;

  // // setting date 2
  // const date2 = new Date();
  // const year2 = date2.getFullYear();
  // const months2 = [
  //   "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  //   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  // ];
  // const monthIndex = date.getMonth();
  // const month2 = months2[monthIndex];
  // const day2 = String(date2.getDate()).padStart(2, "0");

  // const formattedDate2 = `${day2}-${month2}-${year2}`;

  // get debit account , account name  and teller contra
  useEffect(() => {
    const getTellerAccount = axios.post(
      API_SERVER + "/api/get-vault-account-and-name",
      { account_class: accountClassCode, currency_code: currencyCode },
      { headers }
    );
    getTellerAccount.then((response) => {
      if (response.data.length > 0) {
        setTellerAccountDetails(response.data[0]);
      } else {
        setTellerAccountDetails("");
        setTellerContraDetails("");
        setNarration("");
      }
    });
  }, [currencyCode, accountClassCode]);

  useEffect(() => {
    // get contra number and name
    const getTellerContra = axios.post(
      API_SERVER + "/api/get-vault-contra-and-contra-name",
      { teller_name: tellerName, currency_code: currencyCode },
      { headers }
    );
    getTellerContra.then((response) => {
      if (response.data.length > 0) {
        setTellerContraDetails(response.data[0]);
        setNarration("SPICE MOVEMENT");
        console.log(response.data, "derrick");
      } else {
        setTellerAccountDetails("");
        setTellerContraDetails([]);
        setNarration("");
      }
    });
  }, [accountDetails]);

  // onKeydown on amount
  const handleAmount = (e) => {
    if (e.key === "Enter") {
      const formattedNumber = parseFloat(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      if (isNaN(formattedNumber.replace(/,/g, ""))) {
        Swal.fire({
          title: "Sorry",
          text: "Enter a valid amount",
          icon: "error",
          allowOutsideClick: false,
          heightAuto: false,
          // width: "300px",
          // customClass: "custom-swal-modal",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        });
        // swal("Sorry", "Enter a valid amount", "warning");
        setAmount("");
      } else if (amount <= 0 || amount <= parseFloat("0")) {
        setAmountLessThanState(!amountLessThanState);

        // swal({
        //   title: "Error",
        //   text: amountLessThanZeroMessage,
        //   icon: "error",
        //   allowOutsideClick: false,
        //   heightAuto: false,
        //   width: '300px',
        //   customClass: 'custom-swal-modal',
        //   showCancelButton: false,
        //   showConfirmButton: true,
        //   confirmButtonText: 'Ok',
        // })
        // swal("Sorry", "Enter a valid amount", "warning");
        // setAmount("");
      } else {
        setAmount(formattedNumber);
        setDenominationsModal(true);
      }
      console.log(formattedNumber, "format");
    }
  };

  // amount less than 0 or equal to zero alert
  useEffect(() => {
    if (amountLessThanState) {
      if (amount <= 0 || amount <= parseFloat("0")) {
        Swal.fire({
          title: "Error",
          text: amountLessThanZeroMessage,
          icon: "error",
          allowOutsideClick: false,
          heightAuto: false,
          // width: "300px",
          // customClass: "custom-swal-modal",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            setAmountLessThanState(false);
          }
        });
      }
    }

    setAmount("");
  }, [amountLessThanState]);

  // handle NewClick
  const handleNewClick = () => {
    setTellerAccountDetails("");
    setTellerContraDetails("");
    setAccountClassCode("");
    setCurrencyCode("");
    setNarration("");
    setCorrespondingBranchCode("");
    setAmount("");
    setPrevAmount("");
  };

  // error sweet alerts
  useEffect(() => {
    if (okErrorAlert) {
      if (Object.keys(tellerAccountDetails).length === 0) {
        Swal.fire({
          text: "Error",
          text: okErrorAlert ? tellerAccountDetailsErrorMessage : "",
          icon: "warning",
          allowOutsideClick: false,
          heightAuto: false,
          // width: "300px",
          // customClass: "custom-swal-modal",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then((result) => {
          // Call handleOkayClick when the "Okay" button is clicked
          if (result.isConfirmed) {
            setOkErrorAlert(false);
            handleNewClick();
          }
        });
      }
    }
  }, [okErrorAlert]);

  useEffect(() => {
    if (okErrorAlert2) {
      if (narration === "") {
        Swal.fire({
          text: "Error",
          text: okErrorAlert2 ? narrationErrorMessage : "",
          icon: "warning",
          allowOutsideClick: false,
          heightAuto: false,
          // width: "300px",
          // customClass: "custom-swal-modal",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then((result) => {
          // Call handleOkayClick when the "Okay" button is clicked
          if (result.isConfirmed) {
            setOkErrorAlert2(false);

            // handleNewClick();
          }
        });
      }
    }
  }, [okErrorAlert2]);

  useEffect(() => {
    if (okErrorAlert3) {
      if (
        amount === "" ||
        amount <= 0 ||
        prevAmount === "" ||
        prevAmount <= 0
      ) {
        Swal.fire({
          text: "Error",
          text: okErrorAlert3 ? amountErrorMessage : "",
          icon: "warning",
          allowOutsideClick: false,
          heightAuto: false,
          // width: "300px",
          // customClass: "custom-swal-modal",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then((result) => {
          // Call handleOkayClick when the "Okay" button is clicked
          if (result.isConfirmed) {
            setOkErrorAlert3(false);
            // setDenominationsModal(true);

            // handleNewClick();
          }
        });

        // const input = document.getElementById("amount");
        // input.focus();
      }
    }
  }, [okErrorAlert3]);

  useEffect(() => {
    if (okErrorAlert4) {
      if (correspondingBranchCode === "") {
        Swal.fire({
          text: "Error",
          text: okErrorAlert4 ? corrrespondingBranchCodeErrorMessage : "",
          icon: "warning",
          allowOutsideClick: false,
          heightAuto: false,
          // width: "300px",
          // customClass: "custom-swal-modal",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then((result) => {
          // Call handleOkayClick when the "Okay" button is clicked
          if (result.isConfirmed) {
            setOkErrorAlert4(false);

            // handleNewClick();
          }
        });
      }
    }
  }, [okErrorAlert4]);

  // handle okay click
  const handleOkClick = () => {
    if (accountClassCode === "" || currencyCode === "") {
      Swal.fire({
        // text: "Error",
        text: "All fields with asterisk are required",
        icon: "info",
        allowOutsideClick: false,
        heightAuto: false,
        // width: "300px",
        // customClass: "custom-swal-modal",
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "Ok",
      }).then((result) => {
        // Call handleOkayClick when the "Okay" button is clicked
        if (result.isConfirmed) {
        }
      });
    } else if (Object.keys(tellerAccountDetails).length === 0) {
      const errorCode = axios.post(
        API_SERVER + "/api/get-error-message",
        { code: "05795" },
        { headers }
      );
      errorCode.then((response) => {
        if (Object.keys(response.data).length > 0) {
          setTellerAccountDetailsErrorMessage(response.data);
          setOkErrorAlert(!okErrorAlert);
        }
      });
    } else if (narration === "") {
      const errorCode = axios.post(
        API_SERVER + "/api/get-error-message",
        { code: "02064" },
        { headers }
      );
      errorCode.then((response) => {
        if (Object.keys(response.data).length > 0) {
          setNarrationErrorMessage(response.data);
          setOkErrorAlert2(!okErrorAlert2);
        }
      });
    } else if (amount === "") {
      const alertDenominations = axios.post(
        API_SERVER + "/api/get-error-message",
        { code: "05792" },
        { headers }
      );
      alertDenominations.then((response) => {
        setAmountErrorMessage(response.data);
        setOkErrorAlert3(!okErrorAlert3);
      });
    } else if (amount <= 0 || amount <= parseFloat("0")) {
      setAmountLessThanState(!amountLessThanState);
    } else if (
      amount != prevAmount ||
      parseFloat(amount) != parseFloat(prevAmount)
    ) {
      const input = document.getElementById("amount");
      input.focus();

      Swal.fire({
        text: "Error",
        text: "Specified Amount Is Not Equal To Denominations",
        icon: "warning",
        allowOutsideClick: false,
        heightAuto: false,
        // width: "300px",
        // customClass: "custom-swal-modal",
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "Ok",
      }).then((result) => {
        // Call handleOkayClick when the "Okay" button is clicked
        if (result.isConfirmed) {
          // handleNewClick();
          setPrevAmount("");
          setAmount("");
        }
      });
    } else if (correspondingBranchCode === "") {
      const alertDenominations = axios.post(
        API_SERVER + "/api/get-error-message",
        { code: "05794" },
        { headers }
      );
      alertDenominations.then((response) => {
        setCorrrespondingBranchCodeErrorMessage(response.data);
        setOkErrorAlert4(!okErrorAlert4);
      });
    } else if (Object.keys(tellerAccountDetails).length > 0) {
      setRunDenominationState(!denominationState);

      const submittedProcedure = axios.post(
        API_SERVER + "/api/prc-cash-movement-outward",
        {
          accountNumber: tellerAccountDetails?.acct_link,
          amount: amount,
          value_date: "",
          chanel: "BRA",
          voucher_num: "",
          posted_by: tellerName,
          approved_by: tellerName,
          terminal: terminal,
          // branch: mainBranch,
          branch: correspondingBranchCode,
          trans_code: "",
          exchange_rate: "",
          batchNo: batchNo,
          trans_desc: narration.trim(),
          approval_flag: "Y",
          document_ref: "",
          src_fund: "",
          narration: narration.trim(),
          trans_ref: "",
          form_code: "TTTH",
        },
        { headers }
      );

      submittedProcedure.then((response) => {
        if (Object.keys(response.data).length > 0) {
          console.log({ response }, "new response");
          Swal.fire({
            text: "success",
            text: `Transaction successfully saved with Transaction No. ${batchNo}`,
            icon: "success",
            allowOutsideClick: false,
            heightAuto: false,
            // width: "300px",
            // customClass: "custom-swal-modal",
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "Ok",
          }).then((result) => {
            // Call handleOkayClick when the "Okay" button is clicked
            if (result.isConfirmed) {
              handleNewClick();
              getNewBatchNo();
            }
          });
        }
      });
    }
  };
  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2 });
    return formatted;
  }
  const handleOnBlurOnAmount = () => {
    if (!amount.includes(",")) {
      if (!(amount === "")) {
        setAmount(formatNumber(parseFloat(amount)));
      }
    }
    if (amount === "" || amount <= 0 || amount <= parseFloat("0")) {
      return;
    } else {
      setDenominationsModal(true);
    }
    // if (
    //   (amount <= 0 && prevAmount <= 0) ||
    //   (amount <= parseFloat("0") && prevAmount <= parseFloat("0"))
    // ) {
    //   setAmountLessThanState(!amountLessThanState);
    // } else if (
    //   amount != prevAmount ||
    //   parseFloat(amount) != parseFloat(prevAmount)
    // ) {

    // }
  };

  // setting previous amount
  useEffect(() => {
    if (denominationsModal === true) {
      setPrevAmount(amount);
    }
  }, [denominationsModal]);

  // alert when amount is empty for denominations
  useEffect(() => {
    if (amount === "") {
      const alertDenominations = axios.post(
        API_SERVER + "/api/get-error-message",
        { code: "05792" },
        { headers }
      );
      alertDenominations.then((response) => {
        setErrorMessage(response.data);
      });
    }
  }, [correspondingBranchCode]);

  // booooom
  // useEffect(() => {
  //   const postedTransaction = axios.post(API_SERVER + "/api/get-error-message", { code: "00019" }, { headers });
  //   postedTransaction.then((response) => {
  //     setSuccessMessage(response.data);
  //   }
  //   )

  // }, [denominationState]);

  useEffect(() => {
    if (amount === "" && correspondingBranchCode !== "") {
      const input = document.getElementById("amount");
      input.focus();

      Swal.fire({
        text: "Error",
        text: errorMessage,
        icon: "info",
        allowOutsideClick: false,
        heightAuto: false,
        width: "300px",
        customClass: "custom-swal-modal",
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "Ok",
      }).then((result) => {
        // Call handleOkayClick when the "Okay" button is clicked
        if (result.isConfirmed) {
        }
      });
    }
  }, [correspondingBranchCode]);

  return (
    <div className="scale-[0.85] p-2 -mx-[9%]  -mt-[4%] -mb-[3%] ">
      <div className="mb-4">
        <ActionButtons
          displayAuthorise={"none"}
          displayRefresh={"none"}
          displayReject={"none"}
          displayView={"none"}
          displayDelete={"none"}
          displayHelp={"none"}
          displayFetch={"none"}
          displayCancel={"none"}
          onNewClick={handleNewClick}
          onOkClick={handleOkClick}
        />
      </div>

      {/* denominations modal */}
      <div>
        <VaultDenominations
          showModal={denominationsModal}
          setSuccess={setSuccessState}
          setShowModal={() => setDenominationsModal(false)}
          setDenominationEntries={setDenominationEntries}
          checked={toggle}
          amount={amount}
          setAmount={setAmount}
          transType={"O"}
          prevAmount={prevAmount}
          setPrevAmount={setPrevAmount}
          username={tellerName ? tellerName : ""}
          currency_code={currencyCode}
          vault_account={
            tellerContraDetails ? tellerContraDetails.contra_account : ""
          }
          accountNumber={
            tellerAccountDetails ? tellerAccountDetails.acct_link : ""
          }
          batchNo={batchNo}
          // postingDate={""}
          mainBranch={globalBranch}
          runDenominationState={denominationState}
          teller_contra={
            tellerContraDetails ? tellerContraDetails.contra_account : ""
          }

          // runProcedure={handleDenominationsProcedure}
        />
      </div>
      <header className="text-gray-600 bg-[#daecfe]  py-1  font-semibold px-2 uppercase">
        Cash Movement Outward
      </header>
      {/* <Header title={"Cash Movement Outward"} /> */}
      <div className=" pt-1 mb-2">
        <div className="flex space-x-3 border-2 rounded p-2 ">
          <div className=" w-[65%] px-3  pt-3 pb-3">
            <div className="space-y-2">
              <SelectField
                label={"Account Class"}
                labelWidth={"22%"}
                inputWidth={"30%"}
                required={true}
                onChange={(value) => {
                  setAccountClassCode(value);
                }}
                value={accountClassCode}
                data={accountClassData}
              />
              <ListOfValue
                label={"Specie Currency"}
                labelWidth={"22%"}
                inputWidth={"30%"}
                required={true}
                onChange={(value) => {
                  setCurrencyCode(value);
                  // console.log(value)
                }}
                value={currencyCode}
                data={allCurrencies}
              />
            </div>
            {/* <div className="mt-4"></div> */}
            <div className="space-y-2">
              <div
                className="mt-6"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  background: "",
                }}
              >
                <div style={{ flex: 0.08 }}> &nbsp; </div>
                <div style={{ flex: 0.5, paddingLeft: "", background: "" }}>
                  <InputField
                    label={"Debit Account"}
                    labelWidth={"28.8%"}
                    inputWidth={"62%"}
                    required={true}
                    // readOnly={true}
                    disabled={true}
                    value={
                      tellerAccountDetails ? tellerAccountDetails.acct_link : ""
                    }
                  />
                </div>

                <div style={{ flex: 0.44, background: "" }}>
                  <InputField
                    noMarginRight={true}
                    inputWidth={"95%"}
                    disabled={true}
                    value={
                      tellerAccountDetails
                        ? tellerAccountDetails.account_desc
                        : ""
                    }
                  />
                </div>
              </div>

              <InputField
                id={"tellerContra"}
                labelWidth={"22%"}
                inputWidth={"30%"}
                label={"Teller Contra"}
                disabled={true}
                value={
                  tellerContraDetails ? tellerContraDetails.contra_account : ""
                }
              />
            </div>

            <div className="space-y-2 mt-6">
              <InputField
                id={"amount"}
                labelWidth={"22%"}
                inputWidth={"30%"}
                label={"Amount"}
                required={true}
                textAlign={"right"}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^[0-9]*(?:\.[0-9]*)?$/.test(inputValue)) {
                    setAmount(inputValue);
                  } else if (inputValue?.includes(",")) {
                    setAmount(inputValue.replaceAll(",", ""));
                  }
                }}
                value={amount}
                type={"text"}
                onBlur={handleOnBlurOnAmount}
                onKeyPress={handleAmount}
                // type={"number"}
              />

              <TextAreaField
                labelWidth={"24%"}
                id={"narration2"}
                inputWidth={"82%"}
                label={"Narration"}
                required={true}
                inputheight={"25px"}
                onChange={(e) => setNarration(e.target.value.toUpperCase())}
                value={narration}
              />

              <ListOfValue
                labelWidth={"22%"}
                inputWidth={"30%"}
                id={"correspondingBranch"}
                label={"Corresponding Branch"}
                onChange={(value) => {
                  setCorrespondingBranchCode(value);
                }}
                value={correspondingBranchCode}
                required={true}
                data={allBranches}
              />
            </div>
          </div>

          <div className="w-[35%] ">
            <div className="border-2 rounded">
              <AccountSummary
                accountNumber={
                  tellerAccountDetails ? tellerAccountDetails.acct_link : ""
                }
                setAccountDetails={setAccountDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashMovementOutwards;
