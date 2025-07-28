
//Ivans salary upload
import React, { useEffect, useState } from "react";
import { Modal, MantineProvider } from "@mantine/core";
import { AiOutlineEye } from "react-icons/ai";
import { BiUpload } from "react-icons/bi";
import { BiDownload } from "react-icons/bi";
import ButtonComponent from "../src/Components/others/Button/ButtonComponent";

import InputField from "../src/Components/others/Fields/InputField";
import ButtonType from "../src/Components/others/Button/ButtonType";
import ActionButtons from "../src/Components/others/action-buttons/ActionButtons";
import ButtonWColor from "./Components/button";
import axios from "axios";
import { API_SERVER } from "./config/constant";
import { Notifications } from "@mantine/notifications";
import swal from "sweetalert";
import notify from "./config/notification";
import { read, utils } from "xlsx";
import excelFile from "./Components/excelFiles/general salary upload(No Fees).xlsx";
import Header from "./Components/others/Header/Header";

import { checkInternetConnection } from "./Components/checkConnection";
import TableLoader from "./Components/loader";

import GlobalModal from "./Components//modal";
import CustomTable from "./teller-ops/components/CustomTable";
import DocumentViewing from "../src/Components/others/DocumentViewing"

function CheckOffs() {
  // const [getTheme, setTheme] = useState(
  //   JSON.parse(localStorage.getItem("theme"))
  // );
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  // states
  const [debitAccount, setDebitAccount] = useState("");
  // const [userDetails, setUserDetails] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [userAvailableBalance, setAvailableBalance] = useState("");
  const [getBatchNumber, setBatchNumber] = useState("");
  const [sweetAlertConfirmed, setSweetAlertConfirmed] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const [tableLoader2, setTableLoader2] = useState(false);


  const [documentNumber, setDocumentNumber] = useState("");
  // const [colDefs, setColDefs] = useState();
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [columns, setColumns] = useState([
    "Pin",
    "Account Number",
    "Account Description",
    "Credit Amount",

    "Branch",
  ]);
  const [NoOfTransactions, setNoOfTransactions] = useState(0);
  const [TransactionAmount, setTransactionAmount] = useState(0);
  const [InvalidAccountNo, setInvalidAccountNo] = useState(0);
  const [ValidAccountNo, setValidAccountNo] = useState(0);
  const [CurrencyMismatchNo, setCurrencyMismatchNo] = useState(0);
  const [NonNormalAccountNo, setINonNormalAccountNo] = useState(0);
    const [DuplicateAccountNo, setDuplicateAccountNo] = useState(0);

  const [ViewExceptionsModal, setViewExceptionsModal] = useState(false);
  const [InvalidAccountsModal, setInvalidAccountModal] = useState(false);
  const [CurrencyMismatchModal, setCurrencyMismatchModal] = useState(false);
  const [NonNormalModal, setNonNormalModal] = useState(false);
  const [accountWithExceptionsData, setAccountWithExceptionsData] = useState([]);
  const [InvalidAccountData, setInvalidAccountData] = useState([]);
  const [CurrencyMismatchData, setCurrencyMismatchData] = useState([]);
  const [NonNormalModalData, setNonNormalModalData] = useState([]);
  const [showModal1, setShowModal1] = useState(false);
  const [form, setForm] = useState("");
  const [modalKey, setModalKey] = useState("");
  const [currencyCode, setCurrencyCode] = useState("010");
  const [confirmNofTransactionsFlag, setNoOfTransactionsFlag] = useState(false);
  const [confirmTransAmount, setConfirmTransAmount] = useState(false);
  const [debitNarration, setDebitNarration] = useState("");
  const [creditNarration, setCreditNarration] = useState("");
  const [openModalFlag, setOpenModalFlag] = useState(false)

  // const [showModal, setShowModal] = useState(false);
  // const EXTENSIONS = ["xlsx", "xls", "csv"];

  // format numbers
  function formatNumber(num) {
    const formatted = Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });
    return formatted;
  }

  // handle new btn click
  function handleNewBtnClick() {
    setDebitAccount("");
    setAvailableBalance("");
    setDebitAccount("");
    setDocumentNumber("");
    setTableData([]);
    setData([]);
    setAccountName("");
    setResponseData([]);
    setNoOfTransactions("0");
    setTransactionAmount("0");
    setInvalidAccountNo(0);
    setValidAccountNo(0);
    setCurrencyMismatchNo(0);
    setInvalidAccountNo(0);
    setNoOfTransactionsFlag(false);
    setConfirmTransAmount(false);
    setDebitNarration("");
    setCreditNarration("");
    setModalKey("");
    setINonNormalAccountNo(0);
    // Fetch new batch number
    fetchBatchNumber();
  }

  const handleExitClick = () => {
    if (document.getElementById("exitBTN1")) {
      const exitBTN = document.getElementById("exitBTN1");
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      exitBTN.dispatchEvent(clickEvent);
    }
};
  useEffect(() => {
    if (showModal1 && form === "Accounts With Exceptions") {
      handleNewBtnClick();
    }
  }, [showModal1, form]);
  function AcctExceptions() {
    axios
      .post(
        API_SERVER + "/api/salary-upload",
        {
          key: "AccountsWithExceptions",
          batchNumber: getBatchNumber,
          
        },
        {
          headers,
        }
      )
      .then(function (response) {
        if (response.data?.responseCode === "000") {
          if (response.data?.data.length !== 0) {
            // setAccountWithExceptionsData(response.data.data);
            // setOpenModalFlag(true);
            setShowModal1(true);
            setForm("Accounts With Exceptions");
            // handleNewBtnClick();
          } else {
            handleNewBtnClick();
          }
        } else {
          swal({
            title: "Error",
            text: response.data?.responseMessage,
            icon: "error",
            buttons: "OK",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  }
  
  function callPrc (){
    setTableLoader2(true);
    let userInfo = {};
    try {
      userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      userInfo = {};
    }
    axios
    .post(
      API_SERVER + "/api/salary-upload",
      {
        batchNumber : getBatchNumber,
        accountNumber : debitAccount,
        postedBy: userInfo.id || "",
        branchCode: userInfo.branchCode || "",
        debitNarration: debitNarration,
        creditNarration: creditNarration,
        scanDoc: documentNumber ? documentNumber : null,
        transCode:"FTR",
        terminalId: localStorage.getItem("ipAddress"),
        formCode: "CHQQ",
        allow_dup:"N"
      },
      {
        headers
      }
    ).then (function (response){
      setTableLoader2(false);
       if (response.data?.responseCode === "000")
       {
        swal({
          title: "Success",
          text: `Data Successfully Uploaded With Batch No -${getBatchNumber} Pending Approval`,
          icon: "success",
          buttons: "OK"
        }).then((result) => {
        if (result) 
        {
          // console.log("result");
          AcctExceptions();
          // setShowModal1(true);
          // setForm("Accounts With Exceptions");
          // handleNewBtnClick();
           }});
       }else {
          swal({
        title: "Error",
        text: response.data?.responseMessage,
        icon: "error",
        buttons: "OK",
      });
       }
    }).catch((err) => {
      console.log(err);
    }).finally(() => {})
  };
  async function handleSubmit() {
    if (
      debitAccount === "" ||
      debitNarration === "" ||
      tableData.length === 0 ||
      // tableData === []||
      creditNarration === "" ||
      confirmNofTransactionsFlag === false ||
      confirmTransAmount === false
    ) {
      // notify.warn({
      //       title: "Kindly Fill all required fields",
      //       message: "All Fields with asterisk are required",
      //       id: "All Fields with asterisk are required",
      //     });
      swal({
        title: "Warning",
        text: "All Fields with asterisk are required",
        icon: "warning",
        buttons: "OK",
      });
     
    } 
    else if(TransactionAmount>userAvailableBalance){
      swal({
        title: "Warning",
        text: "Funds are Not Suffucient to Carry out Transaction",
        icon: "warning",
        buttons: "OK",
      });
      
    } 
    else {
      if(CurrencyMismatchNo ||InvalidAccountNo || NonNormalAccountNo > 0 ){
        swal({
          title: "Warning",
          text: "Accounts With Exceptions Exit, Do you want To Proceed",
          icon: "warning",
          buttons: true,
        }).then((result) => {
          if (result){
            callPrc();
          }
          });
        
      } else {
        callPrc();
      } 
     
     
    }
  }
  
  // Debug function to log data - moved to prevent render-time errors
  const logDebugData = () => {
    let userInfo = {};
    try {
      userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      userInfo = {};
    }
    console.log({ batchNumber : getBatchNumber,
      accountNumber : debitAccount,
      postedBy: userInfo.id || "",
      branchCode: userInfo.branchCode || "",
      debitNarration: debitNarration,
      creditNarration: creditNarration,
      scanDoc: documentNumber ? documentNumber : null,
      transCode:"FTR",
      terminalId: localStorage.getItem("ipAddress"),
      formCode: "CHQQ",
      allow_dup:"N"});
  };

  // Function to fetch batch number
  function fetchBatchNumber() {
    axios
      .get(API_SERVER + "/api/get-unique-ref", {
        headers: headers,
      })
      .then(function (response) {
        setBatchNumber(response.data[0]?.unique_ref);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Get Batch Number on component mount
  useEffect(() => {
    fetchBatchNumber();
  }, []);

  // useEffect(()=> {
  //   openModalFlag ? setShowModal1(true) : setOpenModalFlag(false)
  // }, [openModalFlag])

  // Move to nextField
  function switchFocus(e, nextFieldId) {
    if (e.key === "Enter") {
      document.getElementById(nextFieldId).focus();
    }
  }

  // On Enter of Debit Account
  const onEnterDebitAccount = async (e) => {
    if (e.key === "Enter") {
      // Check internet connection if needed
      // await checkInternetConnection();
  
      try {
        const response = await axios.post(
          API_SERVER + "/api/get-account-summary",
          {
            account_number: debitAccount.trim(),
            transType: "teller",
          },
          { headers }
        );
  
        if (response.data.summary.length > 0) {
          const accountStatus = response.data.summary[0].account_status;
          const responseErrorMessage = await axios.post(
            API_SERVER + "/api/get-error-message",
            { code: "06743" },
            { headers }
          );
        //  console.log(accountStatus);
          if (accountStatus === 'CLOSED' || accountStatus === 'DORMANT' || accountStatus === 'ACCOUNT CLOSED') {
            const errorMessage = responseErrorMessage.data.replace('v_acctdesc', accountStatus === 'CLOSED' ? 'ACCOUNT CLOSED' : 'DORMANT');
  
            swal({
              title: "Warning",
              text: errorMessage,
              icon: "warning",
              buttons: "OK",
              dangerMode: true,
            }).then((result) => {
              if (result) {
                // Do something if needed
              }
            });
          } else {
            console.log(response.data.summary[0].availabe_balance);
            setAccountName(response.data.summary[0].account_name);
            setAvailableBalance(response.data.summary[0].availabe_balance);
  
            // Focus on the ScanDoc input
            var input = document.getElementById("ScanDoc");
            input.focus();
          }
        } else {
          swal({
            title: "ERROR",
            text: "Invalid Account Number",
            icon: "warning",
            buttons: "OK",
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  
  
  
  // attach/ view doc function
  function handleClick() {
    if (documentNumber === "") {
      swal({
        title: "ERR - 01346",
        text: "A Valid Document ID is required",
        icon: "warning",
        buttons: "OK",
      }).then((result) => {
        if (result) {
        }
      });
    } else {
      setSweetAlertConfirmed(true);
    }
  }

  // generate excel file
  const downloadExcelFile = () => {
    const link = document.createElement("a");
    link.href = excelFile;
    link.download = "excelTemplate.xlsx";
    link.click();
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target.result;
      const workbook = read(bstr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const newData = utils.sheet_to_json(worksheet);
      setData(newData);
    };
    reader.readAsBinaryString(selectedFile);
  };
  useEffect(() => {
    // Debounce the API call for better performance
    // const debounceTimeout = setTimeout(() => {
    if (data.length !== 0) {
      setTableLoader(true);
      let userInfo = {};
      try {
        userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
        userInfo = {};
      }
      axios
        .post(
          API_SERVER + "/api/salary-upload",
          {
            key: "uploadNoFees",
            postedBy: userInfo.id || "",
            batchNumber: getBatchNumber,
            jsonData: data,
            currencyCode: currencyCode,
          },
          { headers: headers }
        )
        .then(function (response) {
          if (response.data?.responseCode === "999") {
            setTableLoader(false);

            swal({
              title: "Error",
              text: response.data?.responseMessage,
              icon: "error",
              buttons: "OK",
            });
          } else {
            // Store the response data in the `responseData` state
            // console.log(response.data,"::::data");
            setValidAccountNo(response.data.data[0]?.validAccounts);
            setInvalidAccountNo(response.data.data[0]?.invalidAccounts);
            setCurrencyMismatchNo(response.data.data[0]?.CurrencyMismatchesAccounts);
            setINonNormalAccountNo(response.data.data[0]?.notNormalAccounts);
            // setDuplicateAccountNo(response.data.data[0]?.DuplicateAccounts);
            
            setTableData(response?.data.data[1].map((row) => Object.values(row)));
            setTableLoader(false);
            // setResponseData(response?.data.data[1]);
            if (response?.data.data[1].length !== 0) {
              // setTableData(response?.data.data[1].map((row) => Object.values(row)));
              // Calculate the sum of the "CREDIT AMOUNT" column
              let sum = 0;
              response?.data.data[1].forEach((row) => {
                const columnValue = Number(row.CREDIT_AMOUNT);
                if (!isNaN(columnValue)) {
                  sum += columnValue;
                }
              });
              const roundedSum = Math.round(sum * 100) / 100;
              setTransactionAmount(roundedSum);
              setNoOfTransactions(response?.data.data[1].length);
            }
            
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTableLoader(false);
        });
    }
    // }, 500); // Adjust the debounce delay as needed (e.g., 500ms)

    // return () => clearTimeout(debounceTimeout);
  }, [data]);

  // useEffect(() => {
  //   if (responseData.length !== 0) {
  //     // setTableData(response?.data.data[1].map((row) => Object.values(row)));
  //     // Calculate the sum of the "CREDIT AMOUNT" column
  //     let sum = 0;
  //     responseData.forEach((row) => {
  //       const columnValue = Number(row.CREDIT_AMOUNT);
  //       if (!isNaN(columnValue)) {
  //         sum += columnValue;
  //       }
  //     });
  //     const roundedSum = Math.round(sum * 100) / 100;
  //     setTransactionAmount(roundedSum);
  //     setNoOfTransactions(responseData.length);
  //   }
  // }, [responseData]);

  const openFileExplorer = () => {
    // Create an input element of type "file"
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    // Set the accept attribute to only allow Excel files
    fileInput.accept = ".xlsx, .xls, .csv";
    // Add an event listener for file selection
    fileInput.addEventListener("change", handleFileSelect);
    // Simulate a click event on the file input element
    fileInput.click();
  };
// console.log({confirmNofTransactionsFlag});
  return (
    <MantineProvider>
      <div className="w-full h-full"style={{ zoom: 0.9 }}>
         {tableLoader2 && (
                    <div className="absolute top-0 left-0 z-10 h-full opacity-90 bg-white flex justify-center align-middle w-full">
                      <TableLoader />
                    </div>
                  )}
      {/* {ViewExceptionsModal && (
        <ViewExceptionsModalX
          showModal={ViewExceptionsModal}
          setShowModal={setViewExceptionsModal}

          //  setViewExceptions={setisViewExceptions}
        />
      )}
      {InvalidAccountsModal && (
        <InvalidAccountsModalX
          showModal={InvalidAccountsModal}
          setShowModal={setInvalidAccountModal}
          // InvalidAccountData={InvalidAccountData}
          // InvalidAccountNo={InvalidAccountNo}
        />
      )} */}
      <Notifications
        position={"top-center"}
        zIndex={99999999999999999999}
        limit={5}
      />
      <div>
        
        <div>
          <ActionButtons
            displayFetch={"none"}
            displayRefresh={"none"}
            displayDelete={"none"}
            displayCancel={"none"}
            displayAuthorise={"none"}
            displayView={"none"}
            displayReject={"none"}
            displayHelp={"none"}
            onNewClick={handleNewBtnClick}
            onOkClick={handleSubmit}
            onExitClick={handleExitClick}
            
          />
        </div>
        {/* Batch, Trans, Currency and View Exceptions */}
        <div
        style={{
          padding: "20px",
          border: "2px solid #dfdce6",
          borderRadius: "5px",
          // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          marginTop: "20px",
         
        }}
      >
        <div className="bg-white flex w-full px-4 justify-between pt-4">
          {/* Batch, Trans Desc and Currency */}

          <div className="flex ">
            {/* "w-[35%]" */}
            <span
              className="font-bold text-gray-500 pr-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Batch Number :
            </span>
            <span className="text-gray-400">{getBatchNumber}</span>
          </div>

          <div>
            <span
              className="font-bold text-gray-500 pr-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Trans Description :
            </span>
            <span className="text-gray-400">CHECK-OFF TRANSACTION</span>
          </div>

          <div>
            <span
              className="font-bold text-gray-500 pr-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Currency :
            </span>
            <span className="text-gray-400">KES-Kenya Shillings</span>
          </div>
 
          <div>
            <div>
              <button
                className="bg-black flex items-center justify-center space-x-1 text-gray-100 rounded px-3 py-[5.5px]"
                onClick={() => {
                  setShowModal1(true);
                  setForm("View Exceptions");
                  setModalKey("viewExceptionsFees");
                }}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9M15 2h2.5C19.99 2 22 4.01 22 6.5V9M22 16v1.5c0 2.49-2.01 4.5-4.5 4.5H16M9 22H6.5C4.01 22 2 19.99 2 17.5V15"
                    stroke="#FF8A65"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>

                <span>View Exceptions</span>
              </button>
            
              <GlobalModal
                showModal1={showModal1}
                setShowModal1={setShowModal1}
                setForm={setForm}
                modalKey={modalKey}
                form={form}
                batch={getBatchNumber}
                currency_CODE={currencyCode}
                // InvalidAccountData={InvalidAccountData}
              />
            </div>
          </div> 
        </div>

        <div></div>
      </div>

        <br />
        <div
          className=" h-auto pb-2 pt-2 px-2  bg-white space-x-2"
          style={{
            display: "flex",
            flex: 1,
          }}
        >
          <div
            style={{ width: "60%" }}
            className=" h-64 pb-2 pt-2 px-2  wrapper rounded border-2 border-gray-300"
          >
            <Header title={"Debit Account Details"} headerShade={true} />

            {/* Debit  Account Details */}
            <div
              className="mt-2"
              style={{
                display: "flex",

                backgroundColor: "",
              }}
            >
              <div className="w-full">
                {/* Debit Account */}
                <div className=" mb-2 flex items-center">
                  <InputField
                    id={"DebitAccount"}
                    label={"Debit Account"}
                    required={true}
                    labelWidth={"20%"}
                    inputWidth={"80%"}
                    onKeyDown={onEnterDebitAccount}
                    onChange={(e) => setDebitAccount(e.target.value)}
                    value={debitAccount}
                  />
                </div>
                {/* Contra Description */}
                <div className="w-full mb-2 flex items-center">
                  <InputField
                    id={"ContraDescription"}
                    label={"Contra Description"}
                    labelWidth={"19.4%"}
                    inputWidth={"78%"}
                    disabled={true}
                    value={accountName}
                  />
                </div>
                {/* Available Balance */}
                <div className="w-full mb-2 flex items-center">
                  <InputField
                    id={"AvailableBalance"}
                    label={"Available Balance"}
                    labelWidth={"19.4%"}
                    inputWidth={"78%"}
                    disabled={true}
                    textAlign={"right"}
                    defaultValue={"0.00"}
                    // value={userAvailableBalance ? (userAvailableBalance === "NaN" ? "" :formatNumber(userAvailableBalance )) : formatNumber(userAvailableBalance)}
                    value={userAvailableBalance?.trim()}
                    // value={formatNumber(userAvailableBalance)}
                  />
                </div>
                {/* Scan Doc & View Doc Button */}
                <div className="w-full mb-2 flex  space-x-2">
                  <div className="w-[70%]">
                    <InputField
                      id={"ScanDoc"}
                      label={"Scan Document"}
                      labelWidth={"29%"}
                      inputWidth={"70%"}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      onKeyDown={(e) => switchFocus(e, "DebitNarration")}
                    />
                  </div>
                  <div className="w-[30%]">
                    <ButtonComponent
                      buttonColor={"white"}
                      buttonWidth={"100%"}
                      label={"View Document"}
                      // labelWidth="25px"
                      onClick={() => handleClick()}
                    />
                    {/**modal section */}
                    {sweetAlertConfirmed && (
                      <Modal
                        size="70%"
                        opened={sweetAlertConfirmed}
                        onClose={() => setSweetAlertConfirmed(false)}
                        title={"Document Viewing"}
                      >
                        <DocumentViewing documentID={documentNumber} />
                      </Modal>
                      // 1683042691
                    )}
                  </div>
                </div>
                {/* Debit Narration */}
                <div className="w-full mb-2 flex items-center">
                  <InputField
                    id={"DebitNarration"}
                    label={"Debit Narration"}
                    labelWidth={"20%"}
                    inputWidth={"80%"}
                    required={true}
                    onChange={(e) => setDebitNarration(e.target.value)}
                    onKeyDown={(e) => switchFocus(e, "CreditNarration")}
                    value={debitNarration}
                  />
                  
                </div>
                <div
                  className="mb-2 mt-2"
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    marginLeft: "10px",
                    // marginRight: "10px",
                    marginTop: "10px",
                  }}
                >
                  <ButtonComponent
                    label={"Upload Excel"}
                    buttonColor={"white"}
                    buttonIcon={<BiUpload />}
                    buttonHeight={"25px"}
                    onClick={openFileExplorer}
                  />
                  <ButtonWColor
                    buttonIcon={<BiDownload />}
                    buttonColor={"white"}
                    label={"Generate Template"}
                    buttonHeight={"25px"}
                    buttonBackgroundColor={"green"}
                    onClick={downloadExcelFile}
                    // buttonColor={"green"}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ width: "100%", marginLeft: 10, marginRight: 10 }}
            className="h-auto  pb-2 px- 2 wrapper rounded border-2"
          >
            {/* Excel  */}
            <div style={{}}>
              <Header title={"Excel Transactions"} headerShade={true} />
              <div
                style={{ display: "flex", flex: 1, marginTop: "10px" }}
                className="space-x-2 ml-2 mr-2"
              >
                <div
                  style={{ width: "50%" }}
                  className="h-auto  pb-2 pt-2 px-2  wrapper rounded border-2"
                >
                  {/* Summary */}
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div className="w-full">
                      <Header title={"Summary"} headerShade={true} />
                      &nbsp;
                      {/* Valid & Invalid Accounts*/}
                      <div className="mb-2 flex items-center">
                        <InputField
                          label={"Valid Accounts"}
                          labelWidth={"27%"}
                          inputWidth={"73%"}
                          disabled={true}
                          value={ValidAccountNo}
                          textAlign={"right"}
                        />
                      </div>
                      {/* Invalid Accounts */}
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="w-[95%]">
                          <InputField
                            label={"Invalid Accounts"}
                            disabled={true}
                            labelWidth={"30%"}
                            inputWidth={"73%"}
                            value={InvalidAccountNo}
                            textAlign={"right"}
                          />
                        </div>
                        <div className="w-[5%]">
                          <ButtonComponent
                            buttonColor={"white"}
                            buttonIcon={<AiOutlineEye />}
                            buttonHeight={"25px"}
                            buttonWidth={"100%"}
                            onClick={() => {
                              setShowModal1(true);
                              setForm("Invalid Accounts");
                              setModalKey("invalidAccounts")
                            }}
                          />
                        </div>
                      </div>
                      {/* Currency mismatch */}
                      <div className="mb-2 flex items-center  space-x-2">
                        <div className="w-[95%]">
                          <InputField
                            label={"Currency Mismatches"}
                            disabled={true}
                            labelWidth={"28%"}
                            inputWidth={"69%"}
                            value={CurrencyMismatchNo}
                            textAlign={"right"}
                          />
                        </div>
                        <div className="w-[5%]">
                          <ButtonComponent
                            buttonWidth={"100%"}
                            buttonIcon={<AiOutlineEye />}
                            buttonColor={"white"}
                            buttonHeight={"25px"}
                            onClick={() => {
                              setShowModal1(true);
                              setForm("Currency Mismatches");
                              setModalKey("currencyMismatch");
                            }}
                          />
                        </div>
                      </div>
                      {/* Non - Normal */}
                      <div className="mb-2 flex items-center  space-x-2">
                        <div className="w-[95%]">
                          <InputField
                            label={"Non-Normal"}
                            disabled={true}
                            labelWidth={"30%"}
                            inputWidth={"73%"}
                            value={NonNormalAccountNo}
                            textAlign={"right"}
                          />
                        </div>



                       
                        
                        <div className="w-[5%]">
                          <ButtonComponent
                            buttonWidth={"100%"}
                            buttonIcon={<AiOutlineEye />}
                            buttonColor={"white"}
                            buttonHeight={"25px"}
                            onClick={() => {
                              setShowModal1(true);
                              setForm("Non Normal");
                              setModalKey("nonNormalModal");
                            }}
                          />
                        </div>
                      </div>
                       {/* Duplicates */}
                      {/* <div className="mb-2 flex items-center  space-x-2">
                      <div className="w-[95%]">
                          <InputField
                            label={"Duplicates"}
                            disabled={true}
                            labelWidth={"30%"}
                            inputWidth={"73%"}
                            value={DuplicateAccountNo}
                            textAlign={"right"}
                          />
                        </div>


                       
                        
                        <div className="w-[5%]">
                          <ButtonComponent
                            buttonWidth={"100%"}
                            buttonIcon={<AiOutlineEye />}
                            buttonColor={"white"}
                            buttonHeight={"25px"}
                            onClick={() => {
                              setShowModal1(true);
                              setForm("Non Normal");
                              setModalKey("nonNormalModal");
                            }}
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>

                
                {/* Confirm Transaction */}
                <div
                  style={{ width: "50%" }}
                  className="h-auto  pb-2 pt-2 px-2   wrapper rounded border-2"
                >
                  <div style={{ display: "flex" }}>
                    <div className="w-full">
                      <Header
                        title={"Confirm Transactions"}
                        headerShade={true}
                      />
                      &nbsp;
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="w-[5%]">
                          <ButtonType
                          
                            id={"NoOfTransactions"}
                            name={"myCheckBox"}
                            type={"checkbox"}
                            checked={confirmNofTransactionsFlag === true}
                            value1={confirmNofTransactionsFlag}
                            onChange={()=>{
                              setNoOfTransactionsFlag(!confirmNofTransactionsFlag)
                            }}
                            // value1={confirmNofTransactionsFlag ? "N" : "Y"}
                            
                          />
                          
                        </div>
                        {/* No of Transactions */}
                        <div className="w-[95%]">
                          <InputField
                            id={"NoTransactions"}
                            disabled={true}
                            label={"No of Transactions"}
                            labelWidth={"30%"}
                            inputWidth={"70%"}
                            value={NoOfTransactions}
                            textAlign={"right"}
                          />
                        </div>
                      </div>
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="w-[5%]">
                          <ButtonType
                            id={"TransactionAmount"}
                            type={"checkbox"}
                            checked={confirmTransAmount === true}
                             value1={confirmTransAmount}
                            onChange={()=>{
                              setConfirmTransAmount(!confirmTransAmount)
                            }}
                          />
                        </div>
                        {/* Transaction Amount */}
                        <div className="w-[95%]">
                          <InputField
                            id={"TransAmount"}
                            disabled={true}
                            label={"Transaction Amount"}
                            labelWidth={"30%"}
                            inputWidth={"70%"}
                            // formatNumber
                            value={formatNumber(parseInt(TransactionAmount))}
                            textAlign={"right"}
                          />
                        </div>
                      </div>
                      <div className="w-[100%]">
                        <InputField
                          id={"CreditNarration"}
                          label={"Credit Narration"}
                          required={"true"}
                          labelWidth={"36%"}
                          inputWidth={"67%"}
                          onChange={(e) => setCreditNarration(e.target.value)}
                          value={creditNarration}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          
        </div>

        <div className="pb-2 pt-2 px-2 mb-2 mt-2 relative">
                {tableLoader && (
                  <div className="absolute top-0 left-0 z-10 h-full opacity-90 bg-white flex justify-center align-middle w-full">
                    <TableLoader />
                  </div>
                )}
                <CustomTable
                  headers={columns}
                  data={tableData}
                  rowsPerPage={8}
                  style={{
                    headerAlignRight: [4],
                    headerAlignLeft:[3, 5],
                    columnAlignRight: [4],
                    columnFormat: [2],
                    columnAlignCenter: [1, 2],
                  }}
                />
              </div>
      </div>
    </div>
    </MantineProvider>
  );
}
export default CheckOffs;
