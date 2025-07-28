import { API_SERVER } from "../../../../../config/constant";
import axios from "axios";
import InputField from "../../components/inputField";

import ButtonComponent from "../../../lending/components/button/ButtonComponent";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import CustomTable from "../../components/CustomTable";
const DetailsModal = ({
  showModal,
  setShowModal,
  type,
  setForm,
  content,
  batchNo,
}) => {
  const [body, setBody] = useState("");
  const [details, setDetails] = useState([]);
  const [denomination, setDenomination] = useState("");
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  // console.log({transNo})

  useEffect(() => {
    if (type === "A") {
      async function getSameDay() {
        const response = await axios.post(
          API_SERVER + "/api/transaction-reversal",
          {
            key: "same-day",
            transNo: batchNo,
          },
          { headers }
        );
        setDetails(response.data);

        axios
          .post(
            API_SERVER + "/api/transaction-reversal",
            {
              key: "details",
              transNo: response.data[0],
              batchNo: response.data[3],
            },
            { headers }
          )
          .then((response) => {
            setDenomination(response?.data?.denominations);
            console.log({ response });
          });
      }
      getSameDay();
    } else {
      axios
        .post(
          API_SERVER + "/api/transaction-reversal",
          {
            key: "details",
            transNo: content?.transNo,
            batchNo: content?.batchNo,
          },
          { headers }
        )
        .then((response) => {
          setDenomination(response?.data?.denominations);
          console.log({ response });
        });

      async function getSameDay() {
        const response = await axios.post(
          API_SERVER + "/api/transaction-reversal",
          {
            key: "same-day",
            transNo: content?.transNo ?? batchNo,
          },
          { headers }
        );

        console.log({ response, content });

        setDetails(response.data);
      }

      getSameDay();
    }
  }, [showModal]);

  async function handleApproval() {
    const response = await axios.post(
      API_SERVER + "/api/transaction-reversal",
      {
        key: "approve",
        transNo: details[0],
        accountNo: details[1],
        batchNo: details[3],
        transType: details[4],
        amount: Math.abs(details[5]),
        branch: JSON.parse(localStorage.getItem("userInfo"))?.branchCode,
        username: JSON.parse(localStorage.getItem("userInfo"))?.id,
        terminal: localStorage.getItem("ipAddress"),
      },
      { headers }
    );

    swal({
      allowOutsideClick: false,

      text: response.data + "Approval Successful",
      icon: "success",
      buttons: "Ok",
      // dangerMode: true,
    }).then((result) => {
      if (result) {
        setShowModal(false);
      }
    });
  }
  console.log({ details });
  function formatDate(value) {
    const eDate = new Date(value);
    const value_date = eDate
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

    return value_date;
  }

  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2 });
    return formatted;
  }

  async function handleReverse() {
    const response = await axios.post(
      API_SERVER + "/api/transaction-reversal",
      {
        key: "reverse",
        transNo: details[0],
        accountNo: details[1],
        batchNo: details[3],
        transType: details[4],
        amount: Math.abs(details[5]),
        branch: JSON.parse(localStorage.getItem("userInfo"))?.branchCode,
        username: JSON.parse(localStorage.getItem("userInfo"))?.id,
      },
      { headers }
    );

    swal({
      allowOutsideClick: false,

      text: response.data,
      icon: "success",
      buttons: "Ok",
      // dangerMode: true,
    }).then((result) => {
      if (result) {
        setShowModal(false);
      }
    });
  }
  return (
    <div className="  w-full px-3" style={{ zoom: "85%" }}>
      <div className=" w-full mt-6 ">
        <div className="mb-2">
          <InputField
            label={"Transaction Number"}
            labelWidth={"17.7%"}
            inputWidth={"29.5%"}
            marginBottom={"15px"}
            disabled={true}
            value={details.length > 0 ? details[0] : ""}
          />
        </div>
        <hr className="mb-2" />
        <div className="flex">
          <div className="w-[60%] pr-2">
            <div>
              <InputField
                disabled={true}
                label={"Account Number"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                value={details.length > 0 ? details[1] : ""}
              />
              <InputField
                disabled={true}
                label={"Account Name"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                value={details.length > 0 ? details[2] : ""}
              />
              <InputField
                disabled={true}
                label={"Document Reference"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                value={details.length > 0 ? details[3] : ""}
              />
              <InputField
                disabled={true}
                label={"Transaction Type"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                value={details.length > 0 ? details[4] : ""}
              />
              <InputField
                disabled={true}
                label={"Amount"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                textAlign={"right"}
                value={
                  details.length > 0 ? formatNumber(Math.abs(details[5])) : ""
                }
              />
              <InputField
                disabled={true}
                label={"Posting Date"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                value={details.length > 0 ? formatDate(details[6]) : ""}
              />
              <InputField
                disabled={true}
                label={"Value Date"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                value={details.length > 0 ? formatDate(details[7]) : ""}
              />
              <InputField
                disabled={true}
                label={"Transaction Details 1"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                value={details.length > 0 ? details[8] : ""}
              />
              <InputField
                disabled={true}
                label={"Transaction Details 2"}
                labelWidth={"30%"}
                inputWidth={"50%"}
                marginBottom={"15px"}
                value={details.length > 0 ? details[9] : ""}
              />
            </div>
          </div>
          <div className="w-[40%]">
            <CustomTable
              headers={["Denomination", "Amount"]}
              style={{ columnAlignRight: [2], columnFormat: [2] }}
              data={denomination}
            />
          </div>
        </div>
        <div className="py-2 flex justify-end">
          {type === "A" ? (
            <ButtonComponent
              label={"Approve"}
              onClick={handleApproval}
              buttonWidth={"12%"}
              // buttonBackgroundColor={"orange"}
            />
          ) : (
            <ButtonComponent
              label={"Reverse"}
              onClick={handleReverse}
              buttonWidth={"12%"}
              // buttonBackgroundColor={"orange"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
