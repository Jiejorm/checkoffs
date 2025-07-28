import { useEffect, useState } from "react";
import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
import ListOfValue from "../components/ListOfValue";
import InputField from "../components/inputField";
import DataTable from "../../../../components/others/Datatable/DataTable";
import { API_SERVER } from "../../../../config/constant";
import axios from "axios";
import ActionButtons from "../../../../components/others/action-buttons/ActionButtons";
import CustomTable from "../components/CustomTable";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { Modal } from "@mantine/core";
import Denominations from "../components/Denominations";
// import Denominations from "../components/cashRequestDenomination";
// import Denominations from "../components/Denominations";
export default function CashTransferToVault() {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [unConfirmedCash, setUnConfirmedCash] = useState([]);
  const [formData, setFormData] = useState({
    curency: "",
    vaultAccount: "",
  });
  const [currencies, setCurrencies] = useState([]);
  const [vaultAccounts, setVaultAccounts] = useState([]);
  const [openDenomination, setOpenDenomination] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checked, setChecked] = useState(false);
  const [batchNo, setBatchNo] = useState("");
  const [prevAmount, setPrevAmount] = useState("");
  const [denominationEntries, setDenominationEntries] = useState({});
  const [branch, setBranch] = useState("");
  const [amount, setAmount] = useState("");
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

    // axios
    //   .get(API_SERVER + "/api/get-currency-breado/2", { headers })
    //   .then((response) => {
    //     // console.log({ cur: response.data });
    //     setCurrency(response.data);
    //   });

    axios
      .get(API_SERVER + "/api/get-currency-breado/1", { headers })
      .then((response) => {
        console.log({ cur: response.data });
        setCurrencies(response.data);
      });
  }, []);

  async function fetchUngranted() {
    const response = await axios.post(
      API_SERVER + "/api/cash-transfer-to-vault",
      {
        key: "unconfirmed transfers",
        username: JSON.parse(localStorage.getItem("userInfo")).id,
      },
      { headers }
    );

    const data = response?.data?.map((i) => {
      const [a, b, c] = i;
      return [
        ...i,
        <div className="flex justify-center">
          <div
            className="text-red-500 border-2 border-red-500 flex justify-center transition-all items-center hover:bg-red-500 hover:text-white rounded p-1 h-6 w-6"
            onClick={() => {
              deleteUnconfirmedCash(a);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21.07 5.23c-1.61-.16-3.22-.28-4.84-.37v-.01l-.22-1.3c-.15-.92-.37-2.3-2.71-2.3h-2.62c-2.33 0-2.55 1.32-2.71 2.29l-.21 1.28c-.93.06-1.86.12-2.79.21l-2.04.2c-.42.04-.72.41-.68.82.04.41.4.71.82.67l2.04-.2c5.24-.52 10.52-.32 15.82.21h.08c.38 0 .71-.29.75-.68a.766.766 0 0 0-.69-.82Z"
                fill="#fd0031"
              ></path>
              <path
                opacity=".399"
                d="M19.23 8.14c-.24-.25-.57-.39-.91-.39H5.68c-.34 0-.68.14-.91.39-.23.25-.36.59-.34.94l.62 10.26c.11 1.52.25 3.42 3.74 3.42h6.42c3.49 0 3.63-1.89 3.74-3.42l.62-10.25c.02-.36-.11-.7-.34-.95Z"
                fill="#fd0031"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.58 17a.75.75 0 0 1 .75-.75h3.33a.75.75 0 0 1 0 1.5h-3.33a.75.75 0 0 1-.75-.75ZM8.75 13a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Z"
                fill="#fd0031"
              ></path>
            </svg>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg> */}
          </div>
        </div>,
      ];
    });
    setUnConfirmedCash(data);
    // console.log({ uuu: response?.data });
  }

  async function getVaultAcct() {
    const response = await axios.post(
      API_SERVER + "/api/cash-transfer-to-vault",
      {
        key: "vault account",
        username: JSON.parse(localStorage.getItem("userInfo")).id,
        branch_code: JSON.parse(localStorage.getItem("userInfo")).branchCode,
      },
      { headers }
    );

    console.log({ response });
    setVaultAccounts(response.data);
  }

  async function deleteUnconfirmedCash(batch_no) {
    Swal.fire({
      title: "Are you sure want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          const response = await axios.post(
            API_SERVER + "/api/cash-transfer-to-vault",
            {
              key: "cancel-unconfirmed",
              batch_no,
            },
            { headers }
          );
          setRefetch(!refetch);
          Swal.fire({
            icon: `success`,
            text: response?.data?.responseMessage,
          });
          // console.log({ response });
        }
      } catch (error) {
        Swal.fire({
          icon: `error`,
          text: error?.toString(),
        });
      }
    });
  }

  useEffect(() => {
    Promise.all([fetchUngranted(), getVaultAcct()]);
  }, [refetch, checked]);

  useEffect(() => {
    async function getBatchNumber() {
      const response = await axios.get(API_SERVER + "/api/get-unique-ref", {
        headers,
      });

      setBatchNo(response.data[0]["unique_ref"]);
    }
    getBatchNumber();
  }, [checked]);

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

  async function handleCashTransfer() {
    const response = await axios.post(
      API_SERVER + "/api/cash-transfer-to-vault",
      {
        key: "transfer-cash",

        username: JSON.parse(localStorage.getItem("userInfo")).id,
        currency: formData?.currency,

        contraAccount: formData?.vaultAccount?.split("-")[0]?.trim(),
        vaultAccount: formData?.vaultAccount?.split("-")[2]?.trim(),

        postingDate: JSON.parse(localStorage.getItem("userInfo")).postingDate,
        denominations: denominationEntries,
        // quantity,
        // amount,
        batch_no: batchNo,
        branch_code: JSON.parse(localStorage.getItem("userInfo")).branchCode,
      },
      { headers }
    );
    handleNew();
    Swal.fire({
      title: "Success",
      text: response?.data?.responseMessage,
      icon: "success",
    }).then((res) => {
      if (res.isConfirmed) {
      }
    });
  }

  function handleNew() {
    setChecked(!checked);
    setOpenDenomination(false);
    setFormData({ curency: "", vaultAccount: "" });
  }

  useEffect(() => {
    if (formData?.currency && formData?.vaultAccount) {
      setOpenDenomination(true);
    }
  }, [formData?.currency, formData?.vaultAccount]);
  console.log({ denominationEntries });
  return (
    <>
      <div className="rounded h-auto pb-2 pt-2 scale-[0.85] -mx-20 -mt-6 bg-white">
        <ActionButtons
          displayFetch={"none"}
          displayAuthorise={"none"}
          displayCancel={"none"}
          displayDelete={"none"}
          displayHelp={"none"}
          displayReject={"none"}
          displayView={"none"}
          displayRefresh={"none"}
          displayOk={"none"}
          onOkClick={handleCashTransfer}
        />
        <hr className="my-[5px]" />

        <div className="">
          <div className="bg-white mt-1">
            <div className="">
              <div className="bg-white mt-0.5">
                <div className="flex-col items-center border-2 rounded p-4 justify-start w-[85%] m-auto ">
                  <div className="flex justify-end">
                    <InputField
                      label={"Batch Number"}
                      labelWidth={"25%"}
                      inputWidth={"50%"}
                      marginBottom={"10px"}
                      disabled={true}
                      value={batchNo}
                    />
                  </div>
                  <div className="mb-4">
                    <ListOfValue
                      label={"Currency"}
                      labelWidth={"25%"}
                      inputWidth={"50%"}
                      marginBottom={"10px"}
                      required={true}
                      data={currencies}
                      value={formData?.currency}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          currency: value,
                        }));
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <ListOfValue
                      label={"Vault Account"}
                      labelWidth={"25%"}
                      inputWidth={"50%"}
                      textAlign={"right"}
                      required={true}
                      data={vaultAccounts}
                      value={formData?.vaultAccount}
                      onChange={(value) => {
                        // setOpenDenomination(false);

                        setFormData((prev) => ({
                          ...prev,
                          vaultAccount: value,
                        }));
                      }}
                      // onBlur={formatAmountBlur}
                    />
                  </div>
                </div>
              </div>
              {/* <hr className="my-[7px]" /> */}
              <div className="flex justify-center space-x-4 p-2 rounded border-2 mt-3 ">
                <div className="w-[88%]  px-2 py-1 ">
                  <div className="w-full mb-4">
                    <header className="text-gray-600 bg-[#daecfe]  py-1 mb-1  font-semibold px-2 uppercase">
                      Unconfirmed Cash transfers
                    </header>
                    <CustomTable
                      headers={[
                        "Batch No",
                        "Currency",
                        "Transfer Amount",
                        "Transfer To",
                        "Action",
                      ]}
                      style={{
                        columnAlignRight: [3],
                        columnFormat: [3],
                      }}
                      data={unConfirmedCash}
                    />
                  </div>
                </div>

                <Denominations
                  okayBtn={{
                    label: "Transfer",
                    function: handleCashTransfer,
                  }}
                  showModal={openDenomination}
                  setShowModal={setOpenDenomination}
                  amount={amount}
                  setSuccess={setSuccess}
                  prevAmount={prevAmount}
                  setPrevAmount={setPrevAmount}
                  setDenominationEntries={setDenominationEntries}
                  // checked={checked}
                  setAmount={setAmount}
                  currency_code={formData?.currency}
                  postRequest={handleCashTransfer}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
