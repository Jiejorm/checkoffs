import { Modal } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
// import DataTable from "../../../../components/others/Datatable/DataTable";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import { API_SERVER, CONFIG } from "../../../../config/constant";
import InputField from "../../../../components/others/Fields/InputField";
import swal from "sweetalert";
import axios from "axios";
import { Skeleton } from "antd";
const headers = {
  "x-api-key":
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "Content-Type": "application/json",
};
function formatNumber(num) {
  const formatted = parseFloat(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });
  return formatted;
}

const dates = new Date(
  JSON.parse(localStorage.getItem("userInfo"))?.postingDate
);
const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
const day = dates.getDate();
const year = dates.getFullYear();

const Denominations = ({
  showModal,
  setShowModal,
  setSuccess,
  amount,
  setDenominationEntries,
  checked,
  setChecked,
  appCheck,
  setAmount,
  transType,
  prevAmount,
  setPrevAmount,
  currency_code,
  postRequest,
  btnid,
}) => {
  const handleShow = () => setShowModal(true);
  const [fullScreen, setFullscreen] = useState(false);
  const [modalSize, setModalSize] = useState("md");
  const [denominations, setDenominations] = useState([]);
  const [entered, setEntered] = useState("");
  // const [prevAmount, setPrevAmount] = useState("");
  const [total, setTotal] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [invalidType, setInvalidType] = useState("");
  const [quantities, setQuantities] = useState("");
  const [loading, setLoading] = useState("");
  // const [btnid, setBtnid] = useState("");

  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const isFirstLoad = useRef(true);
  const handleClose = () => {
    setShowModal(false);
    setEntered("");
    setTotal("");
    setAmount("");
    setInvalid(false);
    setPrevAmount("");
    // localStorage.setItem("approval", false);
    if (appCheck) {
      setChecked(!checked);
    }
  };

  useEffect(() => {
    Object.keys(entered).forEach((i) => {
      if (entered[i]?.amount === null) {
        delete entered[i];
      }
    });

    console.log({ entered });
    setDenominationEntries(entered);
  }, [entered]);

  useEffect(() => {
    if (
      parseFloat(amount?.replaceAll(",", "")) !==
      parseFloat(prevAmount?.replaceAll(",", ""))
    ) {
      console.log("ghanass");
      setEntered("");
      setQuantities("");
      setTotal(0);
    } else {
      handleTotal();
    }

    // return () => {
    //   setPrevAmount(amount);
    // };
  }, [showModal]);

  useEffect(() => {
    setDenominationEntries(entered);
  }, [entered]);

  async function handleSubmit() {
    // console.log({ total, amount, dd: parseFloat(amount.replaceAll(",", "")) });
    if (total != parseFloat(amount?.replaceAll(",", ""))) {
      swal({
        title: "Warning",
        text: "Amount not equal to specified amount",
        icon: "warning",
        buttons: "OK",
        dangerMode: true,
      }).then((result) => {
        if (result) {
        }
      });
    } else {
      // setEntered("");
      postRequest();
      setTotal("");
      setShowModal(false);
      setSuccess(true);
    }
  }

  useEffect(() => {
    setEntered("");
  }, [checked]);

  useEffect(() => {
    setLoading(true);
    if (showModal) {
      setSuccess(false);
    }
    setInvalid(false);
    // handleTotal();
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: currency_code,
        },
        { headers }
      )
      .then((response) => {
        setLoading(false);
        setDenominations(response?.data.denominations);
        // console.log({ response });
        // if (document.getElementById("0")) {
        //   document.getElementById("0").focus();
        // }
      });
  }, [showModal]);

  console.log({ entered });

  // useEffect(() => {
  //   denominations.map((i, key) => {
  //     const fieldName = `${i[0]}`;
  //     console.log(document.getElementById(`${key + "q"}`), fieldName);
  //     document.getElementById(`${key + "q"}`)?.value = parseFloat(
  //       entered[fieldName] / i[0]
  //     )
  //       ? entered[fieldName] / i[0]
  //       : "";
  //   });
  // }, []);
  // console.log({ enteredQ });

  function handleTotal() {
    let totalx = 0;

    Object.keys(entered).map((i) => {
      console.log(entered[i], "jj");
      if (entered[i]?.amount === "" || entered[i]?.amount === null) {
        totalx = totalx + 0;
      } else {
        totalx = totalx + parseInt(entered[i]?.amount);
      }
    });

    console.log({ totalx });
    if (parseInt(totalx) || totalx === 0) {
      setTotal(totalx);
    }
  }

  return (
    // <Modal
    //   className=""
    //   size={"35%"}
    //   opened={showModal}
    //   onClose={handleClose}
    //   withCloseButton={false}
    //   centered
    //   padding={0}
    //   closeOnClickOutside={false}
    // >
    <div className="pb-2" style={{ zoom: "84%" }}>
      <div className="">
        <div
          style={{
            background: "#0580c0",
          }}
          className=" w-full  "
        >
          {/* <div className=" flex justify-between py-1 px-2 items-center ">
              <div className="text-gray-100 font-semibold">
                DENOMINATIONS BREAKDOWN
              </div>

              <svg
                onClick={() => handleClose()}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                // style={{ padding: "10px" }}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer fill-cyan-500 stroke-gray-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div> */}
        </div>
      </div>
      <div style={{ background: "whitesmoke" }}>
        <div className=" bg-white w-full">
          {invalid && (
            <div className="bg-red-100 font-semibold text-red-500 py-1 rounded px-2 mt-2">
              {invalidType === 1
                ? "Cannot have the specified amount in this denomination"
                : "You do not have enough of this denomination "}
            </div>
          )}
          <table className="w-full mt-3 bg-white rounded-sm table-auto  border border-slate-300">
            <tbody>
              <tr
                className="py-1 font-semibold whitespace-nowrap "
                style={{
                  background: "#0580c0",
                }}
              >
                <td
                  className="py-2 px-2 border border-slate-300 text-white"
                  colSpan={2}
                >
                  Denomination
                </td>
                <td className="py-2 px-2 border border-slate-300 text-white">
                  Till Amount
                </td>
                <td className="py-2 px-2 border border-slate-300 text-white">
                  Amount
                </td>
                <td className="py-2 px-2 border border-slate-300 text-white">
                  Quantity
                </td>
              </tr>

              {denominations ? (
                denominations?.map((i, key) => {
                  const fieldName = `${i[0]}`;
                  return (
                    <tr key={key} className=" mt-1 whitespace-nowrap">
                      <td className="py-0.5 border bg-[#fbc204] font-medium text-gray-800 border-slate-200 px-2">
                        {i[0]}
                      </td>
                      <td className="py-0.5 w-48 bg-[#fbc204] font-medium text-gray-800  border border-slate-200 px-2">
                        {i[1]}
                      </td>
                      <td className="py-0.5  border bg-gray-100 text-right border-slate-200 px-2">
                        {formatNumber(i[2])}
                      </td>

                      <td className=" w-32 py-[-10px] ">
                        <input
                          type="text"
                          id={`${key}`}
                          autoFocus={key === 0}
                          className="bg-white px-1 h-full border-[2.5px] focus:outline-none  rounded-[4.5px]  w-full text-right"
                          // value={entered?.[i[0]]}
                          value={entered && entered[fieldName]?.amount}
                          onChange={(e) => {
                            e.persist();
                            setEntered((prev) => ({
                              ...prev,
                              [i[0]]: {
                                amount: e.target.value
                                  ? parseFloat(e.target.value)
                                  : null,
                                quantity: parseFloat(amount) / i[0],
                                currency_code: "010",
                              },
                            }));
                            // handleTotal();
                          }}
                          onFocus={(event) => {
                            event.target.style.borderColor = "#21de3b";
                            // event.target.style.border = "2px";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "";
                            handleTotal();
                            if (
                              parseFloat(entered[fieldName]?.amount % i[0]) !==
                                0 &&
                              e.target.value !== ""
                            ) {
                              document.getElementById(`${key}`).focus();
                              document.getElementById(
                                `${key}`
                              ).style.borderColor = "red";

                              setInvalidType(1);
                              return setInvalid(true);
                            } else if (
                              parseFloat(entered[fieldName]?.amount) >
                              i[2] * i[0]
                            ) {
                              if (transType === "O") {
                                document.getElementById(`${key}`).focus();
                                document.getElementById(
                                  `${key}`
                                ).style.borderColor = "red";
                                setInvalidType(2);
                                return setInvalid(true);
                              } else {
                                // document.getElementById(`${key + "q"}`).value =
                                //   parseFloat(
                                //     entered[fieldName]?.amount /
                                //       i[0]
                                //   )
                                //     ? entered[fieldName]?.amount /
                                //       i[0]
                                //     : "";

                                setQuantities((prev) => ({
                                  ...prev,
                                  [fieldName]: parseFloat(
                                    entered[fieldName]?.amount / i[0]
                                  )
                                    ? entered[fieldName]?.amount / i[0]
                                    : "",
                                }));
                              }
                            } else {
                              setInvalid(false);
                              console.log({ kk: entered[fieldName] });
                              // document.getElementById(`${key + "q"}`).value =
                              //   parseFloat(
                              //     entered[fieldName]?.amount / i[0]
                              //   )
                              //     ? entered[fieldName]?.amount /
                              //       i[0]
                              //     : "";

                              setQuantities((prev) => ({
                                ...prev,
                                [fieldName]: parseFloat(
                                  entered[fieldName]?.amount / i[0]
                                )
                                  ? entered[fieldName]?.amount / i[0]
                                  : "",
                              }));

                              if (entered[fieldName]?.amount) {
                                setEntered((prev) => ({
                                  ...prev,
                                  [i[0]]: {
                                    ...prev[i[0]],
                                    quantity: parseFloat(
                                      entered[fieldName]?.amount / i[0]
                                    )
                                      ? entered[fieldName]?.amount / i[0]
                                      : "",
                                  },
                                }));
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              // formatNumber(entered[fieldName]);
                              handleTotal();
                              setQuantities((prev) => ({
                                ...prev,
                                [fieldName]: parseFloat(
                                  entered[fieldName]?.amount / i[0]
                                )
                                  ? entered[fieldName]?.amount / i[0]
                                  : "",
                              }));
                              // document.getElementById(`${key + "q"}`).value =
                              //   parseFloat(
                              //     entered[fieldName] / i[0]
                              //   )
                              //     ? entered[fieldName] / i[0]
                              //     : "";
                              if (denominations?.length > key + 1) {
                                if (denominations?.length === key + 1) {
                                  document.getElementById(`1`).focus();
                                } else {
                                  document.getElementById(`${key + 1}`).focus();
                                }
                              }
                            } else if (e.key === "ArrowUp") {
                              formatNumber(entered[fieldName]);
                              if (denominations?.length < key + 1) {
                                document.getElementById(`${key + 1}`).focus();
                              }
                            } else if (e.key === "ArrowDown") {
                              formatNumber(entered[fieldName]);
                              if (denominations?.length < key + 1) {
                                document.getElementById(`${key + -1}`).focus();
                              }
                            }
                          }}
                        />
                      </td>
                      <td className=" border border-t-2  bg-gray-100 border-slate-200 px-1  text-right">
                        <input
                          type="text"
                          className="w-12 bg-gray-100  text-right"
                          value={quantities && quantities[fieldName]}
                          // id={`${key + "q"}`}
                          disabled
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>
                    <Skeleton active />
                  </td>
                  <td>
                    <Skeleton active />
                  </td>
                  <td>
                    <Skeleton active />
                  </td>
                  <td>
                    <Skeleton active />
                  </td>
                </tr>
              )}

              {entered && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-2 bg-gray-100 text-center font-semibold px-2"
                  >
                    Total
                  </td>
                  <td className="py-2 px-2 text-right border  font-semibold">
                    {total ? formatNumber(`${total}`) : "0.00"}
                  </td>
                  <td className="py-2 px-2 bg-gray-100">&nbsp;</td>
                </tr>
              )}
            </tbody>
          </table>
          {entered && (
            <div style={{ display: "none" }} className="flex justify-end mt-2 ">
              <ButtonComponent
                label="Ok"
                buttonBackgroundColor={invalid ? "#106f7049" : ""}
                onClick={invalid ? null : handleSubmit}
                buttonWidth="20%"
                buttonHeight="30px"
                id={btnid}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    // </Modal>
  );
};

export default Denominations;
