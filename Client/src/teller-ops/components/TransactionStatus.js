import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/others/Datatable/DataTable";
import { API_SERVER } from "../../../../config/constant";
import axios from "axios";
import InputField from "./inputField";
import ListOfValue from "./ListOfValue";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import CustomTable from "./CustomTable";
import { headers } from "../teller/teller-activities";
import Swal from "sweetalert2";
function TransactionStatus() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState("");
  const [tMessage, setTMessage] = useState("");
  const [statChange, setStatChange] = useState(false);

  useEffect(() => {
    setTMessage("Loading , Please wait ...");
    axios
      .post(
        API_SERVER + "/api/transaction-status",
        { username: JSON.parse(localStorage.getItem("userInfo")).id },
        { headers }
      )
      .then((res) => {
        const arr = [];

        res.data.map((i) => {
          const [a, b, c, d, e, f, g, h, z] = i;
          console.log(z, "z");
          arr.push([
            a,
            b,
            c,
            d,
            e,
            f,
            formatNumber(g),
            formatDate(h),
            z,
            <div
              onClick={() => {
                // console.log("from ghana");
                if (z?.includes("APPROVE")) {
                  handleDelete(i);
                }
              }}
              className={`${
                z?.includes("APPROVE")
                  ? "bg-[#d5878779] ring-[#e82f88] hover:ring-[2px]"
                  : "bg-zinc-300 ring-gray-400 hover:ring-[1px] cursor-not-allowed"
              }  rounded py-2  w-[40px] text-center  transition duration-300 ease-in-out flex justify-center items-center `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-4 h-4 ${
                  z?.includes("APPROVE") ? "stroke-red-500" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M6.72 5.66l11.62 11.62A8.25 8.25 0 006.72 5.66zm10.56 12.68L5.66 6.72a8.25 8.25 0 0011.62 11.62zM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788z"
                  clipRule="evenodd"
                />
              </svg>
            </div>,
          ]);
        });

        if (arr.length > 0) {
          setTMessage("");
          setData(arr);
        } else {
          setTMessage("No data found");
          setData(arr);
        }

        // console.log({ res });
      });
  }, [statChange]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(dateString)?.toLocaleDateString("en-US", options);

    const [day, month, year] = date.split(" ");

    const formattedDate = `${day}-${month.toUpperCase()}-${year}`;

    return formattedDate;
  };

  function formatNumber(num) {
    const formatted = num?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }
  function handleFilter() {
    axios
      .post(
        API_SERVER + "/api/transaction-status",
        {
          username: JSON.parse(localStorage.getItem("userInfo")).id,
          ...formData,
        },
        { headers }
      )
      .then((res) => {
        const arr = [];
        res.data.map((i) => {
          const [a, b, c, d, e, f, g, h, z] = i;
          arr.push([
            a,
            b,
            c,
            d,
            e,
            f,
            formatNumber(g),
            formatDate(h),
            z,
            <div
              onClick={() => {
                // console.log("from ghana");
                if (z?.includes("APPROVE")) {
                  handleDelete(i);
                }
              }}
              className={`${
                z?.includes("APPROVE")
                  ? "bg-[#d5878779] ring-[#e82f88] hover:ring-[2px]"
                  : "bg-zinc-300 ring-gray-400 hover:ring-[1px] cursor-not-allowed"
              } rounded py-2  w-[40px] text-center  transition duration-300 ease-in-out flex justify-center items-center `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-4 h-4 ${
                  z?.includes("APPROVE") ? "stroke-red-500" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M6.72 5.66l11.62 11.62A8.25 8.25 0 006.72 5.66zm10.56 12.68L5.66 6.72a8.25 8.25 0 0011.62 11.62zM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788z"
                  clipRule="evenodd"
                />
              </svg>
            </div>,
          ]);
        });

        setData(arr);
      });
  }

  function handleDelete(row) {
    axios
      .post(
        API_SERVER + "/api/transaction-status",
        {
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          key: "delete",
          account_number: row[2],
          trans_number: row[0],
          amount: row[6],
          branch: JSON.parse(localStorage.getItem("userInfo"))?.branchCode,
          terminal: localStorage.getItem("ipAddress"),
          currency: row[4],
        },
        { headers }
      )
      .then((res) => {
        console.log({ res });
        handleFilter();
        Swal.fire({
          allowOutsideClick: false,
          text: "Successfully Cleared",
          timer: 3000,
          icon: "success",
          showConfirmButton: false,
        });
      });
  }
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        // Perform your desired function here
        document.getElementById("filter")?.click();
        console.log("Enter key pressed!");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    // <></>
    <div className="transform scale-[0.85] -mx-24 -mt-[4%]">
      {/* <hr className="my-[6px]" /> */}

      <div className="flex  space-x-3 border-2 rounded  mb-3 px-3 mt-4 ">
        <div className=" px-4 py-3 w-full ">
          <InputField
            label={"Username"}
            labelWidth={"15%"}
            inputWidth={"30%"}
            disabled={true}
            marginBottom={"8px"}
            value={JSON.parse(localStorage.getItem("userInfo")).id}
          />

          <div className="font-bold text-gray-400 text-xs">FILTERS</div>
          <hr className="mb-2" />

          <div className="flex mb-[5px]">
            <ListOfValue
              label={"Transaction Status"}
              labelWidth={"30%"}
              inputWidth={"60%"}
              data={[
                "APPLIED",
                "APPROVED",
                "REJECTED",
                "REVERSED",
                "UNAPPROVED",
                { label: "ALL TRANSACTION STATUS", value: "" },
              ]}
              value={formData?.status}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, status: value }));
                axios
                  .post(
                    API_SERVER + "/api/transaction-status",
                    {
                      username: JSON.parse(localStorage.getItem("userInfo")).id,
                      ...formData,
                      status: value,
                    },
                    { headers }
                  )
                  .then((res) => {
                    const arr = [];
                    res.data.map((i) => {
                      const [a, b, c, d, e, f, g, h, z] = i;
                      arr.push([
                        a,
                        b,
                        c,
                        d,
                        e,
                        f,
                        formatNumber(g),
                        formatDate(h),
                        z,
                        <div
                          onClick={() => {
                            // console.log("from ghana");
                            if (z?.includes("APPROVE")) {
                              handleDelete(i);
                            }
                          }}
                          className={`${
                            z?.includes("APPROVE")
                              ? "bg-[#d5878779] ring-[#e82f88] hover:ring-[2px]"
                              : "bg-zinc-300 ring-gray-400 hover:ring-[1px] cursor-not-allowed"
                          } rounded py-2  w-[40px] text-center  transition duration-300 ease-in-out flex justify-center items-center `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`w-4 h-4 ${
                              z?.includes("APPROVE") ? "stroke-red-500" : ""
                            }`}
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.72 5.66l11.62 11.62A8.25 8.25 0 006.72 5.66zm10.56 12.68L5.66 6.72a8.25 8.25 0 0011.62 11.62zM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>,
                      ]);
                    });

                    setData(arr);
                  });
              }}
            />

            <InputField
              label={"Batch Number"}
              labelWidth={"35%"}
              inputWidth={"60%"}
              value={formData?.batch_number}
              onChange={(e) => {
                e.persist();
                setFormData((prev) => ({
                  ...prev,
                  batch_number: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex">
            <InputField
              label={"Account Number"}
              labelWidth={"22.5%"}
              inputWidth={"45%"}
              type={"number"}
              value={formData?.account_number}
              onChange={(e) => {
                e.persist();
                setFormData((prev) => ({
                  ...prev,
                  account_number: e.target.value,
                }));
              }}
            />

            <div className="flex justify-end w-[50%] mt-2 mr-[9px]">
              <ButtonComponent
                id={"filter"}
                label={"Filter"}
                buttonWidth={"20%"}
                buttonHeight={"30px"}
                onClick={handleFilter}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="">
        {/* <div className="h-[300px]"></div> */}
        <CustomTable
          rowsPerPage={10}
          title={"Transaction Status"}
          headers={[
            "Batch Number",
            "Trans Number",
            "Account Number",
            "Account Description",
            "Currency",
            "Transaction Details",
            "Amount",
            "Value Date",
            "Status",
            "Action",
          ]}
          style={{ columnAlignRight: [7] }}
          pagination={true}
          data={data}
          defaultMessage={tMessage}
        />
      </div>
    </div>
  );
}

export default TransactionStatus;
