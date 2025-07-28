import { useEffect, useState } from "react";
import ListOfValue from "../components/ListOfValue";
import InputField from "../components/inputField";
import { API_SERVER } from "../../../../config/constant";
import axios from "axios";
import ActionButtons from "../../../../components/others/action-buttons/ActionButtons";
import CustomTable from "../components/CustomTable";
import SelectField from "./SelectField";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import Swal from "sweetalert2";

export default function TellerClosure() {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [ungrantedCash, setUngrantedCash] = useState("");
  const [currency, setCurrency] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [formExit, setFormExit] = useState("");
  const [denominationtrans, setDenominationTrans] = useState([]);
  const [accountTrans, setAccountTrans] = useState([]);
  const [ungranted, setUngranted] = useState("");
  const [transDetails, setTransDetails] = useState("");
  const [tellerName, setTellerName] = useState(
    JSON.parse(localStorage.getItem("userInfo")).id
  );
  const [branch, setBranch] = useState("");
  const dates = new Date(
    JSON.parse(localStorage.getItem("userInfo")).postingDate
  );
  const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
  const day = dates.getDate();
  const year = dates.getFullYear();

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  function formatNumber(num) {
    if (isNaN(num)) {
      // return 0;
      return "";
    }
    const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2 });
    // console.log({ formatted }, amount);

    return formatted;
  }
  function Notify({ title, icon, confirmButtonText }) {
    Swal.fire({
      title: title,
      icon: icon,
      //   showCancelButton: true,
      confirmButtonText: confirmButtonText,
      //   cancelButtonText:"No",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }
  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/teller-closure",
        {
          key: "denomination transactions",
          username: JSON.parse(localStorage.getItem("userInfo")).id,
        },
        { headers }
      )
      .then((response) => {
        console.log({ response });
        // return;
        const arr = [];
        let lastColumnTotal = 0;
        response?.data?.map((i) => {
          const formattedColumn2 = formatNumber(i[2]);
          const formattedColumn3 = formatNumber(i[3]);
          const formattedColumn4 = formatNumber(i[4]);
          const formattedColumn5 = formatNumber(i[5]);
          const formattedColumn6 = formatNumber(i[6]);
          arr.push([
            i[0],
            i[1],
            formattedColumn2,
            formattedColumn3,
            formattedColumn4,
            formattedColumn5,
            formattedColumn6,
          ]);

          // const lastColumnValue = i[6]; // Replace '2' with the index of the last column

          // if (!isNaN(lastColumnValue)) {
          //   lastColumnTotal += lastColumnValue;
          // }
        });

        // const formattedLastColumnTotal = formatNumber(lastColumnTotal);
        // const lastRowData = ["", "", "", "", "", "", formattedLastColumnTotal];

        // // Push the last row data into the arr array
        // arr.push(lastRowData);
        setDenominationTrans(arr);
        console.log(response, "from apiiii");
      });
    // axios
    //   .post(
    //     API_SERVER + "/api/teller-closure",
    //     {
    //       key: "account transactions",
    //       username: JSON.parse(localStorage.getItem("userInfo")).id,
    //     },
    //     { headers }
    //   )
    //   .then((response) => {
    //     console.log(response, "account trans");
    //     const arr = [];
    //     response?.data?.map((i) => {
    //       const formattedColumn2 = formatNumber(i[2]);
    //       const formattedColumn3 = formatNumber(i[3]);
    //       const formattedColumn4 = formatNumber(i[4]);
    //       const formattedColumn5 = formatNumber(i[5]);
    //       arr.push([
    //         i[0],
    //         i[1],
    //         formattedColumn2,
    //         formattedColumn3,
    //         formattedColumn4,
    //         formattedColumn5,
    //       ]);
    //     });
    //     // const lastRowData = [
    //     //   "",
    //     //   "",
    //     //   "",
    //     //   "",
    //     //   "",
    //     //   "",
    //     //   "Last Row Value 2",

    //     // ];

    //     // // Push the last row data into the arr array
    //     // arr.push(lastRowData);
    //     setAccountTrans(arr);
    //     console.log(response, "from apiiii");
    //   });

    axios
      .post(
        API_SERVER + "/api/teller-closure",
        {
          key: "trans details",
          username: JSON.parse(localStorage.getItem("userInfo")).id,
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data, "trans details");
        // return console.log("response.data.data1[0]")

        // Extracting values from the arrays
        if (response.data.data1.length !== 0 && response.data.data2.length) {
          const [credit1, debit1] = response?.data?.data1[0];
          const [credit2, debit2, diff] = response?.data?.data2[0];
          const combinedData = {
            credit: [credit1, credit2],
            debit: [debit1, debit2],
            diff: diff,
          };

          setTransDetails(combinedData);
          console.log(combinedData, "combineddata");
        } else {
          setTransDetails("");
        }

        // Creating the combined object
        // const arr = [];
        // response?.data?.map((i) => {
        //   arr.push([...i]);
        // });
        // setAccountTrans(arr);
        // console.log(response, "from apiiii");
      });
  }, []);
  function Notify({ title, icon, confirmButtonText }) {
    Swal.fire({
      title: title,
      icon: icon,
      //   showCancelButton: true,
      confirmButtonText: confirmButtonText,
      //   cancelButtonText:"No",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }
  function handleReset() {
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to reset this teller?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            API_SERVER + "/api/teller-closure",
            {
              key: "closure reset",
              user_v: JSON.parse(localStorage.getItem("userInfo")).id,
              bra_v: JSON.parse(localStorage.getItem("userInfo")).branchCode,
            },
            { headers }
          )
          .then((response) => {
            console.log({ response });
            return;
            const responseMessage = response?.data;
            if (responseMessage && responseMessage?.includes("05813")) {
              return Notify({
                title: response?.data,
                icon: "error",
                confirmButtonText: "OK",
              });
            } else {
              return Notify({
                title: response?.data,
                icon: "success",
                confirmButtonText: "OK",
              });
            }
          });
      }
    });
  }

  function handleClosure() {
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to close this teller?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios
          .post(
            API_SERVER + "/api/teller-closure",
            {
              key: "teller closure",
              user_v: JSON.parse(localStorage.getItem("userInfo")).id,
              bra_v: JSON.parse(localStorage.getItem("userInfo")).branchCode,
              formcode: "TTTI",
            },
            { headers }
          )
          .then((response) => {
            const responseMessage = response?.data; // This gets the data property of the response object (if it exists)

            if (responseMessage && responseMessage.includes("Successful")) {
              return Notify({
                title: response?.data,
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              return Notify({
                title: response?.data,
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          });
      }
    });
  }
  return (
    <>
      <div className="rounded h-auto pb-2 -mt-12 transform scale-[0.85] -mx-24  bg-white">
        <ActionButtons
          displayFetch={"none"}
          displayAuthorise={"none"}
          displayRefresh={"none"}
          displayHelp={"none"}
          displayReject={"none"}
          displayCancel={"none"}
          displayView={"none"}
          onOkClick={handleClosure}
        />
        <hr className="mt-2" />
        <div className="   bg-gray-200 ">
          <div className="bg-white mt-1">
            <header className="text-gray-600 bg-[#daecfe]  py-1  font-semibold px-2 uppercase">
              Teller Closure
            </header>

            <div className="">
              <div className="bg-white mt-0.5">
                <div className="flex items-center border-2 rounded p-4 justify-between ">
                  <div className="w-[50%]">
                    <InputField
                      inputWidth={"40%"}
                      label={"Teller Name"}
                      labelWidth={"40%"}
                      // textAlign={"right"}
                      value={tellerName}
                      marginBottom={"10px"}
                      disabled={true}
                      onChange={(e) => {
                        e.persist();
                        setTellerName(e.target.value);
                        // if (e.target.value !== "") {
                        //   setAmount(e.target.value);
                        // } else {
                        //   amount.replaceAll(",", "");
                        // }
                      }}
                      //   onKeyPress={(e) => {
                      //     if (e.key === "Enter") {
                      //       setAmount(formatNumber(amount));
                      //     }
                      //   }}
                    />
                    {/* 
                    <SelectField
                      label={"Enter 'Y' to close or 'N' to Exit form"}
                      labelWidth={"40%"}
                      inputWidth={"40%"}
                      data={[
                        { label: "Yes", value: "Y" },
                        { label: "No", value: "N" },
                      ]}
                      value={formExit}
                      onChange={(value) => {
                        setFormExit(value);
                      }}
                    /> */}
                  </div>
                  <ButtonComponent
                    onClick={handleReset}
                    label="Closure Reset"
                    buttonBackgroundImage={
                      `url(` +
                      window.location.origin +
                      `/assets/images/headerBackground/` +
                      getTheme.theme.headerImage +
                      `)`
                    }
                    buttonWidth="10%"
                    buttonHeight="30px"
                    buttonColor="white"
                  />
                </div>
                <div className=" bg-white py-[10px] mt-2">
                  <div className="flex bg-white justify-end  space-x-1 mb-1">
                    {/* <div>
                      <InputField
                        label={"Total Credits"}
                        labelWidth={"55%"}
                        inputWidth={"45%"}
                        disabled={true}
                        value={
                          transDetails?.credit?.length > 0
                            ? formatNumber(transDetails?.credit[1])
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <InputField
                        label={"Total Debits"}
                        labelWidth={"35%"}
                        inputWidth={"65%"}
                        disabled={true}
                        value={
                          transDetails?.debit?.length > 0
                            ? formatNumber(transDetails?.debit[1])
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <InputField
                        label={"Difference"}
                        labelWidth={"30%"}
                        inputWidth={"70%"}
                        disabled={true}
                        value={formatNumber(transDetails?.diff)}
                      />
                    </div> */}
                    <div>
                      <InputField
                        label={"Total Credits Counts"}
                        labelWidth={"50%"}
                        inputWidth={"35%"}
                        disabled={true}
                        value={
                          transDetails?.credit?.length > 0
                            ? transDetails?.credit[0]
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <InputField
                        label={"Total Debits Counts"}
                        labelWidth={"50%"}
                        inputWidth={"35%"}
                        disabled={true}
                        value={
                          transDetails?.debit?.length > 0
                            ? transDetails?.debit[0]
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* <hr className="my-[7px]" /> */}
              <div className="flex space-x-4 p-2 rounded border-2 mt-3 ">
                <div className="w-[100%]  px-2 py-1">
                  <div className="w-full mb-4">
                    <div className="py-1 uppercase font-semibold  text-gray-600">
                      Denomination Transactions
                    </div>
                    <CustomTable
                      headers={[
                        "Currency",
                        "Sent To Vault",
                        "Recieved From Vault",
                        "Total Payment",
                        "Total Receipts",
                        "Difference",
                        "Net Position",
                      ]}
                      style={{
                        columnAlignRight: [2, 3, 4, 5, 6, 7],
                        columnFormat: [2],
                      }}
                      //   rowsPerPage={5}
                      data={denominationtrans}
                    />
                  </div>

                  {/* <div className="w-full">
                    <div className="font-semibold te mb-2 py-1 uppercase text-gray-600">
                      Account Transactions
                    </div>
                    <CustomTable
                      headers={[
                        "Currency",
                        "Contra",
                        "Total Payment",
                        "Total Receipts",
                        "Net Position",
                      ]}
                      // style={{ columnAlignRight: [2], columnFormat: [2] }}
                      // rowsPerPage={5}
                      data={accountTrans}
                    />
                  </div> */}
                </div>
                {/* <div className="w-[35%] py-1 px-2   bg-white">
                  <div className="mb-1 uppercase font-semibold text-gray-600">
                    Balance Before
                  </div>

                  <CustomTable
                    headers={["Currency", "Balance"]}
                    style={{ columnAlignRight: [2], columnFormat: [2] }}
                    data={Balances}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
