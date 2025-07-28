import { Modal } from "@mantine/core";
import React, { useEffect, useState } from "react";
import InputField from "../../../components/inputField";
import axios from "axios";
import { API_SERVER } from "../../../../../../config/constant";
import { headers } from "../../teller-activities";
import { formatDate } from "../../../../accounts/lien/lien-approval";

export default function CalloverDetails({ showModal, setShowModal, trans_no }) {
  const [formData, setFormData] = useState("");
  function handleClose() {
    setShowModal(false);
    setFormData({ posting_date: null });
  }

  async function handleCalloverDetails() {
    try {
      const response = await axios.post(
        `${API_SERVER}/api/get-callover-details`,
        {
          trans_no,
        },
        { headers: headers }
      );

      console.log(response, "ghanaaa");
      setFormData(response.data[0]);
    } catch (e) {
      console.log(e);
    }
  }

  function isStringNull(value) {
    if (value == "null") {
      return "";
    } else {
      return value;
    }
  }
  useEffect(() => {
    handleCalloverDetails();
  }, [showModal]);
  return (
    <Modal
      size={"65%"}
      opened={showModal}
      trapFocus={false}
      // onHide={handleClose}
      withCloseButton={false}
      padding={0}
      // zIndex={"inherit"}
      centered
      onClose={() => {}}
    >
      <div className="p-0 m-0  ">
        <div
          style={{
            background: "#0580c0",
            zoom: 0.9,
          }}
          className=" w-full rounded-t shadow"
        >
          <div className=" flex justify-between py-1 px-2 items-center ">
            <div className="text-white font-semibold uppercase tracking-wider">
              Transaction Details
            </div>

            <svg
              onClick={() => handleClose()}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              // style={{ padding: "10px" }}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 z-50 cursor-pointer fill-cyan-500 stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        {/* <hr style={{ marginTop: "-10%" }} /> */}
      </div>

      <div style={{ zoom: 0.9 }} className="scale-95  py-7">
        <div className="flex justify-end mt-2">
          <button className="bg-black px-3 py-1 space-x-[6px] rounded-md text-white">
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
                d="M15.8 2.21c-.41-.41-1.12-.13-1.12.44v3.49c0 1.46 1.24 2.67 2.75 2.67.95.01 2.27.01 3.4.01.57 0 .87-.67.47-1.07-1.44-1.45-4.02-4.06-5.5-5.54Z"
                fill="#d9e3f0"
              ></path>
            </svg>
            <span>View Voucher</span>
          </button>
        </div>

        <div className="w-full mt-6 ">
          <div className="flex justify-between ">
            <div className="w-[50%] space-y-3">
              <InputField
                label={"Value Date"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formatDate(formData?.value_date)}
                disabled={true}
              />
              <InputField
                label={"View Voucher"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.voucher_number}
                disabled={true}
              />
              <InputField
                label={"Transaction Number"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.trans_no}
                disabled={true}
              />
              <InputField
                label={"Customer Number"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.customer_no}
                disabled={true}
              />
              <InputField
                label={"Account Number"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.account_number}
                disabled={true}
              />
              <InputField
                label={"Fc Amount Db"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={isStringNull(formData?.fc_amount_db)}
                disabled={true}
              />
              <InputField
                label={"Exchange rate"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.exchange_rate}
                disabled={true}
              />
              <InputField
                label={"Local Equivalent Db"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={isStringNull(formData?.local_equivalent_db)}
                disabled={true}
              />
              <InputField
                label={"Transaction Details"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.transaction_details}
                disabled={true}
              />
            </div>
            <div className="w-[50%] space-y-3">
              <InputField
                label={"Posting Date"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formatDate(formData?.posting_date)}
                disabled={true}
              />
              <InputField
                label={"Voucher Date"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formatDate(formData?.voucher_date)}
                disabled={true}
              />
              <InputField
                label={"Posting System Date"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.posting_sys_time}
                disabled={true}
              />
              <InputField
                label={"Amount"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={isStringNull(formData?.amount)}
                disabled={true}
              />
              <InputField
                label={"Approved By"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.approved_by}
                disabled={true}
              />
              <InputField
                label={"Account Link"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.acct_link}
                disabled={true}
              />
              <InputField
                label={"Fc Amount Cr"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={isStringNull(formData?.fc_amount_cr)}
                disabled={true}
              />
              <InputField
                label={"Document Ref"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={formData?.document_ref}
                disabled={true}
              />
              <InputField
                label={"Local Equivalent Cr"}
                labelWidth={"35%"}
                inputWidth={"65%"}
                value={isStringNull(formData?.local_equivalent_cr)}
                disabled={true}
              />
            </div>
          </div>
        </div>
        {/* <div className="mt-7">
         
        </div> */}
      </div>
    </Modal>
  );
}
