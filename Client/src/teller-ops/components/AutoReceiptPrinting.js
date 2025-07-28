import { useState, useEffect } from "react";

export default function AutoReceiptPrinting({ batchNo }) {
  useEffect(() => {}, []);

  const auto_receipt_printing_url =
    "http://192.168.1.195:84/receipt?batchNo=" + batchNo;

  return (
    <>
      <iframe
        width="100%"
        height="700px"
        src={auto_receipt_printing_url}
        title="Browser"
      ></iframe>
    </>
  );
}
