// import Modal from "react-bootstrap/Modal";
import { Modal} from "@mantine/core";
import { useEffect, useState } from "react";
// import DataTable from "../../../../components/others/Datatable/DataTable";
// import DataTable from "../../../../../components/others/Datatable/DataTable";
// import Header from "../../../../components/others/Header/Header";
import CustomTable from "../teller-ops/components/CustomTable";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { API_SERVER } from "../config/constant";
import swal from "sweetalert";
import TableLoader from "./loader";
import InputField from "./others/Fields/InputField";
import ButtonComponent from "./others/Button/ButtonComponent";
import { read, utils, write, writeFile } from "xlsx";

const ViewExceptionsModal = ({
  showModal,
  setShowModal,
  GetBatch,
  GetCurrencyCode,
  GETKey,
  // setViewExceptions,
}) => {
  const handleClose = () => {
    setShowModal(false);
    // setViewExceptions(false);
  };
  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };
  const handleShow = () => setShowModal(true);
  const [fullScreen, setFullscreen] = useState(false);
  const [modalSize, setModalSize] = useState("lg");
  const [viewExceptions, setViewExceptions] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [viewExceptionsNo, setViewExceptionsNo] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [column, setColumns] = useState( [
    "PIN/Staff Number", 
    "Account Number", 
    "Exception",
    "Currency",
    "Amount"
  ]);
  function formatNumber(num) {
    const formatted = parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });
    return formatted;
  }
  const handleDownloadExcel = () => {
    if (viewExceptions.length === 0){
  
    }
    const formattedData = viewExceptions.map((row) =>{
      return [
       row[0], // PIN/Staff Number
       row[1], // Account Number
       row[2], // Exception
       row[3],  // Currency
       row[4], //Amount
      ];
    });
    const ws = utils.aoa_to_sheet([
      ["PIN/Staff Number", "Account Number", "Exception", "Currency", "Amount"], // Header row
      ...formattedData,
    ]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
  
    writeFile(wb, "Accounts With Exceptions.xlsx");
   }
  useEffect(() =>{
    setTableLoader(true);
      axios.post(
        API_SERVER + "/api/salary-upload",
        {
         key: GETKey,
         batchNumber: GetBatch,
         currencyCode: GetCurrencyCode
        },{ headers }
      ).then(function (response){
        if (response.data?.responseCode === "999"){
          setTableLoader(false);
          swal({
            title: "Error",
            text: response.data?.responseMessage,
            icon: "error",
            buttons: "OK",
          });
        }else {
          //  setResponseData(response?.data.data);
           if(response?.data.data.length !==0){
            setViewExceptions(response?.data.data.map((row) => Object.values(row)));
            setViewExceptionsNo(response?.data.data.length);
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
          if(response?.data.data.length ===0){
            setViewExceptions([]);
           }
        }
      }).catch((err) => {
        console.log(err);
      }).finally(() =>{
        setTableLoader(false);
      })


  
  },[]);

  return (
    // <Modal
    //   size="70%"
    //   opened={showModal}
    //   onClose={handleClose}
    //   title={"Accounts With Exceptions"}
    // >
    //   <div className="mt-2">
    //   <DataTable 
    //   search={true}
    //   filter={true}
    //   download={true}
    //   columns={["PIN/Staff Number", "Account Number", "Exception", "Currency","Amount"]}
    //   />
    //   </div>
    // </Modal>
    <div className="pb-2 pt-2 px-2 mb-2 mt-2 relative">
    {tableLoader && (
               <div className="absolute top-0 left-0 z-10 h-full opacity-90 bg-white flex justify-center align-middle w-full">
                 <TableLoader />
               </div>
             )}
              <div className="flex mt-2 mb-2 space-x-2 justify-between"> 
      <div>
        <InputField 
        label={"Exceptions"}
        disabled={true}
        value={viewExceptionsNo}
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
      <div>
        <ButtonComponent 
        label={"Download"}
        buttonHeight={"25px"}
        onClick={handleDownloadExcel}

        />
      </div>
      </div>
 <CustomTable
  //   search={true}
  //   filter={true}
  //   download={true}
  headers={[
    "PIN/Staff Number",
     "Account Number",
      "Exception",
       "Amount",
       "Currency"
  ]}
   data={viewExceptions}
  rowsPerPage={15} 
  style={{
    columnAlignRight: [4],
    headerAlignRight: [4],
    headerAlignLeft:[3],
    columnAlignCenter: [1, 2,5],
    columnFormat: [2],}}
/>
</div>
  );
};
export default ViewExceptionsModal;
