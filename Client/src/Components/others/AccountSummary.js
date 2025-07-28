import { useEffect, useState } from "react";
import axios from "axios";

import { API_SERVER } from "../../config/constant";
import { Skeleton } from "antd";

export default function AccountSummary({ accountNumber, setAccountDetails, transType }) {
  const [res, setRes] = useState({});
  const [loading, setloading] = useState(false);
  const [isMounted, setIsMounted] = useState(1);

  const [getTheme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")));

  const headers = {
    "x-api-key": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };
  // const headers = {
  //   "x-api-key": process.env.REACT_APP_API_KEY,
  //   "Content-Type": "application/json",
  // };

  console.log({ accountNumber }, "acc number");

  function isFloat(str) {
    return /^\d+(\.\d+)?$/.test(str.replace("-", ""));
  }

  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2 });
    // console.log({ formatted }, amount);

    return formatted;
  }
  useEffect(() => {
    setIsMounted(isMounted + 1);
    // console.log({ accountNumber });
    async function fetchAccountDetails() {
      try {
        if (accountNumber) {
          setloading(true);
          const response = await axios.post(
            API_SERVER + "/api/get-account-summary",
            {
              account_number: accountNumber,
              transType: transType,
            },
            { headers }
          );

          console.log(",,,", response);
          if (response?.data.summary.length === 0) {
            setRes({});
            // setAccountDetails({});
            setAccountDetails(response?.data);
            setloading(false);
          } else {
            const {
              cust_type,
              account_name,
              currency_code,
              date_opened,
              post_av_bal,
              post_bookbal,
              date_of_last_activity,
              customer_no,
              unauth_od,
              ...others
            } = response?.data?.summary[0];
            setAccountDetails(response?.data);
            // console.log(response, "res");
            setRes(others);
            setloading(false);
          }
        } else {
          setRes({});
        }
      } catch (error) {
        setloading(false);
      }
    }

    fetchAccountDetails();
    // if (isMounted === 1) {
    //   setloading(false);
    //   fetchAccountDetails();
    // } else {
    //   setloading(true);
    //   fetchAccountDetails();
    // }
  }, [accountNumber]);
  // console.log(isMounted, "from grid");
  const [title, setTitle] = useState("");
  return (
    <>
      <table className="w-full bg-white rounded border  ">
        <tbody>
          <tr
            className="py-1 font-medium text-white "
            style={{
              backgroundColor: "#0580c0",
            }}
          >
            <td className="w-1/2 px-2">Description</td>
            <td className="w-1/2 px-2">Value</td>
          </tr>
          {!loading &&
            Object.entries(res)?.map((i, key) => {
              return (
                <tr key={key} className="border-0">
                  <td
                    style={{
                      background: "#fbc204",
                      // "#F0CF11",
                      // "#f8e6c3",
                      // background:
                      //   `url(` +
                      //   window.location.origin +
                      //   `/assets/images/headerBackground/bgOrange.jpg` +
                      //   `)`,
                    }}
                    className=" border-r font-semibold text-gray-700 border-r-slate-300  w-1/2 capitalize px-2"
                  >
                    {i[0].replace("_", " ")}
                  </td>
                  <td className=" border-l border-r-slate-300  bg-[whitesmoke] w-1/2 px-2">
                    {i[1] === "null" || i[1].includes("**")
                      ? "0.00"
                      : isFloat(i[1])
                      ? formatNumber(parseFloat(i[1]))
                      : i[1].trim()}
                  </td>
                </tr>
              );
            })}
        </tbody>
        {loading && (
          <tfoot className="">
            <tr>
              <td>
                <Skeleton active />
              </td>
              <td>
                <Skeleton active />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </>
  );
}
