import { useState, useEffect } from "react";

export default function ImageVerification({ accountNumber }) {
  useEffect(() => {}, []);

  const image_url = "http://10.203.14.42/imaging/getimages-" + accountNumber;

  return (
    <>
      <iframe
        width="100%"
        height="500px"
        src={image_url}
        title="Browser"
      ></iframe>
    </>
  );
}
