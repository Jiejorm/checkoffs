import { Modal} from "@mantine/core";
import { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
// import DataTable from "../../../../components/others/Datatable/DataTable";
// import DataTable from "../../../../../components/others/Datatable/DataTable";
// import DataTable from "../../../../../components/others/customtable";
import CustomTable from "../teller-ops/components/CustomTable";
import  axios from "axios";
import { API_SERVER } from "../config/constant";
import swal from "sweetalert";
import InputField from "./others/Fields/InputField";
import TableLoader from "./loader";


const NonNormalModal = ({
  showModal,
  setShowModal,
  GetBatch,
  GetCurrencyCode,
  GETKey,
  // setCurrencyMismatches
}) => {
  const handleClose = () => {
      setShowModal(false);
      // setCurrencyMismatches(false);
    };
    const headers = {
      "x-api-key":
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "Content-Type": "application/json",
    };
    function formatNumber(num) {
      const formatted = parseFloat(num).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      });
      return formatted;
    }
    const handleShow = () => setShowModal(true);
    const [fullScreen, setFullscreen] = useState(false);
    const [modalSize, setModalSize] = useState("lg");
    const [nonNormalAcct, setNonNormalAcct] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [tableLoader, setTableLoader] = useState(false);
    const [nonNormalAccountNo, setNonNormalAccountNo] = useState("");
    const [totalAmount, setTotalAmount] = useState("");

    useEffect(() =>{
      setTableLoader(true)
   
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
              setNonNormalAcct(response?.data.data.map((row) => Object.values(row)));
              setNonNormalAccountNo(response?.data.data.length);
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
              setNonNormalAcct([]);
             }
          }
        }).catch((err) => {
          console.log(err);
        }).finally(() =>{
          setTableLoader(false);
        })
  
  
    },[]);
    
  return (
  //     <Modal
  //     size="70%"
  //     opened={showModal}
  //     onClose={handleClose}
  //     title={"Non-Normal Accounts"}
  //     >
  //     <div className="mt-2">
  //   <DataTable 
  // //   search={true}
  // //   filter={true}
  // //   download={true}
  // //   columns={["PIN/Staff Number", "Account Number", "Exception", "Currency","Amount"]}
  //   />
  //   </div>
  //     </Modal>
  <div className="pb-2 pt-2 px-2 mb-2 mt-2 relative">
     {tableLoader && (
                <div className="absolute top-0 left-0 z-10 h-full opacity-90 bg-white flex justify-center align-middle w-full">
                  <TableLoader />
                </div>
              )}
  <div className="flex mt-2 mb-2 space-x-2 justify-between"> 
    <div>
      <InputField 
      label={"Non-Normal Accounts"}
      disabled={true}
      value={nonNormalAccountNo}
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
     "PIN/Staff Number", "Account Number", "Exception", "Amount","Currency"
   ]}
    data={nonNormalAcct}
   rowsPerPage={15} 
   style={{
    headerAlignRight: [4],
    columnAlignRight: [4],
    headerAlignLeft:[3],
    columnAlignCenter: [1, 2,5],
    columnFormat: [2],}}
 />
</div>
  );  
};
export default NonNormalModal;