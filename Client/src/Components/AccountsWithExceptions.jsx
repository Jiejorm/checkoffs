import { useEffect, useState } from "react";
import CustomTable from "../teller-ops/components/CustomTable";
import ButtonComponent from "./others/Button/ButtonComponent";
import InputField from "./others/Fields/InputField";
import { read, utils, write, writeFile } from "xlsx";
import TableLoader from "./loader";
import axios from "axios";
import { API_SERVER } from "../config/constant";
import swal from "sweetalert";

const AcctWithExcModal =({
  GetBatch
    // TableData
}) => {
    function formatNumber(num) {
        const formatted = parseFloat(num).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });
        return formatted;
      }
      const headers = {
        "x-api-key":
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "Content-Type": "application/json",
      };
     
      const [column, setColumns] = useState(["PIN/Staff Number", "Account Number", "Account Description", "Exception", "Amount"]);  
       const [totalAmount, setTotalAmount] = useState("");
       const [numberOfExceptions, setNumberOfExceptions] = useState("");
       const [acctExceptions, setAcctExceptions] = useState([]);
       const [tableLoader, setTableLoader] = useState(false);
      useEffect(() =>{
        setTableLoader(true);
         axios.post(
            API_SERVER + "/api/salary-upload",
            {
              key: "AccountsWithExceptions",
              batchNumber: GetBatch,
            },
            { headers }
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
              // console.log("testtttttttt");
              //  setResponseData(response?.data.data);
               if(response?.data.data.length !==0){
                // console.log(response.data);
                setAcctExceptions(response?.data.data.map((row) => Object.values(row)));
                setNumberOfExceptions(response?.data.data.length);
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
                setAcctExceptions([]);
               }
            }
          }).catch((err) => {
            console.log(err);
          }).finally(() =>{
            setTableLoader(false);
          })
    
    
      
      },[]);

      // function AcctExceptions() {
      //   axios
      //     .post(
      //       API_SERVER + "/api/salary-upload",
      //       {
      //         key: "AccountsWithExceptions",
      //         batchNumber: getBatchNumber,
      //       },
      //       {
      //         headers,
      //       }
      //     )
      //     .then(function (response) {
      //       if (response.data?.responseCode === "000") {
      //         if (response.data?.data.length !== 0) {
      //           // setAccountWithExceptionsData(response.data.data);
      //           // setOpenModalFlag(true);
      //           setShowModal1(true);
      //           setForm("Accounts With Exceptions");
      //           handleNewBtnClick();
      //         } else {
      //           handleNewBtnClick();
      //         }
      //       } else {
      //         swal({
      //           title: "Error",
      //           text: response.data?.responseMessage,
      //           icon: "error",
      //           buttons: "OK",
      //         });
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     })
      //     .finally(() => {});
      // }
      const handleDownloadExcel = () => {
        if (acctExceptions.length === 0){
      
        }
        const formattedData = acctExceptions.map((row) =>{
          return [
           row[0], // PIN/Staff Number
           row[1], // Account Number
           row[2], // Account Description
           row[3],  // Exception
           row[4], //Amount
          ];
        });
        const ws = utils.aoa_to_sheet([
            column, // Header row
          ...formattedData,
        ]);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Sheet1");
      
        writeFile(wb, "Accounts With Exceptions.xlsx");
       }  
       
      //  setNumberOfExceptions(TableData.length);
      //  let sum = 0;
      //  TableData.forEach((row) => {
      //   const columnValue = Number(row.CREDIT_AMOUNT);
      //   if (!isNaN(columnValue)) {
      //     sum += columnValue;
      //   }
      //  });
      //  const roundedSum = Math.round(sum * 100) / 100;
      //  // console.log(roundedSum)
      //  setTotalAmount(formatNumber(roundedSum));
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
            label={"Exceptions"}
            disabled={true}
            value={numberOfExceptions}
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
          headers={
            column
        }
        // data={[]}
           data={acctExceptions}
          rowsPerPage={15}
          // columnAlignments={["center", "center", "left", "center", "right"]} 
          style={{
            columnAlignRight: [5],
            headerAlignRight: [5],
            headerAlignLeft:[3, 4],
            columnAlignCenter: [1, 2],
            
            columnFormat: [2],}}
        />
      </div>
        );
};
export default AcctWithExcModal;