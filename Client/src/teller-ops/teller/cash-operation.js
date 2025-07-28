import { useEffect, useState, useRef, useContext } from "react";
// import ListOfValue from "../components/ListOfValue";
import ListOfValue from "../../../../components/others/Fields/ListOfValue";
import InputField from "../../../../components/others/Fields/InputField";
import CashWithdrawal from "./cash-withdrawal";
import CashDeposit from "./cash-deposit";
import ChequeDeposit from "./cheque-deposit";
import ChequeWithdrawal from "./cheque-withdrawal";
// import InputField from "../components/inputField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import { API_SERVER } from "../../../../config/constant";
import AutoReceiptModal from "../components/AutoReceiptModal";
import SigVerModal from "../components/SigVerModal";
import MultiCurrencyCashWithdrawal from "./multi-currency-cash-withdrawal";
import MultiCurrencyCashDeposit from "./multi-currency-cash-deposit";
import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
import axios from "axios";
import CustomModal from "../components/CustomModal";
import FundsTransfer from "./funds-transfer";
import ActionButtons from "../../../../components/others/action-buttons/ActionButtons";
import PrintReceipt from "./components/PrintReceipt";
import swal from "sweetalert";
import { headers } from "./teller-activities";
import CounterChequeWithdrawal from "./counter-cheque-withdrawal";
import { Alert } from "antd";
import { globalContext } from "../../../../App";
import SaloneLinkSend from "./salone-link-send";
import LoanRecoveryCash from "./loan-recovery-cash";
import LoanRecoveryCheque from "./loan-recovery-cheque";
import Swal from "sweetalert2";
import EmailWithdrawalInstruction from "./email-withdrawal-instruction";
export default function CashOperation({ resize }) {
  const [body, setBody] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [formData, setFormData] = useState({});
  const [cashDepositFormData, setCashDepositFormData] = useState({});
  const [batchNo, setBatchNo] = useState("");
  const [batchNoP, setBatchNoP] = useState("");
  const [checked, setChecked] = useState(false);
  const [sigVer, setSigVer] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [activeAccountNumber, setActiveAccountNumber] = useState("");
  const [denominationEntries, setDenominationEntries] = useState("");
  const [okClick, setOkClick] = useState(false);
  const [thirdPartyEntries, setThirdPartyEntries] = useState("");
  const childComponentRef = useRef(null);
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [showAutoRModal, setShowAutoRModal] = useState(false);
  const {
    generalData,
    setGeneralData,
    approvalData,
    setApprovalData,
    setRefreshApproval,
    refreshApproval,
  } = useContext(globalContext);
  function handleTransChange(value) {
    // localStorage.setItem("cash", JSON.stringify(value));
    setBody(value);
  }

  const handleClick = () => {
    if (childComponentRef.current) {
      // Access child component function directly
      childComponentRef.current.childFunction();
      // console.log("Jesus take the wheel");
    }
    // console.log("Jesus take the wheel")
  };
  // useEffect(() => {

  //   localStorage.setItem("cashOperation", "");
  // }, []);

  useEffect(() => {
    // localStorage.removeItem("cash");

    axios
      .post(API_SERVER + "/api/get-code-details", { code: "NTT" }, { headers })
      .then((res) => {
        // console.log("hjss", res);
        setTransactions(res.data);
      });

    return () => {
      // localStorage.removeItem("cashOperation");
      // setApprovalClick("");
      // setApprovalData("");
    };
  }, []);

  useEffect(() => {
    setBody(approvalData);
  }, []);

  // console.log({ denominationEntries });
  // console.log({ approvalData });

  useEffect(() => {
    if (body === "CAW") {
      setModalBody(
        <CashWithdrawal
          okClick={okClick}
          sigVer={sigVer}
          setSigVer={setSigVer}
          setDenominationEntries={setDenominationEntries}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          setBatchNo={setBatchNo}
          body={body}
          checked={checked}
          setChecked={setChecked}
          setActiveAccountNumber={setActiveAccountNumber}
          batchNo={batchNo}
          setThirdPartyEntries={setThirdPartyEntries}
        />
      );
    } else if (body === "MCD") {
    } else if (body === "MCW") {
      // setModalBody(<MultiCurrencyCashWithdrawal />);
    } else if (body === "CADD") {
      setModalBody(
        <CashDeposit
          setSigVer={setSigVer}
          setActiveAccountNumber={setActiveAccountNumber}
          handleSubmit={handleSubmit}
          formData={cashDepositFormData}
          setFormData={setCashDepositFormData}
          setBatchNo={setBatchNo}
          body={body}
          checked={checked}
          batchNo={batchNo}
          setChecked={setChecked}
          setDenominationEntries={setDenominationEntries}
          setThirdPartyEntries={setThirdPartyEntries}
        />
      );
    } else if (body === "CHD") {
      setModalBody(<ChequeDeposit batchNo={batchNo} checked={checked} />);
    } else if (body === "CHW") {
      setModalBody(
        <ChequeWithdrawal
          okClick={okClick}
          checked={checked}
          setActiveAccountNumber={setActiveAccountNumber}
          batchNo={batchNo}
          setChecked={setChecked}
        />
      );
    } else if (body === "CCQ") {
      setModalBody(
        <CounterChequeWithdrawal
          okClick={okClick}
          checked={checked}
          setActiveAccountNumber={setActiveAccountNumber}
          batchNo={batchNo}
          setChecked={setChecked}
        />
      );
    } else if (body === "LRCH") {
      setModalBody(
        <LoanRecoveryCash
          okClick={okClick}
          checked={checked}
          setActiveAccountNumber={setActiveAccountNumber}
          setSigVer={setSigVer}
          handleSubmit={handleSubmit}
          formData={cashDepositFormData}
          setFormData={setCashDepositFormData}
          setBatchNo={setBatchNo}
          body={body}
          setChecked={setChecked}
          batchNo={batchNo}
          setDenominationEntries={setDenominationEntries}
          setThirdPartyEntries={setThirdPartyEntries}
        />
      );
    } else if (body === "LRCQ") {
      setModalBody(
        <LoanRecoveryCheque
          okClick={okClick}
          checked={checked}
          setActiveAccountNumber={setActiveAccountNumber}
          setSigVer={setSigVer}
          handleSubmit={handleSubmit}
          formData={cashDepositFormData}
          setFormData={setCashDepositFormData}
          setBatchNo={setBatchNo}
          body={body}
          setChecked={setChecked}
          batchNo={batchNo}
          setDenominationEntries={setDenominationEntries}
          setThirdPartyEntries={setThirdPartyEntries}
        />
      );
    } else if (body === "LTS") {
      setModalBody(
        <SaloneLinkSend
          okClick={okClick}
          checked={checked}
          setActiveAccountNumber={setActiveAccountNumber}
          batchNo={batchNo}
          setChecked={setChecked}
        />
      );
    } else if (body === "EMW") {
      setModalBody(
        <EmailWithdrawalInstruction
          setSigVer={setSigVer}
          setDenominationEntries={setDenominationEntries}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          setBatchNo={setBatchNo}
          body={body}
          checked={checked}
          setChecked={setChecked}
          setActiveAccountNumber={setActiveAccountNumber}
          batchNo={batchNo}
          setThirdPartyEntries={setThirdPartyEntries}
        />
      );
    } else if (body === "OTTB") {
      setModalBody(
        <FundsTransfer
          setDenominationEntries={setDenominationEntries}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          setBatchNo={setBatchNo}
          body={body}
          checked={checked}
          setChecked={setChecked}
          setActiveAccountNumber={setActiveAccountNumber}
          batchNo={batchNo}
        />
      );
    } else {
      setModalBody("");
    }
  }, [body, checked, okClick]);

  useEffect(() => {
    async function getBatchNumber() {
      const response = await axios.get(API_SERVER + "/api/get-unique-ref", {
        headers,
      });
      console.log(localStorage.getItem("ipAddress"), "IpAdders");
      setBatchNo(response.data[0]["unique_ref"]);
    }
    getBatchNumber();
  }, [checked]);

  // console.log({ okClick });
  function formatDate() {
    const dates = new Date();
    const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
    const day = dates.getDate();
    const year = dates.getFullYear();
    const hours = dates.getHours();
    const minutes = dates.getMinutes();
    const seconds = dates.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM"; // determine whether it's AM or PM
    // format the date and time string
    const formattedDate = `${month}/${day}/${year} ${
      hours % 12
    }:${minutes}:${seconds} ${ampm}`;
    return formattedDate;
  }

  function isFloat(str) {
    return /^\d+(\.\d+)?$/.test(str.replace("-", ""));
  }
  function formatNumber(num) {
    if (isFloat(num)) {
      const formatted = parseFloat(num).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      });
      return formatted;
    }
  }

  function handlePostRejectedTrans(amount, accountNumber, batchNo, narration) {
    axios
      .post(
        API_SERVER + "/api/transaction-validation",
        {
          vaultAccount: JSON.parse(localStorage.getItem("userInfo")).id,
          amount,
          accountNumber,
          batchNo,
          narration,
          branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
          key: "approval",
        },
        { headers }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: "Pending Approval",
          showConfirmButton: false,
          timer: 1500,
        });
        // setValidate(false);
        setChecked(!checked);
      });
    setRefreshApproval(!refreshApproval);
    setGeneralData(null);
    document.getElementById("accountNumber").focus();
  }

  // console.log({ denominationEntries });
  async function handleSubmit(body) {
    if (body === "CAW") {
      const {
        accountNumber,
        amount,
        reference,
        isThirdParty,
        narration,
        withdrawalBy,
        contact,
      } = formData;
      // return console.log({ formData });
      if (
        accountNumber === "" ||
        amount === "" ||
        isThirdParty === "" ||
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
        if (generalData?.batchNo) {
          setRefreshApproval(!refreshApproval);
        }
        setGeneralData(null);
        if (generalData?.approvalStatus == "R") {
          handlePostRejectedTrans(
            formData?.amount,
            formData?.accountNumber,
            generalData?.batchNo,
            formData?.narration
          );
          return;
        }

        const cashWithdrawalResponse = await axios.post(
          API_SERVER + "/api/cash-withdrawal",
          {
            account_number: formData.accountNumber,
            amount: formData.amount,
            voucher_date: formData.valueDate,
            transaction_details: formData.narration,
            username: JSON.parse(localStorage.getItem("userInfo")).id,
            approved_by: JSON.parse(localStorage.getItem("userInfo")).id,
            machine_id: localStorage.getItem("ipAddress"),
            branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
            batch_no: batchNo,
            document_ref: formData.reference,
            narration: formData.narration,
            trans_ref: formData.contact,
            source_of_funds: null,
            form_code: "CAW",
          },
          { headers }
        );
        // console.log(cashWithdrawalResponse, "ghanananana");

        if (cashWithdrawalResponse.data?.responseCode === "000") {
          if (isThirdParty) {
            try {
              const response = await axios.post(
                API_SERVER + "/api/third-party",
                { formData: { ...thirdPartyEntries, batch_no: batchNo } },
                { headers }
              );
              console.log(
                "Third Party Details saved to database",
                response.data
              );
            } catch (error) {
              console.log(error, "ThirdParty Error");
            }
          }
          const response = await axios.post(
            API_SERVER + "/api/denominations",
            {
              denominations: denominationEntries,
              teller_name: JSON.parse(localStorage.getItem("userInfo")).id,
              branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
              batch_no: batchNo,
              collection_flag: "O",

              accountNumber: formData.accountNumber,
            },

            { headers }
          );
          if (response) {
            swal({
              title: "Success",
              text:
                cashWithdrawalResponse.data.responseMessage +
                " with Batch number " +
                batchNo,
              icon: "success",
              buttons: "OK",
              // dangerMode: true,
            }).then((result) => {
              if (result) {
                setBatchNoP(batchNo);
                setShowAutoRModal(true);
                setChecked(!checked);
              }
            });
          }

          const unique_ref = await axios.get(
            API_SERVER + "/api/get-unique-reference",
            { headers }
          );
          const resp = await axios.post(
            API_SERVER + "/api/get-account-summary",
            {
              account_number: formData.accountNumber,
              // transType: "CADD",
            },
            { headers }
          );
          const baseUrl = "http://10.203.14.16:8080/waste/create_notification";
          axios
            .post(
              baseUrl,
              {
                activity_code: "CWD",
                entrySource: "X100",
                branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
                created_by: JSON.parse(localStorage.getItem("userInfo")).id,
                device_id: localStorage.getItem("ipAddress"),
                para1: formData.email,
                para2: formData.contact,
                para3: formData.accountName,
                para4: formData.amount,
                para5: formData.accountNumber,
                para6: resp.data?.summary[0]?.ledger_balance?.trim(),
                para7: resp.data?.summary[0]?.available_balance?.trim(),

                para8: formatDate(),
                para9: batchNo,
                para10: "JGHGH",
                notify: "Y",
                ref_NO: unique_ref.data,
              },
              {
                headers: {
                  "x-api-key": "usgnotificationtest",
                },
              }
            )
            .then((res) => {
              console.log({ SMS: res });
            })
            .catch((e) => {
              console.log({ SMS: e });
            });
        }
        // console.log(cashWithdrawalResponse, "llll");
      }

      console.log(formData);
    } else if (body === "CADD") {
      const { accountNumber, valueDate, amount, isThirdParty, narration } =
        cashDepositFormData;
      // console.log({ cashDepositFormData });
      // return;
      if (
        accountNumber === "" ||
        valueDate === "" ||
        amount === "" ||
        narration === ""
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
        // return console.log({
        //   account_number: cashDepositFormData.accountNumber,
        //   amount: cashDepositFormData.amount,
        //   voucher_date: cashDepositFormData.valueDate,
        //   transaction_details: cashDepositFormData.narration,
        //   username: JSON.parse(localStorage.getItem("userInfo")).id,
        //   approved_by: JSON.parse(localStorage.getItem("userInfo")).id,
        //   machine_id: localStorage.getItem("ipAddress"),
        //   branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
        //   batch_no: batchNo,
        //   document_ref: batchNo,
        //   narration: "Cash-Deposit",
        //   trans_ref: cashDepositFormData.contact,
        //   source_of_funds: cashDepositFormData.selectedSourceOfFund,
        //   form_code: "CADD",
        // });

        const cashDepositResponse = await axios.post(
          API_SERVER + "/api/cash-deposit",
          {
            account_number: cashDepositFormData.accountNumber,
            amount: cashDepositFormData.amount,
            voucher_date: cashDepositFormData.valueDate,
            transaction_details: cashDepositFormData.narration,
            username: JSON.parse(localStorage.getItem("userInfo")).id,
            approved_by: JSON.parse(localStorage.getItem("userInfo")).id,
            machine_id: localStorage.getItem("ipAddress"),
            branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
            batch_no: batchNo,
            document_ref: batchNo,
            narration: "Cash-Deposit",
            trans_ref: cashDepositFormData.contact,
            source_of_funds: null,
            form_code: "CADD",
          },
          { headers }
        );
        if (cashDepositResponse.data.responseCode === "000") {
          // alert("ghana");
          const res = await axios.post(
            API_SERVER + "/api/cash-deposit",
            {
              key: "shareStatus",
              account_number: cashDepositFormData.accountNumber,
            },
            { headers }
          );

          const parsedDate = new Date(cashDepositFormData.valueDate);

          // Get day, month, and year components from the parsed date
          const day = parsedDate.getDate().toString().padStart(2, "0");
          const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
          const year = parsedDate.getFullYear();

          // Form the formatted date string
          const formattedDateString = `${day}/${month}/${year}`;

          if (res.data.shareStatus === "Y") {
            // const response = await axios.post(
            //   "http://10.203.14.125:8000/api/issue-shares",
            //   {
            //     type: "Share Issuanc",
            //     transaction_type: "Issue Share Capital",
            //     posting_date: formattedDateString,
            //     member_id: res.data.memberId,
            //     members_fullname: cashDepositFormData.accountName,
            //     restriction: "No Restriction",
            //     number_of_shares_to_issue:
            //       parseFloat(cashDepositFormData.amount) * 10,
            //     shares_amount: parseFloat(cashDepositFormData.amount),
            //     posted_by: JSON.parse(localStorage.getItem("userInfo")).id,
            //   },
            //   {
            //     headers: {
            //       "x-api-key":
            //         "base64:5OD9CqwOrGpdtuAulon++3DuP1JhllMNspho4cOK4SQ=",
            //     },
            //   }
            // );
            // console.log(response, "www");
          }

          if (isThirdParty) {
            try {
              const response = await axios.post(
                API_SERVER + "/api/third-party",
                { formData: { ...thirdPartyEntries, batch_no: batchNo } },
                { headers }
              );
              console.log(
                "Third Party Details saved to database",
                response.data
              );
            } catch (error) {
              console.log(error, "ThirdParty Error");
            }
          }

          // console.log({ denominationEntries });
          const response = await axios.post(
            API_SERVER + "/api/denominations",
            {
              denominations: denominationEntries,
              teller_name: JSON.parse(localStorage.getItem("userInfo")).id,
              branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
              batch_no: batchNo,
              collection_flag: "I",
              currency_code: "010",
              accountNumber: cashDepositFormData.accountNumber,
            },
            { headers }
          );

          if (response) {
            console.log("Denominations saved successfully");
            setBatchNoP(batchNo);
            setChecked(!checked);
            console.log(response.data);
            swal({
              closeOnClickOutside: false,
              title: "Success",
              text:
                cashDepositResponse.data.responseMessage +
                " with Batch number " +
                batchNo,
              icon: "success",
              buttons: "OK",
            }).then(async (result) => {
              if (result) {
                setShowAutoRModal(true);
                const unique_ref = await axios.get(
                  API_SERVER + "/api/get-unique-reference",
                  { headers }
                );
                const response = await axios.post(
                  API_SERVER + "/api/get-account-summary",
                  {
                    account_number: cashDepositFormData.accountNumber,
                    transType: "CADD",
                  },
                  { headers }
                );
                // console.log({
                //   response:
                //     response.data?.summary[0]?.length > 0
                //       ? response.data?.summary[0]?.availabe_balance?.trim()
                //       : response.data,
                // });
                // const baseUrl = "http://192.168.1.225:8680/notification/api/v1.0/waste/create_notification"
                // const baseUrl =
                //   "http://10.203.14.16:8080/waste/create_notification";
                // axios
                //   .post(
                //     baseUrl,
                //     {
                //       activity_code: "CADEP",
                //       entrySource: "X100",
                //       branch: JSON.parse(localStorage.getItem("userInfo"))
                //         .branchCode,
                //       created_by: JSON.parse(localStorage.getItem("userInfo"))
                //         .id,
                //       device_id: localStorage.getItem("ipAddress"),
                //       para1: cashDepositFormData.email,
                //       para2: cashDepositFormData.contact,
                //       para3: cashDepositFormData.accountName,
                //       para4: cashDepositFormData.amount,
                //       para5: cashDepositFormData.accountNumber,
                //       para6: response.data?.summary[0]?.ledger_balance?.trim(),
                //       para7:
                //         response.data?.summary[0]?.available_balance?.trim(),
                //       para8: formatDate(),
                //       para9: batchNo,
                //       para10: "JGHGH",
                //       notify: "Y",
                //       ref_NO: unique_ref.data,
                //     },

                //     // {
                //     //   activity_code: "CADEP",
                //     //   channel_id: JSON.parse(localStorage.getItem("userInfo"))
                //     //     .branchCode,
                //     //   branch: JSON.parse(localStorage.getItem("userInfo"))
                //     //     .branchCode,
                //     //   done_by: JSON.parse(localStorage.getItem("userInfo")).id,
                //     //   terminal_id: localStorage.getItem("ipAddress"),
                //     //   para1: "hubertamarfio@gmail.com",
                //     //   para2: cashDepositFormData.contact,
                //     //   para3: cashDepositFormData.accountName,
                //     //   para4: cashDepositFormData.amount,
                //     //   para5: cashDepositFormData.accountNumber,
                //     //   para6: response.data?.summary[0]?.ledger_balance?.trim(),

                //     //   para7:
                //     //     response.data?.summary[0]?.availabe_balance?.trim(),

                //     //   para8: formatDate(),
                //     //   para9: batchNo,
                //     //   para10: "JGHGH",
                //     //   ref_NO: unique_ref.data,
                //     // },
                //     {
                //       headers: {
                //         "x-api-key": "usgnotificationtest",
                //       },
                //     }
                //   )
                //   .then((res) => {
                //     console.log({ SMS: res });
                //   });
              }
            });
          }

          console.log(cashDepositResponse, "llll");
        }
      }
    } else if (body === "CHD") {
      handleClick();
    } else if (body === "CCQ") {
      // alert("john");
      setOkClick(!okClick);
    }
  }

  function handleNew() {
    setChecked((prev) => !prev);
  }

  const dates = new Date(
    JSON.parse(localStorage.getItem("userInfo")).postingDate
  );
  const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
  const day = dates.getDate();
  const year = dates.getFullYear();
  return (
    <>
      <AutoReceiptModal
        showModal={showAutoRModal}
        setShowModal={setShowAutoRModal}
        batchNo={batchNoP}
        setChecked={setChecked}
        checked={checked}
      />
      <SigVerModal
        setShowModal={setSigVer}
        showModal={sigVer}
        accountNumber={activeAccountNumber}
      />
      <div
        className={` rounded py-[5px] ${
          resize ? "transform scale-[0.85] -mx-24 -mt-[4%]" : ""
        }`}
        // style={{ zoom: resize ? "transform scale-[0.85] -mx-24 -mt-[4%]" : "" }}
      >
        <ActionButtons
          displayFetch={"none"}
          onNewClick={handleNew}
          onOkClick={() => handleSubmit(body)}
          // onExitClick={() => {
          //   document.getElementById("closeModalBTN")?.click();
          // }}
        />
        <hr className="my-[3px] mt-3" />

        <div className=" bg-white py-[10px] px-4">
          <div className="flex justify-between  mb-2">
            <div>
              <InputField
                label={"Transaction Number"}
                labelWidth={"50%"}
                inputWidth={"50%"}
                disabled={true}
                value={batchNo}
              />
            </div>
            <div>
              <InputField
                label={"User ID"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                disabled={true}
                value={JSON.parse(localStorage.getItem("userInfo")).id}
              />
            </div>
            <div>
              <InputField
                label={"Transaction Branch"}
                labelWidth={"50%"}
                inputWidth={"50%"}
                disabled={true}
                value={JSON.parse(localStorage.getItem("userInfo")).branch}
              />
            </div>
            <div>
              <InputField
                label={"Transaction Date"}
                labelWidth={"50%"}
                inputWidth={"50%"}
                disabled={true}
                value={`${day}/${month}/${year}`}
              />
            </div>
          </div>
          <div className="w-full mb-2 ">
            <div className={"w-[50%]"}>
              <ListOfValue
                label={"Transaction Type"}
                labelWidth={`${resize ? "25.5%" : "21.7%"}`}
                inputWidth="62%"
                onChange={(value) => {
                  handleTransChange(value);
                  setChecked(false);
                }}
                value={body}
                data={transactions}
              />
            </div>
          </div>
          <hr className="my-[8px] " />
          <div className={`flex justify-end items-center`}>
            <div className=" flex w-[40%] justify-end items-center space-x-2">
              {body && (
                <>
                  <ButtonComponent
                    buttonBackgroundImage={
                      `url(` +
                      window.location.origin +
                      `/assets/images/headerBackground/` +
                      getTheme.theme.headerImage +
                      `)`
                    }
                    onClick={() => {
                      setShowPrint(true);
                    }}
                    buttonColor={"white"}
                    buttonWidth={"22%"}
                    buttonHeight="30px"
                    label={"Print Receipt"}
                  />
                  <ButtonComponent
                    buttonBackgroundImage={
                      `url(` +
                      window.location.origin +
                      `/assets/images/headerBackground/` +
                      getTheme.theme.headerImage +
                      `)`
                    }
                    buttonColor={"white"}
                    buttonWidth={"20%"}
                    buttonHeight="30px"
                    label={"Sig. Ver"}
                    onClick={async () => {
                      if (activeAccountNumber === "") {
                        const response = await axios.post(
                          API_SERVER + "/api/get-error-message",
                          { code: "01230" },
                          { headers }
                        );
                        swal({
                          text: response.data,
                          icon: "warning",
                          buttons: "OK",
                          dangerMode: true,
                        }).then((result) => {
                          if (result) {
                            // setShowModal(false);
                          }
                        });
                      } else {
                        setSigVer(true);
                      }
                    }}
                  />
                  <ButtonComponent
                    buttonBackgroundImage={
                      `url(` +
                      window.location.origin +
                      `/assets/images/headerBackground/` +
                      getTheme.theme.headerImage +
                      `)`
                    }
                    buttonColor={"white"}
                    buttonWidth={"23%"}
                    buttonHeight="30px"
                    label={"View Charges"}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <hr className="my-[3px]" />

        {modalBody}
        {!body && <div className="h-[250px]"></div>}
      </div>

      <PrintReceipt
        setShowModal={setShowPrint}
        title={"PRINT RECEIPT"}
        showModal={showPrint}
      />
    </>
  );
}
