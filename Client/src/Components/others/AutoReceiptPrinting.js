import { useState, useEffect } from "react";

export default function AutoReceiptPrinting({ batchNo }) {
  useEffect(() => {}, []);

  const auto_receipt_printing_url =
    "http://10.203.14.195:84/receipt/PrintHtmlCard.php?batchNo=" + batchNo;

  return (
    <div style={{ overflowY: "hidden" }}>
      <iframe
        width="100%"
        height="700px"
        src={auto_receipt_printing_url}
        title="Browser"
      ></iframe>
          
    </div>
  );
}
