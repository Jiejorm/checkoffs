import { useState, useEffect } from "react";

export default function DocumentViewing({ documentID }) {
  useEffect(() => {}, []);

  const view_document = "http://10.203.14.169/dms/filesearch-" + documentID;

  return (
    <>
      <iframe
        style={{ height: "550px" }}
        width="100%"
        height="auto"
        src={view_document}
        title="Browser"
      ></iframe>
          
    </>
  );
}
