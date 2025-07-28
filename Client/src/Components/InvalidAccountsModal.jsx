import { useEffect, useState } from "react";
// import Header from "../../../../components/others/Header/Header";
import { AiOutlineCloseCircle } from "react-icons/ai";
// import DataTable from "../../../../components/others/Datatable/DataTable";
// import DataTable from "../../../../../components/others/customtable";
import CustomTable from "../teller-ops/components/CustomTable";
import axios from "axios";
import { API_SERVER } from "../config/constant";
import swal from "sweetalert";
import TableLoader from "./loader";
import InputField from "./others/Fields/InputField";

const InvalidAccountsModal = ({
  showModal,
  setShowModal,
  // InvalidAccountData,
  // InvalidAccountNo,
  GETbatchNumber,
  GETKey,
}) => {
  const handleClose = () => {
    setShowModal(false);
    //  setInvalidAccountData([]);
    // setCurrencyMismatches(false);
  };
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  const handleShow = () => setShowModal(true);
  const [fullScreen, setFullscreen] = useState(false);
  const [modalSize, setModalSize] = useState("lg");
  const [InvalidAccountData, setInvalidAccountData] = useState([]);
  const[invalidAccountNo, setInvalidAccountNo] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [responseData, setResponseData] = useState([]);
  const [sweetAlertConfirmed, setSweetAlertConfirmed] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });
    return formatted;
  }
  useEffect(() => {
    // console.log(GETbatchNumber)
   setTableLoader(true)
   console.log(GETKey);
      axios
        .post(
          API_SERVER + "/api/salary-upload",
          {
            key: GETKey,
            batchNumber: GETbatchNumber,
          },
          { headers }
        )
        .then(function (response) {
          if (response.data?.responseCode === "999") {
            setTableLoader(false);
            swal({
              title: "Error",
              text: response.data?.responseMessage,
              icon: "error",
              buttons: "OK",
            });
          } else {
            // setResponseData(response?.data.data);
            if (response?.data.data.length !== 0) {
              setInvalidAccountData(
                response?.data.data.map((row) => Object.values(row))
              );
              setInvalidAccountNo(response?.data.data.length);
              let sum = 0;
              response?.data.data.forEach((row) => {
                const columnValue = Number(row.CREDIT_AMOUNT);
                if (!isNaN(columnValue)) {
                  sum += columnValue;
                }
              });
              const roundedSum = Math.round(sum * 100) / 100;
              // console.log(roundedSum)
              setTotalAmount(formatNumber(roundedSum));
            }
           
            setTableLoader(false);
            if(response?.data.data.length===0){
              setInvalidAccountData([]);
             }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTableLoader(false);
        });
  }, []);

  return (
    <div className="pb-2 pt-2 px-2 mb-2 mt-2 relative">
      {tableLoader && (
        <div className="absolute top-0 left-0 z-10 h-full opacity-90 bg-white flex justify-center align-middle w-full">
          <TableLoader />
        </div>
      )}
       <div className="flex mt-2 mb-2 space-x-2 justify-between"> 
      <div>
        <InputField 
        label={"Invalid Accounts"}
        disabled={true}
        value={invalidAccountNo}
        textAlign={"right"}
        />
      </div>
      <div>
      <InputField 
        label={"Total Amount"}
        disabled={true}
        value={totalAmount}
        textAlign={"right"}
        />
      </div>
 
      </div>
      <CustomTable
        //   search={true}
        //   filter={true}
        //   download={true}
        headers={[
          "PIN/Ref Number",
          "Account Number",
          "Status",
          "Credit Amount",
        ]}
        data={InvalidAccountData}
        // data={tableData}
        rowsPerPage={15}
        style={{
          columnAlignRight: [4],
          headerAlignRight: [4],
          headerAlignLeft:[3],
          columnAlignCenter: [1, 2],
          columnFormat: [2],}}
      />
    </div>
  );
};
export default InvalidAccountsModal;
