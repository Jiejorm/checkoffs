import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
// import { Tabs } from "@mantine/core";
import Swal from "sweetalert2";
import swal from "sweetalert";

import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
import { AiOutlineDelete } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import Header from "../../../../components/others/Header/Header";
import { API_SERVER } from "../../../../config/constant";
import InputField from "../../../../components/others/Fields/InputField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import ListOfValue from "../../../../components/others/Fields/ListOfValue";
import AccountSummary from "../../../../components/others/AccountSummary";
import SelectField from "../../../../components/others/Fields/SelectField";
import Headerr from "../../../../components/others/Header/Header";
// import ImageVerification from "../../../../components/ImageVerification";
import ActionButtons from "../../../../components/others/action-buttons/ActionButtons";
import DocumentViewing from "../../../../components/others/DocumentViewing";
import CustomTable from "../components/CustomTable";
import SearchModal from "../components/Modal";
import ImageVerification from "../../../../components/others/ImageVerification";
import CustomButtons from "../../../../components/others/CustomButtons";
// import ListOfValue from "../../../components/others/ListOfValue";

const headers = {
  "x-api-key":
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "Content-Type": "application/json",
};

function CashDeposit(
  { batchNo, submitFromChequeDeposit, checked, setChecked },
  ref
) {
  const [showSignatureVerification, setShowSignatureVerification] =
    useState(false);
  const openSignatureVerification = () => {
    setShowSignatureVerification(true);
  };
  const closeSignatureVerification = () => {
    setShowSignatureVerification(false);
  };

  const [findById, setFindById] = useState(false);
  const [isDebit, setIsDebit] = useState(false);
  const openFindByIDmodal = (isDebitAcct) => {
    if (isDebitAcct === true) {
      setIsDebit(true);
    }
    setFindById(true);
  };

  const [creditAccount, setCreditAccount] = useState("");
  const [creditAccountChange, setCreditAccountChange] = useState("");
  const [creditAccountName, setCreditAccountName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [debitNarration, setDebitNarration] = useState("");
  const [creditNarration, setCreditNarration] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [numberOfCheques, setNumberOfCheques] = useState("");
  const [clearingOrDebit, setClearingOrDebit] = useState(false);
  const onClearingOrDebit = () => {
    setClearingOrDebit(true);
  };
  const offClearingOrDebit = () => {
    setClearingOrDebit(false);
  };

  const [bankCodeField, setBankCodeField] = useState(false);
  const onBankCodeField = () => {
    setBankCodeField(true);
  };
  const offBankCodeField = () => {
    setBankCodeField(false);
  };

  const [selectedChequeCategory, setSelectedChequeCategory] = useState("");
  const [chequeCategory, setChequeCategory] = useState([]);
  const [selectedIssuingBankCode, setSelectedIssuingBankCode] = useState("");
  const [issuingBankCode, setIssuingBankCode] = useState([]);
  const [clearingAccount, setClearingAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [voucherDate, setVoucherDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [orderingBBAN, setOrderingBBAN] = useState("");
  const [sharesAmount, setSharesAmount] = useState("");
  const [orderingNarration, setOrderingNarration] = useState("");
  const [beneficiaryAccount, setBeneficiaryAccount] = useState("");
  const [debitAccount, setDebitAccount] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [setToBankCode, setSetToBankCode] = useState("");
  const [postBal, setPostBal] = useState("");
  const [sequenceNumber, setSequenceNumber] = useState("");

  let testingMic = "";
  const [orderingAccountName, setOrderingAccountName] = useState("");

  const [formData, setFormData] = useState({});
  const [insertRow, setInsertRow] = useState([]);

  let array = [];
  const [chequeData, setChequeData] = useState([]);
  const [DebitAccountCurrency, setDebitAccountCurrency] = useState("");
  const [DebitProduct, setDebitProduct] = useState("");
  const [payersAccount, setPayersAccount] = useState("");
  const [CreditAccountCurrency, setCreditAccountCurrency] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [CreditProduct, setCreditProduct] = useState("");

  const [debitAmount, setDebitAmount] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [transTypeLOV, setTransTypeLOV] = useState([]);

  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  const [ViewDocument, setViewDocument] = useState(false);
  const openViewDocument = () => {
    setViewDocument(true);
  };
  const closeViewDocument = () => {
    setViewDocument(false);
  };

  const switchFocus = (e, nextFieldId) => {
    if (e.key === "Enter") {
      document.getElementById(nextFieldId)?.focus();
      console.log(document.getElementById(nextFieldId), "component");
    }
  };

  let testing = chequeData.length;
  let chqAmnt = [];
  const [chequeAmount, setChequeAmount] = useState([]);

  const sum = chequeAmount.reduce((accumulator, subarray) => {
    const number = Number(subarray[0]);
    if (!isNaN(number)) {
      return accumulator + number;
    }
    return accumulator;
  }, 0);

  const childFunction = () => {
    if (chequeData.length == numberOfCheques) {
      axios
        .post(
          API_SERVER + "/api/applyChequeDepositForm",
          {
            creditAccount: creditAccount,
            chequeNumber: chequeNumber,
            totalAmount: totalAmount.replaceAll(",", ""),
            chequeAmount: sum.toString(),
            gridCount: testing.toString(),
            batchNumber: batchNo,
            username: "WELBECK",
            hostname: "0000",
            formCode: "OCHD",
          },
          { headers }
        )
        .then((response) => {
          const results = response.data.message;
          if (response.data.success === "000") {
            swal({
              title: "Success",
              text: results,
              icon: "success",
              buttons: "OK",
              dangerMode: true,
            }).then(() => {
              setClearingAccount("");
              document.getElementById("creditAccount").value = " ";
              setCreditAccountName("");
              setTotalAmount("");
              document.getElementById("totalAmount").value = " ";
              setNumberOfCheques("");
              document.getElementById("numberOfCheques").value = " ";
              setSelectedChequeCategory("");
              setSelectedIssuingBankCode("");
              setVoucherDate("");
              document.getElementById("voucherDate").value = " ";
              setClearingAccount("");
              document.getElementById("clearingAccount").value = " ";
              setAccountName("");
              document.getElementById("clearingAccountName").value = " ";
              setChequeNumber("");
              document.getElementById("chequeNumber").value = " ";
              setPayersAccount("");
              document.getElementById("payersAccount").value = " ";
              setCreditNarration("");
              setAmount("");
              document.getElementById("amount").value = " ";
              document.getElementById("creditNarration").value = " ";
              setDebitNarration("");
              document.getElementById("debitNarration").value = " ";

              setChequeData([]);
              setChecked(!checked);
            });
          } else {
            swal({
              title: "Error",
              text: response.data.message,
              icon: "warning",
              buttons: "OK",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      swal({
        title: "Error",
        text: "Check number of cheques",
        icon: "warning",
        buttons: "OK",
        dangerMode: true,
      });
    }
  };

  React.useImperativeHandle(ref, () => ({
    childFunction: childFunction,
  }));

  useEffect(() => {
    const getValueDate = () => {
      axios
        .get(API_SERVER + "/api/get-effective-date", { headers })
        .then((response) => {
          const results = response.data[0].effective_date;
          console.log(results, "sponse");

          const sDate = new Date(results);
          const year = sDate.getFullYear();
          const month = String(sDate.getMonth() + 1).padStart(2, "0");
          const day = String(sDate.getDate()).padStart(2, "0");
          setEffectiveDate(`${year}-${month}-${day}`);
          setValueDate(`${year}-${month}-${day}`);
          setVoucherDate(`${year}-${month}-${day}`);
          // return formattedPostingDate;
          // console.log(formattedPostingDate);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getValueDate();
  }, []);

  function formatNumber(num, id) {
    if (num === undefined || num === " " || num === "NaN") {
      return " ";
    } else {
      const regex = /[a-zA-Z]/;
      if (regex.test(num) == true) {
        swal(
          "Error",
          "kindly ensure amount entered doesn't contain any letters",
          "warning"
        ).then((result) => {
          id.focus();
          id.select();
        });
      } else {
        const numericInput = String(num).replace(/[^0-9.]/g, "");
        // Convert the input to a number and check if it's valid
        const number = parseFloat(numericInput);

        const formatted = number.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });
        // console.log({ formatted }, amount);

        return formatted;
      }
    }
  }

  useEffect(() => {
    const getBatchNumber = () => {
      axios
        .get(API_SERVER + "/api/get-unique-ref", { headers })
        .then((response) => {
          // console.log(response,'sponse eeee')
          const results = response.data[0].unique_ref;
          setBatchNumber(results);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getBatchNumber();
  }, []);

  const onenter = (e) => {
    if (e.key === "Enter") {
      setCreditAccountChange(e.target.value);
      // console.log(debitAccount,"wo y3 bi3")
      axios
        .post(
          API_SERVER + "/api/getBalance",
          {
            accountNumber: creditAccount,
          },
          { headers }
        )
        .then((response) => {
          let results = response.data[0];
          console.log(results, "sults");

          if (results === undefined) {
            swal({
              title: "Invalid Account Number",
              text: "The account number could not be found in our records..",
              icon: "warning",
              buttons: "OK",
              dangerMode: true,
            }).then((result) => {
              if (result) {
                setCreditAccount("");
                setCreditAccountName("");
                var input = document.getElementById("creditAccount");
                input.focus();
              }
            });
          } else {
            setCreditAccountName(results?.account_descrp);
            var input = document.getElementById("numberOfCheques");
            input.focus();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (DebitAccountCurrency.length > 0 && CreditAccountCurrency.length > 0) {
      console.log("on enter", DebitAccountCurrency, CreditAccountCurrency);

      if (DebitAccountCurrency !== CreditAccountCurrency) {
        setCreditProduct("");
        setCreditAccountCurrency("");
        setCreditAccountName("");
        swal({
          title: "ERR-01822: Currency Mismatch",
          text: "Credit And Debit Account Should Be Of The Same Currency. Please Check",
          icon: "warning",
          buttons: "OK",
          dangerMode: true,
        });
      }
    }
  }, [DebitAccountCurrency, CreditAccountCurrency]);

  useEffect(() => {
    if (accountDetails) {
      if (accountDetails.summary?.length > 0) {
        setCreditAccountName(accountDetails?.summary[0]?.account_name);
        // setOrderingAccountName(accountDetails?.summary[0]?.account_name);
        document.getElementById("totalAmount")?.focus();
      }
      console.log("ghanaaa", accountDetails.message);
      if (accountDetails.message) {
        console.log("togo", accountDetails.message);

        // setShowMessage(true);
      }
    }
  }, [accountDetails]);

  useEffect(() => {
    setFormData({
      creditAccount,
      voucherDate,
      totalAmount,
      amount,
      chequeNumber,
      selectedChequeCategory,
      creditNarration,
      debitNarration,
      clearingAccount,
      debitAccount,
      selectedIssuingBankCode,
      batchNo,
      //   numberOfCheques,
      //   debitNarration
    });
  }, [
    creditAccount,
    voucherDate,
    totalAmount,
    amount,
    chequeNumber,
    selectedChequeCategory,
    creditNarration,
    clearingAccount,
    debitAccount,
    selectedIssuingBankCode,
    batchNo,
    debitNarration,
  ]);

  function handleInsert() {
    // setChequeData((prev)=>([...prev , [
    //   valueDate , che
    // ]]))
  }

  const handleDocumentNumber = () => {
    if (documentNumber === "") {
      //   console.log("being clicked");
      swal({
        title: "ERR - 01346",
        text: "A Valid Document ID is required",
        icon: "warning",
        buttons: "OK",
      });
    } else {
      openViewDocument();
    }
  };

  console.log({ isDebit });
  function handleSelected(value) {
    if (isDebit) {
      // alert("Gahan");
      setDebitAccount(value?.accountNumber);
      setAccountName(value?.accountName);
      setIsDebit(false);
      setFindById(false);
      return;
    }
    console.log({ value });
    setCreditAccount(value?.accountNumber);
    setCreditAccountChange(value?.accountNumber);
    // setCreditAccountName(value.accountName);
    // document.getElementById("totalAmount").focus();
    setFindById(false);
  }

  function handleAmountBlur() {
    setTotalAmount(formatNumber(totalAmount, chequeCategory));
    // setAmount(formatNumber(amount, creditNarration));
  }

  useEffect(() => {
    axios
      .post(API_SERVER + "/api/cheque-deposit", { payload: "" }, { headers })
      .then((response) => {
        setIssuingBankCode(response.data?.issuingBankCode);
        setChequeCategory(response.data?.chequeCategory);
      });
  }, []);

  const insertChequeData = () => {
    if (bankCodeField && clearingOrDebit) {
      if (
        creditAccount === "" ||
        debitAccount === "" ||
        voucherDate === "" ||
        totalAmount === "" ||
        amount === "" ||
        chequeNumber === "" ||
        selectedChequeCategory === "" ||
        setToBankCode === "" ||
        creditNarration === "" ||
        debitNarration === ""
        // numberOfCheques === "" ||
      ) {
        swal({
          title: "Empty Fields",
          text: "Please Fill all form Data",
          icon: "warning",
          buttons: "OK",
        });
      } else {
        if (clearingOrDebit && amount > postBal) {
          if (amount > postBal) {
            swal({
              title: "Error",
              text: "Insufficient Balance to proceed with transaction",
              icon: "warning",
              buttons: "OK",
              dangerMode: true,
            }).then((result) => {
              if (result) {
                var input = document.getElementById("amount");
                input?.focus();
              } else {
                var input = document.getElementById("creditNarration");
                input?.focus();
              }
            });
          }
        } else {
          const vDate = new Date(voucherDate);
          const voucher_date = vDate
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-");

          const valDate = new Date(valueDate);
          const val_Date = valDate
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-");
          axios
            .post(
              API_SERVER + "/api/postChequeDepositForm",
              {
                creditAccount: creditAccount,
                voucherDate: voucher_date,
                totalAmount: totalAmount.replaceAll(",", ""),
                chequeAmount: amount.replaceAll(",", ""),
                chequeNumber: chequeNumber,
                chequeCategory: selectedChequeCategory,
                narration1: creditNarration,
                narration2: debitNarration,
                clearingAccount: debitAccount,
                issuingBankCode: setToBankCode.split("-")[0],
                formCode: "OCHD",
                username: JSON.parse(localStorage.getItem("userInfo")).id,
                hostname: "0000",
                batchNumber: batchNo,
                valueDate: val_Date,

                // numberOfCheques:numberOfCheques,
                // hostname:"123454556",
              },
              { headers }
            )
            .then((response) => {
              let results = response.data;
              console.log(results, "sults");
            })
            .catch((error) => {
              console.log(error);
            });

          if (chequeData.length < numberOfCheques) {
            setTimeout(() => {
              axios
                .post(
                  API_SERVER + "/api/getChequeDepositData",
                  {
                    batchNumber: batchNo,
                  },
                  { headers }
                )
                .then((response) => {
                  console.log(response, "Rows");
                  let results = response.data;
                  console.log(results, "chequeRows");

                  results.map((i) => {
                    array.push([
                      i[0],
                      i[1],
                      i[2],
                      i[8],
                      i[7],
                      <div style={{ textAlign: "left" }}>{i[6]}</div>,
                      <div style={{ textAlign: "right" }}>
                        {formatNumber(i[5])}
                      </div>,
                      <ButtonComponent
                        // id="miniModalButton"
                        onClick={() => {
                          setSequenceNumber(i.seq_no);
                          handleRemove(i.seq_no, chequeData.length);
                        }}
                        buttonIcon={<AiOutlineDelete />}
                        buttonHeight={"25px"}
                        buttonWidth={"100%"}
                      />,
                    ]);
                    console.log(array, "laalaland");
                  });
                  setChequeData(array);
                  // results.map((i,key) => {
                  //   array.push([
                  //     i.seq_no,
                  //     i.value_date,
                  //     i.cheque_no,
                  //     i.cheque_type,
                  //     i.bank_code,
                  //     <div style={{textAlign:"left"}}>{i.narration1}</div>,
                  //     <div style={{textAlign:"right"}}> {formatNumber(i.cheque_amount)}</div>,
                  //     <ButtonComponent
                  //       id="miniModalButton"
                  //       onClick={() => {
                  //         setSequenceNumber(i.seq_no);
                  //         handleRemove(i.seq_no , chequeData.length);
                  //       }}
                  //       buttonIcon={<AiOutlineDelete />}
                  //       buttonHeight={"25px"}
                  //       buttonWidth={"100%"}
                  //     />,
                  //   ]);
                  // });

                  setSelectedChequeCategory("");
                  setSelectedIssuingBankCode("");
                  setChequeNumber("");
                  document.getElementById("chequeNumber").value = " ";
                  setAmount("");
                  document.getElementById("amount").value = " ";
                  setCreditNarration("");
                  document.getElementById("creditNarration").value = " ";
                  setDebitNarration("");
                  document.getElementById("debitNarration").value = " ";
                  setVoucherDate("");
                  document.getElementById("voucherDate").value = " ";
                  setClearingAccount("");
                  setAccountName("");
                  document.getElementById("clearingAccountName").value = " ";
                  setPayersAccount("");
                  document.getElementById("payersAccount").value = " ";
                  setDebitAccount("");
                  document.getElementById("debitAccount").value = " ";
                  document.getElementById("issuingBankCode").value = " ";

                  results.map((i) => {
                    chqAmnt.push([i[5]]);
                  });
                  setChequeAmount(chqAmnt);
                  console.log(chqAmnt, "test10");
                })
                .catch((error) => {
                  console.log(error);
                });
            }, 800);
          } else {
            swal({
              title: "Error",
              text: "Check number of cheques",
              icon: "warning",
              buttons: "OK",
              dangerMode: true,
            });
          }
        }
      }
      //busStop
    } else {
      if (
        creditAccount === "" ||
        voucherDate === "" ||
        totalAmount === "" ||
        amount === "" ||
        chequeNumber === "" ||
        selectedChequeCategory === "" ||
        creditNarration === "" ||
        clearingAccount === "" ||
        issuingBankCode === "" ||
        debitNarration === ""
        // numberOfCheques === "" ||
      ) {
        swal({
          title: "Empty Fields",
          text: "Please Fill all form Data",
          icon: "warning",
          buttons: "OK",
        });
      } else {
        const vDate = new Date(voucherDate);
        const voucher_date = vDate
          .toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-");

        const valDate = new Date(valueDate);
        const val_Date = valDate
          .toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-");
        axios
          .post(
            API_SERVER + "/api/postChequeDepositForm",
            {
              creditAccount: creditAccount,
              voucherDate: voucher_date,
              totalAmount: totalAmount.replaceAll(",", ""),
              chequeAmount: amount.replaceAll(",", ""),
              chequeNumber: chequeNumber,
              chequeCategory: selectedChequeCategory,
              narration1: creditNarration,
              clearingAccount: clearingAccount,
              issuingBankCode: selectedIssuingBankCode,
              formCode: "OCHD",
              username: JSON.parse(localStorage.getItem("userInfo")).id,
              hostname: "0000",
              batchNumber: batchNo,
              valueDate: val_Date,

              // numberOfCheques:numberOfCheques,
              // hostname:"123454556",
            },
            { headers }
          )
          .then((response) => {
            let results = response.data;
            console.log(results, "sults");
          })
          .catch((error) => {
            console.log(error);
          });

        if (chequeData.length < numberOfCheques) {
          setTimeout(() => {
            axios
              .post(
                API_SERVER + "/api/getChequeDepositData",
                {
                  batchNumber: batchNo,
                },
                { headers }
              )
              .then((response) => {
                console.log(response, "Rows");
                let results = response.data;
                console.log(results, "chequeRows");

                results.map((i) => {
                  array.push([
                    i[0],
                    i[1],
                    i[2],
                    i[8],
                    i[7],
                    <div style={{ textAlign: "left" }}>{i[6]}</div>,
                    <div style={{ textAlign: "right" }}>
                      {formatNumber(i[5])}
                    </div>,
                    <ButtonComponent
                      // id="miniModalButton"
                      onClick={() => {
                        setSequenceNumber(i.seq_no);
                        handleRemove(i.seq_no, chequeData.length);
                      }}
                      buttonIcon={<AiOutlineDelete />}
                      buttonHeight={"25px"}
                      buttonWidth={"100%"}
                    />,
                  ]);
                  console.log(array, "laalaland");
                });
                setChequeData(array);
                // results.map((i,key) => {
                //   array.push([
                //     i.seq_no,
                //     i.value_date,
                //     i.cheque_no,
                //     i.cheque_type,
                //     i.bank_code,
                //     <div style={{textAlign:"left"}}>{i.narration1}</div>,
                //     <div style={{textAlign:"right"}}> {formatNumber(i.cheque_amount)}</div>,
                //     <ButtonComponent
                //       id="miniModalButton"
                //       onClick={() => {
                //         setSequenceNumber(i.seq_no);
                //         handleRemove(i.seq_no , chequeData.length);
                //       }}
                //       buttonIcon={<AiOutlineDelete />}
                //       buttonHeight={"25px"}
                //       buttonWidth={"100%"}
                //     />,
                //   ]);
                // });
                // setChequeData(array);

                setSelectedChequeCategory("");
                setSelectedIssuingBankCode("");
                setChequeNumber("");
                document.getElementById("issuingBankCode").value = " ";
                document.getElementById("chequeNumber").value = " ";
                setAmount("");
                document.getElementById("amount").value = " ";
                setCreditNarration("");
                document.getElementById("creditNarration").value = " ";
                setDebitNarration("");
                document.getElementById("debitNarration").value = " ";
                setVoucherDate("");
                document.getElementById("voucherDate").value = " ";
                setClearingAccount("");
                setAccountName("");
                document.getElementById("clearingAccountName").value = " ";
                setPayersAccount("");
                document.getElementById("payersAccount").value = " ";
                setDebitAccount("");
                document.getElementById("debitAccount").value = " ";

                results.map((i) => {
                  chqAmnt.push([i[5]]);
                });
                setChequeAmount(chqAmnt);
                console.log(chqAmnt, "test10");
              })
              .catch((error) => {
                console.log(error);
              });
          }, 800);
        } else {
          swal({
            title: "Error",
            text: "Check number of cheques",
            icon: "warning",
            buttons: "OK",
            dangerMode: true,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (selectedIssuingBankCode === "002") {
      setClearingAccount("111220000001");
      setAccountName("ROKEL COMMERCIAL BANK");
    }
    if (selectedIssuingBankCode === "003") {
      setClearingAccount("111220000003");
      setAccountName("SIERRA LEONE COMMERCIAL BANK");
    }
    if (selectedIssuingBankCode === "005") {
      setClearingAccount("111220000005");
      setAccountName("GUARANTY TRUST BANK");
    }
    if (selectedIssuingBankCode === "006") {
      setClearingAccount("111220000006");
      setAccountName("FIBANK");
    }
    if (selectedIssuingBankCode === "007") {
      setClearingAccount("111220000007");
      setAccountName("FBN BANK");
    }
    if (selectedIssuingBankCode === "008") {
      setClearingAccount("111220000008");
      setAccountName("ECOBANK");
    }
    if (selectedIssuingBankCode === "009") {
      setClearingAccount("111220000010");
      setAccountName("ACCESS BANK");
    }
    if (selectedIssuingBankCode === "010") {
      setClearingAccount("111220000011");
      setAccountName("UNITED BANK FOR AFRICA(UBA)");
    }
    if (selectedIssuingBankCode === "011") {
      setClearingAccount("111220000012");
      setAccountName("SKYE BANK");
    }
    if (selectedIssuingBankCode === "012") {
      setClearingAccount("111220000013");
      setAccountName("ZENITH BANK");
    }
    if (selectedIssuingBankCode === "013") {
      setClearingAccount("111220000014");
      setAccountName("PHB BANK");
    }
    if (selectedIssuingBankCode === "014") {
      setClearingAccount("111220000016");
      setAccountName("COMMERCE AND MORTGAGE BANK PLC");
    }
    if (selectedIssuingBankCode === "015") {
      setClearingAccount("111220000015");
      setAccountName("APEX BANK (SL) LIMITED");
    }
  }, [selectedIssuingBankCode]);

  // const compareFields = (e) => {
  //   if (e.key === "Enter") {
  //     if (creditAccount === clearingAccount) {
  //       swal({
  //         title: "Error",
  //         text: "Payer's and Payee's Account Number are the same!",
  //         icon: "warning",
  //         buttons: "OK",
  //         dangerMode: true,
  //       }).then((result) => {
  //         if (result) {
  //           var input = document.getElementById("debitAccount");
  //           input?.focus();
  //         }
  //         // setSharesAmount("");
  //       });
  //     }
  //   }
  // };

  console.log(chequeData, "daterrr");

  const onValidate = (e) => {
    if (e.key === "Enter") {
      validateChequeNumber();
    }
  };
  const validateChequeNumber = () => {
    axios
      .post(
        API_SERVER + "/api/checkChequeNumber",
        {
          debitAccount: debitAccount,
          chequeNumber: chequeNumber,
        },
        { headers }
      )
      .then((response) => {
        let results = response.data;
        console.log(results, "sults");
        if (results.success === true) {
          var input = document.getElementById("payersAccount");
          input?.focus();
        } else {
          swal({
            title: "Error",
            text: results.message,
            icon: "warning",
            buttons: "OK",
            dangerMode: true,
          }).then((result) => {
            if (result) {
              var input = document.getElementById("chequeNumber");
              input?.focus();
              setChequeNumber("");
              document.getElementById("chequeNumber").value = " ";
            }
            // setSharesAmount("");
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBankCode = () => {
    axios
      .get(API_SERVER + "/api/getBankCode", { headers })
      .then((response) => {
        let results = response.data;
        console.log(results, "sults");
        results.map((i) => {
          setSetToBankCode(i.actual_code + " - " + i.description);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDebitAccountentry = (e) => {
    if (e.key === "Enter") {
      if (creditAccount === debitAccount) {
        swal({
          title: "Error",
          text: "Payer's and Payee's Account Number are the same!",
          icon: "warning",
          buttons: "OK",
          dangerMode: true,
        }).then((result) => {
          if (result) {
            var input = document.getElementById("debitAccount");
            input?.focus();
          }
          // setSharesAmount("");
        });
      } else {
        // setCreditAccountChange(e.target.value);
        console.log(debitAccount, "wo y3 bi3");
        axios
          .post(
            API_SERVER + "/api/getBalance",
            {
              accountNumber: debitAccount,
            },
            { headers }
          )
          .then((response) => {
            let results = response.data[0];
            console.log(results, "sults");

            if (results === undefined) {
              swal({
                title: "Invalid Account Number",
                text: "The account number could not be found in our records..",
                icon: "warning",
                buttons: "OK",
                dangerMode: true,
              }).then((result) => {
                if (result) {
                  setDebitAccount("");
                  setAccountName("");
                  var input = document.getElementById("debitAccount");
                  input?.focus();
                }
              });
            } else {
              setAccountName(results?.account_descrp);
              setPostBal(results?.post_av_bal);
              var input = document.getElementById("chequeNumber");
              input.focus();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  console.log(sequenceNumber, "yrrrrrrtwtw");

  function handleRemove(seqNo, index) {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete this record from the Table",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "OK",
      dangerMode: true,
    }).then((result) => {
      console.log(seqNo, "krrrpaw");
      if (result.isConfirmed) {
        console.log("i taya");
        console.log(seqNo, "krrrpawpaw");
        axios
          .post(
            API_SERVER + "/api/removeChequeDepositRow",
            { seqNo: seqNo },
            { headers }
          )
          .then((response) => {
            console.log(seqNo, "seqNo");
            console.log(response, "the world is yourz");
            setChequeData((prev) => prev.filter((_, i) => i !== index));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  const validateAmount = (e) => {
    if (e.key === "Enter") {
      if (clearingOrDebit && amount > postBal) {
        if (amount > postBal) {
          swal({
            title: "Error",
            text: "Insufficient Amount to proceed this transaction",
            icon: "warning",
            buttons: "OK",
            dangerMode: true,
          }).then((result) => {
            if (result) {
              var input = document.getElementById("amount");
              input?.focus();
            } else {
              var input = document.getElementById("creditNarration");
              input?.focus();
            }
          });
        }
      } else {
        var input = document.getElementById("creditNarration");
        input?.focus();
      }
    }
  };

  useEffect(() => {
    handleNew();
    document.getElementById("creditAccount").focus();
  }, [checked]);

  function handleNew() {
    setCreditAccountChange("");
    setClearingAccount("");
    setDebitAccount("");
    setCreditAccountName("");
    setTotalAmount("");
    setNumberOfCheques("");
    setSelectedChequeCategory("");
    setSelectedIssuingBankCode("");
    setVoucherDate("");
    setClearingAccount("");
    setAccountName("");
    setChequeNumber("");
    setCreditNarration("");
    setAmount("");
    setCreditAccount("");
    setChequeNumber("");
    setDebitNarration("");
    setPayersAccount("");
  }
  return (
    <div className=" pt-2 px-2 overflow-y-scroll pb-16">
      <Header headerShade={true} title={"Cheque Deposit"} />
      <div
        className=""
        style={{
          display: "flex",
          // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          backgroundColor: "white",
          padding: "10px 0px 10px 0px",
        }}
      >
        <div className="w-full">
          <div className="flex w-full rounded  p-2 border-2">
            <div className="w-[68%] ">
              <div
                className="space-y-2"
                style={{
                  // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",

                  borderRadius: "5px",
                  marginBottom: "35px",
                }}
              >
                <div
                  className="w-full flex"
                  style={{
                    display: "flex",
                  }}
                >
                  <div className="w-[52%]">
                    <InputField
                      label={"Credit Account"}
                      labelWidth={"34.5%"}
                      inputWidth={"58%"}
                      onChange={(e) => {
                        setCreditAccount(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        onenter(e);
                      }}
                      id={"creditAccount"}
                      value={creditAccount}
                      required
                    />
                  </div>

                  <ButtonComponent
                    label={"Search"}
                    buttonHeight={"25px"}
                    buttonWidth={"75px"}
                    onClick={() => {
                      openFindByIDmodal();
                    }}
                  />
                </div>

                <InputField
                  label={"Account Name"}
                  labelWidth={"18%"}
                  inputWidth={"70%"}
                  value={creditAccountName}
                  id={"creditAccountName"}
                  disabled
                />

                <div className="flex">
                  <InputField
                    label={"Total Amount"}
                    labelWidth={"39.5%"}
                    inputWidth={"65%"}
                    id={"totalAmount"}
                    onChange={(e) => {
                      setTotalAmount(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        switchFocus(e, "numberOfCheques");
                        setNumberOfCheques("1");
                      }
                    }}
                    onBlur={totalAmount ? handleAmountBlur : null}
                    value={totalAmount}
                    textAlign={"right"}
                    required
                    // onKeyPress={sharesAmountField}
                    // type={"number"}
                  />
                  <InputField
                    label={"Number Of Cheque(s)"}
                    labelWidth={"45%"}
                    inputWidth={"12%"}
                    value={numberOfCheques}
                    id={"numberOfCheques"}
                    onKeyDown={(e) => {
                      switchFocus(e, "chequeCategory");
                    }}
                    onChange={(e) => {
                      setNumberOfCheques(e.target.value);
                    }}
                    required
                    type={"number"}
                  />
                </div>
              </div>
              <div className=" ">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.55fr 0.45fr",
                    rowGap: "8px",
                  }}
                >
                  {/* <ListOfValue
                    label={"Cheque Category"}
                    id={"chequeCategory"}
                    // type="number"
                    labelWidth={"32.5%"}
                    inputWidth={"55%"}
                    value={selectedChequeCategory}
                    data={chequeCategory}
                    onChange={(value) => {
                      if (value === "HSE") {
                        setSelectedChequeCategory(value);
                        onClearingOrDebit();
                        onBankCodeField();
                        getBankCode();
                        setTimeout(() => {
                          const input = document.getElementById("voucherDate");
                          input.focus();
                        }, 0);
                        // document.getElementById(
                        //   "clearingAccount"
                        // ).disabled = false;
                        // document.getElementById(
                        //   "clearingAccount"
                        // ).style.backgroundColor = "whitesmoke";
                        //   document.getElementById("issuingBankCode").style.backgroundColor = "rgb(223, 223, 223)";
                      } else if (value === "LCC" || value === "SPC") {
                        setSelectedChequeCategory(value);
                        offClearingOrDebit();
                        offBankCodeField();
                        setTimeout(() => {
                          const input =
                            document.getElementById("issuingBankCode");
                          input.focus();
                        }, 0);
                        // document.getElementById(
                        //   "clearingAccount"
                        // ).disabled = true;
                        // document.getElementById(
                        //   "clearingAccount"
                        // ).style.backgroundColor = "rgb(223, 223, 223)";
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input =
                          document.getElementById("issuingBankCode");
                        input.focus();
                      }
                    }}
                    required={true}
                  /> */}

                  <ListOfValue
                    label={"Cheque Category"}
                    id={"chequeCategory"}
                    // type="number"
                    labelWidth={"33%"}
                    inputWidth={"55%"}
                    value={selectedChequeCategory}
                    data={chequeCategory}
                    onChange={(value) => {
                      if (value === "HSE") {
                        setSelectedChequeCategory(value);
                        onClearingOrDebit();
                        onBankCodeField();
                        getBankCode();
                        setTimeout(() => {
                          const input = document.getElementById("voucherDate");
                          input.focus();
                        }, 0);
                      } else if (value === "LCC" || value === "SPC") {
                        setSelectedChequeCategory(value);
                        offClearingOrDebit();
                        offBankCodeField();
                        setTimeout(() => {
                          const input =
                            document.getElementById("issuingBankCode");
                          input.focus();
                        }, 0);
                        // document.getElementById(
                        //   "clearingAccount"
                        // ).disabled = true;
                        // document.getElementById(
                        //   "clearingAccount"
                        // ).style.backgroundColor = "rgb(223, 223, 223)";
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input =
                          document.getElementById("issuingBankCode");
                        input.focus();
                      }
                    }}
                    required={true}
                  />
                  {bankCodeField ? (
                    <InputField
                      id={"issuingBankCode"}
                      label={"Issuing Bank Code"}
                      labelWidth={"32.5%"}
                      inputWidth={"55%"}
                      disabled
                      value={setToBankCode}
                      required
                    />
                  ) : (
                    <ListOfValue
                      id={"issuingBankCode"}
                      label={"Issuing Bank Code"}
                      labelWidth={"32.5%"}
                      inputWidth={"58%"}
                      data={issuingBankCode}
                      value={selectedIssuingBankCode}
                      onChange={(e) => {
                        setSelectedIssuingBankCode(e);
                        setTimeout(() => {
                          const input = document.getElementById("chequeNumber");
                          input.focus();
                        }, 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const input = document.getElementById("chequeNumber");
                          input.focus();
                        }
                      }}
                      required
                    />
                  )}

                  {/* <div>&nbsp;</div> */}
                  {clearingOrDebit ? (
                    <div style={{ display: "flex", gap: "5px" }}>
                      {/* <div style={{ flex: 0.7 }}> */}
                      <InputField
                        label={"Debit Account"}
                        labelWidth={"40%"}
                        inputWidth={"60%"}
                        id={"debitAccount"}
                        onChange={(e) => {
                          setDebitAccount(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          onDebitAccountentry(e);
                        }}
                        required
                        // switchFocus(e, "chequeNumber");
                        // compareFields(e);
                        value={debitAccount}
                        // disabled
                      />
                      {/* </div> */}
                      {/* <div style={{ flex: 0.14 }}> */}
                      <ButtonComponent
                        label={"Search"}
                        buttonHeight={"25px"}
                        buttonWidth={"100%"}
                        onClick={() => {
                          openFindByIDmodal(true);
                        }}
                      />
                      {/* </div> */}
                    </div>
                  ) : (
                    <InputField
                      label={"Clearing Account"}
                      labelWidth={"33%"}
                      inputWidth={"55%"}
                      id={"clearingAccount"}
                      onChange={(e) => {
                        setClearingAccount(e.target.value);
                      }}
                      value={clearingAccount}
                      onKeyDown={(e) => {
                        switchFocus(e, "chequeNumber");
                        // compareFields(e);
                      }}
                      required
                      disabled
                    />
                  )}

                  <InputField
                    label={"Account Name"}
                    labelWidth={"32.5%"}
                    inputWidth={"58%"}
                    id={"clearingAccountName"}
                    onChange={(e) => {
                      setAccountName(e.target.value);
                    }}
                    value={accountName}
                    disabled
                  />
                  <InputField
                    label={"Cheque Number"}
                    labelWidth={"33%"}
                    inputWidth={"55%"}
                    id={"chequeNumber"}
                    onChange={(e) => {
                      setChequeNumber(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      onValidate(e);
                      // switchFocus(e, "payersAccount");
                      setCreditNarration(
                        "Cheque Deposit CHQ : " + chequeNumber
                      );
                    }}
                    onBlur={validateChequeNumber}
                    type={"number"}
                    value={chequeNumber}
                    required
                  />
                  {/* <InputField
                    label={"Payer's Account"}
                    labelWidth={"32.5%"}
                    inputWidth={"58%"}
                    id={"payersAccount"}
                    onChange={(e) => {
                      setPayersAccount(e.target.value);
                    }}
                    value={payersAccount}
                    onKeyDown={(e) => {
                      switchFocus(e, "amount");
                    }}
                    // disabled
                  /> */}
                  <div>&nbsp;</div>

                  <InputField
                    label={"Amount"}
                    labelWidth={"33%"}
                    inputWidth={"55%"}
                    id={"amount"}
                    onKeyDown={(e) => {
                      // validateAmount(e);
                      switchFocus(e, "creditNarration");
                    }}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    required
                    onBlur={amount ? handleAmountBlur : null}
                    value={amount}
                    textAlign={"right"}
                  />
                  <InputField
                    label={"Voucher Date"}
                    labelWidth={"32.5%"}
                    inputWidth={"58%"}
                    type={"date"}
                    id={"voucherDate"}
                    onChange={(e) => {
                      setVoucherDate(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      switchFocus(e, "debitAccount");
                    }}
                    value={voucherDate}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    rowGap: "8px",
                    marginTop: "35px",
                  }}
                >
                  <InputField
                    label={"Credit Narration"}
                    labelWidth={"18%"}
                    inputWidth={"77.1%"}
                    id={"creditNarration"}
                    onKeyDown={(e) => {
                      switchFocus(e, "debitNarration");
                    }}
                    onChange={(e) => {
                      setCreditNarration(e.target.value);
                    }}
                    required
                    value={creditNarration}
                  />
                  <InputField
                    label={"Debit Narration"}
                    labelWidth={"18%"}
                    inputWidth={"77.1%"}
                    id={"debitNarration"}
                    onChange={(e) => {
                      setDebitNarration(e.target.value);
                    }}
                    // onKeyPress={(e) => {
                    //     switchFocus(e, "debit_narration")
                    // }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="w-[32%]">
              <div>
                <AccountSummary
                  accountNumber={creditAccountChange}
                  setAccountDetails={setAccountDetails}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", margin: "10px 0px 10px 0px" }}>
          <div style={{ flex: 0.25 }}></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flex: 0.42,
            }}
          >
            <ButtonComponent
              label={"Clear"}
              buttonWidth={"20%"}
              type={"button"}
              buttonHeight={"30px"}
              onClick={() => {}}
            />
            {/* <button className="bg-blue-500 py-[2px] px-2 rounded-md text-gray-100 font-semibold space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  opacity=".4"
                  d="M20.5 10.19h-2.89c-2.37 0-4.3-1.93-4.3-4.3V3c0-.55-.45-1-1-1H8.07C4.99 2 2.5 4 2.5 7.57v8.86C2.5 20 4.99 22 8.07 22h7.86c3.08 0 5.57-2 5.57-5.57v-5.24c0-.55-.45-1-1-1Z"
                  fill="#d9e3f0"
                ></path>
                <path
                  d="M15.8 2.21c-.41-.41-1.12-.13-1.12.44v3.49c0 1.46 1.24 2.67 2.75 2.67.95.01 2.27.01 3.4.01.57 0 .87-.67.47-1.07-1.44-1.45-4.02-4.06-5.5-5.54ZM12.28 14.72a.754.754 0 0 0-1.06 0l-.72.72v-4.19c0-.41-.34-.75-.75-.75s-.75.34-.75.75v4.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02.06.06.14.11.22.15.1.03.19.05.29.05.1 0 .19-.02.28-.06.09-.04.17-.09.25-.16l2-2c.29-.29.29-.77 0-1.06Z"
                  fill="#d9e3f0"
                ></path>
              </svg>
              <span>Insert</span>
            </button> */}
            <ButtonComponent
              label={"Insert"}
              buttonWidth={"20%"}
              type={"button"}
              buttonHeight={"30px"}
              onClick={insertChequeData}
              buttonIcon={CustomButtons["insert"].icon}
              buttonBackgroundColor={CustomButtons["insert"].bgColor}
            />
            <ButtonComponent
              label={"Remove All"}
              buttonWidth={"22%"}
              type={"button"}
              buttonHeight={"30px"}
              buttonIcon={CustomButtons["removeAll"].icon}
              buttonBackgroundColor={CustomButtons["removeAll"].bgColor}
              // onClick={handleRemoveAll}
            />
          </div>
          <div style={{ flex: 0.33 }}></div>
        </div>
        <CustomTable
          headers={[
            "SEQ NO.",
            "VALUE DATE",
            "CHEQUE NO.",
            "CHEQUE CATEGORY",
            "ISSUING BANK",
            "NARRATION",
            "CHEQUE AMOUNT",
            "",
          ]}
          data={chequeData}
        />
      </div>
      <Modal size="lg" show={showSignatureVerification}>
        <Modal.Header
          style={{
            background:
              `url(` +
              window.location.origin +
              `/assets/images/headerBackground/` +
              getTheme.theme.headerImage +
              `)`,
          }}
        >
          <div className="w-full -mb-4 flex justify-between ">
            <Modal.Title
              style={{
                fontSize: "14.5px",
                color: "white",
                padding: "10px",
              }}
            >
              <p>View Photo And Signature</p>
            </Modal.Title>
            <svg
              onClick={closeSignatureVerification}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              style={{ padding: "10px" }}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-11 h-11 cursor-pointer fill-cyan-500 stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </Modal.Header>
        <Modal.Body style={{ background: "white", height: "auto" }}>
          <ImageVerification accountNumber={debitAccount} />
        </Modal.Body>
      </Modal>
      <Modal
        show={ViewDocument}
        size="lg"
        centered
        style={{ height: "100%" }}
        className="shadow-md shadow-black"
      >
        <div className="flex items-center justify-between mx-2 p-2">
          <div className="font-extrabold text-black">View Document</div>
          <div
            className="border rounded-full px-2 bg-red-400 text-white cursor-pointer"
            onClick={() => closeViewDocument}
          >
            x
          </div>
        </div>
        <Modal.Body>
          <DocumentViewing documentID={documentNumber} />
        </Modal.Body>
      </Modal>
      <SearchModal
        showModal={findById}
        setShowModal={setFindById}
        handleSelected={handleSelected}
      />
      {/* <SearchModal showModal={findById2} setShowModal={setFindById2} handleSelected={handleSelected2}/> */}
    </div>
  );
}

export default forwardRef(CashDeposit);
