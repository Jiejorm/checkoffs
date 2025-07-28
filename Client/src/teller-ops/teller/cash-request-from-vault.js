import { useEffect, useState } from "react";
import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
import ListOfValue from "../../../../components/others/Fields/ListOfValue";
import InputField from "../../../../components/others/Fields/InputField";
import { API_SERVER } from "../../../../config/constant";
import axios from "axios";
import ActionButtons from "../../../../components/others/action-buttons/ActionButtons";
import CustomTable from "../components/CustomTable";
import swal from "sweetalert";
import Denominations from "../components/cashRequestDenomination";
// import Denomination

export default function CashRequestFromVault({ setShowModal }) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [ungrantedCash, setUngrantedCash] = useState("");
  const [currency, setCurrency] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [Balances, setBalances] = useState("");
  const [ungranted, setUngranted] = useState("");
  const [amount, setAmount] = useState("");
  const [branch, setBranch] = useState("");
  const [rejectedCash, setRejectedCash] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [denomination, setDenomination] = useState(false);
  const [denominationEntries, setDenominationEntries] = useState("");
  const [prevAmount, setPrevAmount] = useState("");
  const [denominationbtnId, setDenominationbtnId] =
    useState("denominationsokbtn");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const dates = new Date(
    JSON.parse(localStorage.getItem("userInfo"))?.postingDate
  );
  const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
  const day = dates.getDate();
  const year = dates.getFullYear();

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  function delUngranted(batchNumber) {
    swal("Are you sure you want to delete this request", "", "warning", {
      buttons: true,
      dangerMode: true,
    }).then((result) => {
      if (result) {
        axios
          .post(
            API_SERVER + "/api/delete-ungranted-cash",
            {
              batch_number: batchNumber,
              key: "delete_ungranted_cash_request",
            },
            { headers }
          )
          .then((response) => {
            // console.log(response,"responseeeee")
            if (response.data.status === "success") {
              swal({
                title: response.data.message,
                text: "",
                icon: "success",
                buttons: "OK",
                timer: 1000,
              });
              setRefresh(!refresh);
            } else {
              swal({
                title: response.data.message,
                text: "",
                icon: "error",
                buttons: "OK",
                // timer: 1000,
              });
            }
          });
      }
    });
  }

  console.log(denominationEntries, "denominationEntriesdenominationEntries");

  function delRejected(batchNumber) {
    swal("Are you sure you want to delete this transaction", "", "warning", {
      buttons: true,
      dangerMode: true,
    }).then((result) => {
      if (result) {
        axios
          .post(
            API_SERVER + "/api/delete-ungranted-cash",
            {
              batch_number: batchNumber,
              key: "delete_rejected_cash_request",
            },
            { headers }
          )
          .then((response) => {
            // console.log(response,"responseeeee")
            setRefresh(!refresh);
            swal({
              title: "Data Deleted successfully",
              text: "",
              icon: "success",
              buttons: "OK",
              timer: 1000,
            });
          });
      }
    });
  }

  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/get-branch",
        {
          code: localStorage.getItem("userInfo").branchCode,
        },
        { headers }
      )
      .then((res) => {
        setBranch(res.data);
      });

    axios
      .get(API_SERVER + "/api/get-currency-breado/1", { headers })
      .then((response) => {
        console.log({ cur: response.data });
        setCurrencies(response.data);
      });

    axios
      .post(
        API_SERVER + "/api/cash-request-from-vault",
        {
          key: "balance before",
          username: JSON.parse(localStorage.getItem("userInfo")).id,
        },
        { headers }
      )
      .then((response) => {
        setBalances(response.data);
        // console.log(response, "from valr");
      });

    axios
      .post(
        API_SERVER + "/api/cash-request-from-vault",
        {
          key: "ungranted cash request",
          username: JSON.parse(localStorage.getItem("userInfo")).id,
        },
        { headers }
      )
      .then((response) => {
        // console.log(response,"ghhhhhhhh")
        const arr = [];
        response?.data?.map((i) => {
          arr.push([
            ...i,
            <div className="flex justify-center w-full">
              <div
                onClick={() => {
                  delUngranted(i[0]);
                }}
                className="bg-[#d5878779] rounded py-1  w-[40px] text-center hover:ring-[2px] ring-[#e82f88] transition duration-300 ease-in-out flex justify-center items-center "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 stroke-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
            </div>,
          ]);
        });
        setUngranted(arr);
      });

    axios
      .post(
        API_SERVER + "/api/cash-request-from-vault",
        {
          key: "rejected cash request",
          username: JSON.parse(localStorage.getItem("userInfo")).id,
        },
        { headers }
      )
      .then((response) => {
        const arr = [];
        response?.data?.map((i) => {
          arr.push([
            ...i,
            <div className="flex justify-center w-full ">
              <div
                onClick={() => {
                  delRejected(i[0]);
                }}
                className="bg-[#d5878779] rounded py-1  w-[40px] text-center hover:ring-[2px] ring-[#e82f88] transition duration-300 ease-in-out flex justify-center items-center "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 stroke-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
            </div>,
          ]);
        });
        setRejectedCash(arr);
      });
  }, [refresh]);

  function RefreshClick() {
    setRefresh(!refresh);
    setAmount("");
    setSelectedCurrency("");
    setDenomination(false);
  }
  console.log(selectedCurrency, "ssss");

  function formatNumber(num, id) {
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
      return formatted;
    }
  }

  const NumberWithoutCommas = (number) => {
    const formattedNumber = String(number).replace(/,/g, "");
    return formattedNumber;
  };

  function formatAmountBlur() {
    if (amount) {
      setAmount(formatNumber(amount, document.getElementById("amount")));
    }
  }

  function postRequest() {
    // console.log(error,"errorrrr")
    axios
      .post(
        API_SERVER + "/api/post_prc_teller_request_from_vault",
        {
          tellerID: JSON.parse(localStorage.getItem("userInfo")).id,
          currency: selectedCurrency,
          branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
          amount: NumberWithoutCommas(amount),
          denominationEntries: denominationEntries,
        },
        { headers }
      )
      .then((response) => {
        if (
          response.data.message ==
          "INF - 05828: Request Transaction sent successfully"
        ) {
          swal({
            title: response.data.message,
            text: "",
            icon: "success",
            buttons: "OK",
            // timer: 2000,
          });
          setAmount("");
          setSelectedCurrency("");
          setRefresh(!refresh);
        } else {
          swal(response.data.message, "", { icon: "error" });
          setAmount("");
          document.getElementById("amount").focus();
        }
      });
  }

  function handleCashRequest() {
    if (denominationEntries) {
      document.getElementById(denominationbtnId).click();
    } else {
      postRequest();
      setDenomination(false);
    }
  }

  return (
    <>
      <div className="rounded h-auto pb-1 pt-2 scale-[0.85] -mx-16 -mt-8 bg-white">
        <ActionButtons
          displayFetch={"none"}
          displayAuthorise={"none"}
          displayCancel={"none"}
          displayNew={"none"}
          displayDelete={"none"}
          displayHelp={"none"}
          displayReject={"none"}
          displayView={"none"}
          onOkClick={handleCashRequest}
          onRefreshClick={RefreshClick}
          onExitClick={() => {
            setShowModal(false);
          }}
        />
        <hr className="my-[5px]" />
        <div className="flex gap-[1%]">
          <div className="bg-white mt-1 w-[59%]">
            <header className="text-white bg-[#0580c0]  py-1 font-semibold px-2 uppercase w-full">
              Cash Request
            </header>
            <div className="">
              <div className="bg-white mt-0.5">
                <div className="items-center border-2 rounded p-4 justify-start w-full ">
                  <div className="mb-4 ">
                    <ListOfValue
                      label={"Currency"}
                      id={"currencylov"}
                      labelWidth={"25%"}
                      inputWidth={"30%"}
                      marginBottom={"10px"}
                      required={true}
                      data={currencies}
                      value={selectedCurrency}
                      onChange={(value) => {
                        setSelectedCurrency(value);
                        if (denomination) {
                          setDenomination(false);
                        }
                        if (ungranted) {
                          let cc, gg;
                          currencies.map((c) => {
                            if (c.value == value) {
                              cc = c.label.split(" - ");
                              gg = cc[1].toUpperCase();
                            }
                          });
                          ungranted.map((d) => {
                            console.log(d[2], gg, "aaaaa");
                            if (d[2] == gg) {
                              swal({
                                title:
                                  "You have ungranted cash in the selected currency!!!",
                                text: "",
                                icon: "error",
                                buttons: "OK",
                                // timer: 2000,
                              }).then((result) => {
                                if (result) {
                                  const input =
                                    document.getElementById("currencylov");
                                  input.focus();
                                  setSelectedCurrency("");
                                }
                              });
                              // setError(true)
                            }
                          });
                          setTimeout(() => {
                            const input = document.getElementById("amount");
                            input.focus();
                          }, 0);
                        }
                      }}
                      onKeyDown={(e, value) => {
                        if (e.key === "Enter" && selectedCurrency) {
                          e.preventDefault();
                          if (ungranted) {
                            let cc, gg;
                            currencies.map((c) => {
                              if (c.value == value) {
                                cc = c.label.split(" - ");
                                gg = cc[1];
                              }
                            });
                            ungranted.map((d) => {
                              console.log(d[2], gg, "aaaaa");
                              if (d[2] == gg) {
                                swal({
                                  title:
                                    "You have ungranted cash in the selected currency!!!",
                                  text: "",
                                  icon: "error",
                                  buttons: "OK",
                                  // timer: 2000,
                                }).then((result) => {
                                  if (result) {
                                    const input =
                                      document.getElementById("currencylov");
                                    input.focus();
                                  }
                                });
                                // setError(true)
                              }
                            });
                          }
                          const input = document.getElementById("amount");
                          input.focus();
                        }
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <InputField
                      label={"Amount"}
                      labelWidth={"25%"}
                      inputWidth={"30%"}
                      textAlign={"right"}
                      required={true}
                      value={amount}
                      id={"amount"}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && amount) {
                          e.preventDefault();
                          if (selectedCurrency == "") {
                            swal({
                              title: "Currency can't be empty!!!",
                              text: "",
                              icon: "error",
                              buttons: "OK",
                              // timer: 2000,
                            }).then((result) => {
                              if (result) {
                                const input =
                                  document.getElementById("currencylov");
                                input.focus();
                                setAmount("");
                              }
                            });
                          } else {
                            setDenomination(true);
                            formatAmountBlur();
                          }
                        }
                      }}
                      onBlur={() => {
                        if (amount) {
                          if (selectedCurrency == "") {
                            swal({
                              title: "Currency can't be empty!!!",
                              text: "",
                              icon: "error",
                              buttons: "OK",
                              // timer: 2000,
                            }).then((result) => {
                              if (result) {
                                const input =
                                  document.getElementById("currencylov");
                                input.focus();
                                setAmount("");
                              }
                            });
                          } else {
                            setDenomination(true);
                            formatAmountBlur();
                          }
                        }
                      }}
                      // onBlur={formatAmountBlur}
                    />
                  </div>
                </div>
              </div>
              <div className="rounded mt-3 ">
                <div className="w-full py-1 ">
                  <div className="w-full mb-4">
                    <div className="">
                      <header className="text-gray-600 bg-[#daecfe]  py-1 mb-1  font-semibold px-2 uppercase">
                        Ungranted Cash Request
                      </header>
                    </div>
                    <CustomTable
                      headers={["Batch Number", "Amount", "Currency", "Action"]}
                      style={{ columnAlignRight: [2], columnFormat: [2] }}
                      rowsPerPage={3}
                      data={ungranted}
                    />
                  </div>

                  <div className="w-full">
                    <div className=" mb-1">
                      <header className="text-gray-600 bg-[#daecfe]  py-1 mb-1  font-semibold px-2 uppercase">
                        Rejected Cash Request
                      </header>
                    </div>
                    <CustomTable
                      headers={["Batch Number", "Amount", "Currency", "Action"]}
                      style={{ columnAlignRight: [2], columnFormat: [2] }}
                      rowsPerPage={3}
                      data={rejectedCash}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[40%]">
            <div className="mt-1">
              <header className="text-gray-600 bg-[#daecfe] py-1 font-semibold px-2 uppercase">
                Denominations Breakdown
              </header>
              {denomination ? (
                <div>
                  <Denominations
                    showModal={denomination}
                    setShowModal={setDenomination}
                    amount={amount}
                    setSuccess={setSuccess}
                    prevAmount={prevAmount}
                    setPrevAmount={setPrevAmount}
                    setDenominationEntries={setDenominationEntries}
                    // checked={checked}
                    setAmount={setAmount}
                    currency_code={selectedCurrency}
                    postRequest={postRequest}
                    btnid={denominationbtnId}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import { useEffect, useState } from "react";
// import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
// import ListOfValue from "../../../../components/others/Fields/ListOfValue";
// import InputField from "../../../../components/others/Fields/InputField";
// import { API_SERVER } from "../../../../config/constant";
// import axios from "axios";
// import ActionButtons from "../../../../components/others/action-buttons/ActionButtons";
// import CustomTable from "../components/CustomTable";
// import swal from "sweetalert";

// export default function CashRequestFromVault() {
//   const [getTheme, setTheme] = useState(
//     JSON.parse(localStorage.getItem("theme"))
//   );
//   const [ungrantedCash, setUngrantedCash] = useState("");
//   const [currency, setCurrency] = useState([]);
//   const [currencies, setCurrencies] = useState([]);
//   const [selectedCurrency, setSelectedCurrency] = useState("010");
//   const [Balances, setBalances] = useState("");
//   const [ungranted, setUngranted] = useState("");
//   const [amount, setAmount] = useState("");
//   const [branch, setBranch] = useState("");
//   const [rejectedCash, setRejectedCash] = useState([]);
//   const [refresh, setRefresh] = useState(false);
//   const dates = new Date(
//     JSON.parse(localStorage.getItem("userInfo"))?.postingDate
//   );
//   const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
//   const day = dates.getDate();
//   const year = dates.getFullYear();

//   const headers = {
//     "x-api-key":
//       "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
//     "Content-Type": "application/json",
//   };

//   function delUngranted(batchNumber) {
//     swal("Are you sure you want to delete this transaction", "", "warning", {
//       buttons: true,
//       dangerMode: true,
//     }).then((result) => {
//       if (result) {
//         axios
//           .post(
//             API_SERVER + "/api/delete-ungranted-cash",
//             {
//               batch_number: batchNumber,
//               key: "delete_ungranted_cash_request",
//             },
//             { headers }
//           )
//           .then((response) => {
//             // console.log(response,"responseeeee")
//             if (response.data.status === "success") {
//               swal({
//                 title: response.data.message,
//                 text: "",
//                 icon: "success",
//                 buttons: "OK",
//                 timer: 1000,
//               });
//               setRefresh(!refresh);
//             } else {
//               swal({
//                 title: response.data.message,
//                 text: "",
//                 icon: "error",
//                 buttons: "OK",
//                 // timer: 1000,
//               });
//             }
//           });
//       }
//     });
//   }

//   function delRejected(batchNumber) {
//     swal("Are you sure you want to delete this transaction", "", "warning", {
//       buttons: true,
//       dangerMode: true,
//     }).then((result) => {
//       if (result) {
//         axios
//           .post(
//             API_SERVER + "/api/delete-ungranted-cash",
//             {
//               batch_number: batchNumber,
//               key: "delete_rejected_cash_request",
//             },
//             { headers }
//           )
//           .then((response) => {
//             // console.log(response,"responseeeee")
//             setRefresh(!refresh);
//             swal({
//               title: "Data Deleted successfully",
//               text: "",
//               icon: "success",
//               buttons: "OK",
//               timer: 1000,
//             });
//           });
//       }
//     });
//   }

//   useEffect(() => {
//     axios
//       .post(
//         API_SERVER + "/api/get-branch",
//         {
//           code: localStorage.getItem("userInfo").branchCode,
//         },
//         { headers }
//       )
//       .then((res) => {
//         setBranch(res.data);
//       });

//     axios
//       .get(API_SERVER + "/api/get-currency-breado/1", { headers })
//       .then((response) => {
//         console.log({ cur: response.data });
//         setCurrencies(response.data);
//       });

//     axios
//       .post(
//         API_SERVER + "/api/cash-request-from-vault",
//         {
//           key: "balance before",
//           username: JSON.parse(localStorage.getItem("userInfo")).id,
//         },
//         { headers }
//       )
//       .then((response) => {
//         setBalances(response.data);
//         // console.log(response, "from valr");
//       });

//     axios
//       .post(
//         API_SERVER + "/api/cash-request-from-vault",
//         {
//           key: "ungranted cash request",
//           username: JSON.parse(localStorage.getItem("userInfo")).id,
//         },
//         { headers }
//       )
//       .then((response) => {
//         // console.log(response,"ghhhhhhhh")
//         const arr = [];
//         response?.data?.map((i) => {
//           arr.push([
//             ...i,
//             <div className="flex justify-center w-full">
//               <div
//                 onClick={() => {
//                   delUngranted(i[0]);
//                 }}
//                 className="bg-[#d5878779] rounded py-1  w-[40px] text-center hover:ring-[2px] ring-[#e82f88] transition duration-300 ease-in-out flex justify-center items-center "
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-6 h-6 stroke-red-500"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
//                   />
//                 </svg>
//               </div>
//             </div>,
//           ]);
//         });
//         setUngranted(arr);
//       });

//     axios
//       .post(
//         API_SERVER + "/api/cash-request-from-vault",
//         {
//           key: "rejected cash request",
//           username: JSON.parse(localStorage.getItem("userInfo")).id,
//         },
//         { headers }
//       )
//       .then((response) => {
//         const arr = [];
//         response?.data?.map((i) => {
//           arr.push([
//             ...i,
//             <div className="flex justify-center w-full ">
//               <div
//                 onClick={() => {
//                   delRejected(i[0]);
//                 }}
//                 className="bg-[#d5878779] rounded py-1  w-[40px] text-center hover:ring-[2px] ring-[#e82f88] transition duration-300 ease-in-out flex justify-center items-center "
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-6 h-6 stroke-red-500"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
//                   />
//                 </svg>
//               </div>
//             </div>,
//           ]);
//         });
//         setRejectedCash(arr);
//       });
//   }, [refresh]);

//   function formatNumber(num, id) {
//     const regex = /[a-zA-Z]/;
//     if (regex.test(num) == true) {
//       swal(
//         "Error",
//         "kindly ensure amount entered doesn't contain any letters",
//         "warning"
//       ).then((result) => {
//         id.focus();
//         id.select();
//       });
//     } else {
//       const numericInput = String(num).replace(/[^0-9.]/g, "");
//       // Convert the input to a number and check if it's valid
//       const number = parseFloat(numericInput);
//       const formatted = number.toLocaleString("en-US", {
//         minimumFractionDigits: 2,
//       });
//       return formatted;
//     }
//   }

//   const NumberWithoutCommas = (number) => {
//     const formattedNumber = String(number).replace(/,/g, "");
//     return formattedNumber;
//   };

//   function formatAmountBlur() {
//     if (amount) {
//       setAmount(formatNumber(amount, document.getElementById("amount")));
//     }
//   }

//   function postRequest() {
//     axios
//       .post(
//         API_SERVER + "/api/post_prc_teller_request_from_vault",
//         {
//           tellerID: JSON.parse(localStorage.getItem("userInfo")).id,
//           currency: selectedCurrency,
//           branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
//           amount: NumberWithoutCommas(amount),
//         },
//         { headers }
//       )
//       .then((response) => {
//         if (
//           response.data.message ==
//           "INF - 05828: Request Transaction sent successfully"
//         ) {
//           swal({
//             title: response.data.message,
//             text: "",
//             icon: "success",
//             buttons: "OK",
//             timer: 2000,
//           });
//           setAmount("");
//           setSelectedCurrency("");
//           setRefresh(!refresh);
//         } else {
//           swal(response.data.message, "", { icon: "error" });
//           setAmount("");
//           document.getElementById("amount").focus();
//         }
//       });
//   }
//   return (
//     <>
//       <div className="rounded h-auto pb-1 pt-1 scale-[0.85] -mx-16 -mt-16 bg-white">
//         <ActionButtons
//           displayFetch={"none"}
//           displayAuthorise={"none"}
//           displayCancel={"none"}
//           displayNew={"none"}
//           displayDelete={"none"}
//           displayHelp={"none"}
//           displayReject={"none"}
//           displayView={"none"}
//           onOkClick={postRequest}
//         />
//         <hr className="my-[5px]" />
//         <div className=" ">
//           <div className="bg-white mt-1 ">
//             <header className="text-white bg-[#0580c0]  py-1 m-auto font-semibold px-2 uppercase w-[85%]">
//               Cash Request
//             </header>
//             <div className="">
//               <div className="bg-white mt-0.5">
//                 <div className="flex-col items-center border-2 rounded p-4 justify-start w-[85%] m-auto ">
//                   <div className="mb-4">
//                     <ListOfValue
//                       label={"Currency"}
//                       labelWidth={"25%"}
//                       inputWidth={"30%"}
//                       marginBottom={"10px"}
//                       required={true}
//                       data={currencies}
//                       value={selectedCurrency}
//                       onChange={(value) => {
//                         setSelectedCurrency(value);
//                         setTimeout(() => {
//                           const input = document.getElementById("amount");
//                           input.focus();
//                         }, 0);
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           const input = document.getElementById("amount");
//                           input.focus();
//                         }
//                       }}
//                     />
//                   </div>
//                   <div className="mb-2">
//                     <InputField
//                       label={"Amount"}
//                       labelWidth={"25%"}
//                       inputWidth={"30%"}
//                       textAlign={"right"}
//                       required={true}
//                       value={amount}
//                       id={"amount"}
//                       onChange={(e) => {
//                         setAmount(e.target.value);
//                       }}
//                       onBlur={formatAmountBlur}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-center space-x-4 p-2 rounded mt-3 ">
//                 <div className="w-[88%]  px-2 py-1 m-auto">
//                   <div className="w-full mb-4">
//                     <div className="">
//                       <header className="text-gray-600 bg-[#daecfe]  py-1 mb-1  font-semibold px-2 uppercase">
//                         Ungranted Cash Request
//                       </header>
//                     </div>
//                     <CustomTable
//                       headers={["Batch Number", "Amount", "Currency", "Action"]}
//                       style={{ columnAlignRight: [2], columnFormat: [2] }}
//                       rowsPerPage={3}
//                       data={ungranted}
//                     />
//                   </div>

//                   <div className="w-full">
//                     <div className=" mb-1">
//                       <header className="text-gray-600 bg-[#daecfe]  py-1 mb-1  font-semibold px-2 uppercase">
//                         Rejected Cash Request
//                       </header>
//                     </div>
//                     <CustomTable
//                       headers={["Batch Number", "Amount", "Currency", "Action"]}
//                       style={{ columnAlignRight: [2], columnFormat: [2] }}
//                       rowsPerPage={3}
//                       data={rejectedCash}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
