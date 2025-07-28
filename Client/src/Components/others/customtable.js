import React from "react";
import { useState, useEffect } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import TableLoader from "./LoaderComponent";
export default function CustomTable({
  headers,
  data,
  style,
  rowsPerPage,
  green,
  load,
}) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [pagination, setPagination] = useState(false);

  function formatNumber(num) {
    const formatted = num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

    return formatted;
  }

  let colspan = 0;

  const [currentPage, setCurrentPage] = useState(1);
  // const [green, setGreen] = useState(false);
  let totalPages;
  let startIndex;
  let endIndex;
  if (rowsPerPage) {
    totalPages = Math.ceil(data?.length / rowsPerPage);
    startIndex = (currentPage - 1) * rowsPerPage;
    endIndex = startIndex + rowsPerPage;
  } else {
    totalPages = 1;
    startIndex = 0;
    endIndex = 0;
  }

  const currentData = data?.slice(startIndex, endIndex);
  // console.log({ currentData, data, totalPages });
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    rowsPerPage ? setPagination(true) : setPagination(false);
  }, []);

  return (
    <div
      className="bg-[#f9f9f9] tableScrollBar"
      style={{ overflowX: "scroll" }}
    >
      <table className="w-full  bg-white rounded-sm   even:bg-slate-300  border-spacing-2 border border-gray-200">
        <thead>
          <tr
            className="py-1 capitalize font-semibold text-white"
            style={{
              //  backgroundColor: "#0580c0",
              background: green ? "#3b82f6" : "#3b82f6",
            }}
          >
            {headers?.map((i, index) => {
              return (
                <th
                  key={index}
                  colSpan={parseInt(i.split("++")[1]?.trim())}
                  className={`whitespace-nowrap px-2 py-1 border border-gray-300 ${
                    style?.headerAlignRight?.includes(index + 1)
                      ? "text-right"
                      : style?.headerAlignLeft?.includes(index + 1)
                      ? "text-left"
                      : "text-center"
                  }`}
                >
                  {i.split("++")[0]?.trim()}
                </th>
              );
            })}
          </tr>
          {/* <tr
            className="py-1 capitalize font-semibold text-white"
            style={{
              // backgroundColor: "red",
              backgroundColor: green ? "#22c55e" : "#0580c0",
            }}
          >
            {headers?.map((i) => {
              return (
                <th
                  className="text-center px-2 py-1 border border-gray-100"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {i}
                </th>
              );
            })}
          </tr> */}
        </thead>
        <tbody className="">
          {rowsPerPage
            ? currentData?.map((i, key) => (
                <tr
                  key={key}
                  className={`text-left h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-[#d7f6ff]  cursor-pointer border border-gray-200 even:bg-gray-100 odd:bg-white`}
                >
                  {i.map((a, key) => {
                    return (
                      <td
                        key={key}
                        className={`${
                          style?.columnAlignRight?.includes(key + 1)
                            ? "text-right"
                            : ""
                        } capitalize px-2 py-1`}
                        style={{
                          fontSize: "85%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {style?.columnFormat?.includes(key + 1)
                          ? formatNumber(a)
                          : a}
                      </td>
                    );
                  })}
                </tr>
              ))
            : data?.map((i, key) => (
                <tr
                  key={key}
                  className={`text-left h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-[#d7f6ff]  cursor-pointer border border-gray-500 even:bg-gray-100 odd:bg-white`}
                >
                  {i.map((a, key) => {
                    return (
                      <td
                        key={key}
                        className={`${
                          style?.columnAlignRight?.includes(key + 1)
                            ? "text-right"
                            : ""
                        }  capitalize px-2 py-1`}
                      >
                        {style?.columnFormat?.includes(key + 1)
                          ? formatNumber(a)
                          : a}
                      </td>
                    );
                  })}
                </tr>
              ))}
        </tbody>
      </table>
      {data?.length === 0 && load === false && (
        <div
          style={{
            padding: "15px",
            fontWeight: "600",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="animate-pulse"
            style={{
              textAlign: "center",
            }}
          >
            No Data Found...
          </div>
        </div>
      )}

      {data?.length === 0 && load && (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >
          <TableLoader />
        </div>
      )}

      {rowsPerPage ? (
        <div className="flex justify-end mt-2 mb-2">
          <div className="flex align-center">
            <button
              className={` bg-white disabled:bg-slate-400 `}
              style={{ borderRadius: "50%", width: "25px", height: "23px" }}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <MDBIcon fas icon="angle-left" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <div className="mx-2 whitespace-nowrap">
              Page -{" "}
              <span style={{ color: "black", fontWeight: "bolder" }}>
                {currentPage}
              </span>{" "}
              / {totalPages}
            </div>
            <button
              // className={px-3 h-8 bg-slate-600 disabled:bg-slate-400}
              className={` bg-white disabled:bg-slate-400 `}
              style={{ borderRadius: "50%", width: "25px", height: "23px" }}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <MDBIcon fas icon="angle-right" />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

// import React from "react";
// import { useState, useEffect } from "react";
// // import { MDBIcon } from "mdb-react-ui-kit";
// import {
//   AiOutlineArrowUp,
//   AiOutlineArrowDown,
//   AiOutlineArrowLeft,
//   AiOutlineArrowRight,
// } from "react-icons/ai";
// export default function CustomTable({
//   headers,
//   data,
//   style,
//   rowsPerPage,
//   onRowDoubleClick,
//   onRowClick,
//   defaultMessage,
//   theadBackground,
//   // pagination,
// }) {
//   const [getTheme, setTheme] = useState(
//     JSON.parse(localStorage.getItem("theme"))
//   );
//   const [pagination, setPagination] = useState(false);

//   function formatNumber(num) {
//     let formatted;
//     // console.log({num})
//     if (num !== "" || num !== null) {
//       if (parseFloat(num)) {
//         formatted = num.toLocaleString("en-US", {
//           minimumFractionDigits: 2,
//         });
//       } else {
//         formatted = parseFloat(num).toLocaleString("en-US", {
//           minimumFractionDigits: 2,
//         });
//       }
//       return formatted;
//     } else {
//       return "";
//     }
//   }

//   const [currentPage, setCurrentPage] = useState(1);
//   // const [colSpan, setColSpan] = useState("");
//   let totalPages;
//   let startIndex;
//   let endIndex;
//   if (rowsPerPage) {
//     totalPages = Math.ceil(data?.length / rowsPerPage);
//     startIndex = (currentPage - 1) * rowsPerPage;
//     endIndex = startIndex + rowsPerPage;
//   } else {
//     totalPages = 1;
//     startIndex = 0;
//     endIndex = 0;
//   }

//   const currentData = data?.slice(startIndex, endIndex);
//   console.log({ currentData, data, totalPages });
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   useEffect(() => {
//     rowsPerPage ? setPagination(true) : setPagination(false);
//   }, []);

//   let colspan = 0;
//   headers?.map((i) => {
//     if (parseFloat(i.split("++")[1])) {
//       colspan += parseFloat(i.split("++")[1]);
//     } else {
//       colspan += 1;
//     }
//   });
//   return (
//     <div
//       className="bg-[#f9f9f9] tableScrollBar text-[94%] w-full"
//       style={{ overflowX: "scroll" }}
//     >
//       <table className="w-full  bg-white rounded-sm text-gray-500">
//         <thead>
//           <tr
//             className="py-1 capitalize font-semibold text-white"
//             style={{
//               backgroundColor: "#0580c0",
//               background: theadBackground ? theadBackground : "#0580c0",
//             }}
//           >
//             {headers?.map((i, index) => {
//               return (
//                 <th
//                   key={index}
//                   colSpan={parseInt(i.split("++")[1]?.trim())}
//                   className={`whitespace-nowrap px-2 py-1 border border-gray-300 ${
//                     style?.headerAlignRight?.includes(index + 1)
//                       ? "text-right"
//                       : style?.headerAlignLeft?.includes(index + 1)
//                       ? "text-left"
//                       : "text-center"
//                   }`}
//                 >
//                   {i.split("++")[0]?.trim()}
//                 </th>
//               );
//             })}
//           </tr>
//         </thead>
//         <tbody className="">
//           {data?.length > 0 ? (
//             rowsPerPage ? (
//               currentData?.map((i, key) => (
//                 <tr
//                   onDoubleClick={() =>
//                     onRowDoubleClick ? onRowDoubleClick(i) : null
//                   }
//                   onClick={() => (onRowClick ? onRowClick(i) : null)}
//                   key={key}
//                   className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-[#d7f6ff]  cursor-pointer border border-gray-200 even:bg-gray-100 odd:bg-white `}
//                 >
//                   {i?.map((a, key) => {
//                     return (
//                       <td
//                         key={key}
//                         className={`${
//                           style?.columnAlignRight?.includes(key + 1)
//                             ? "text-right"
//                             : style?.columnAlignCenter?.includes(key + 1)
//                             ? "text-center"
//                             : ""
//                         } capitalize px-2 py-1`}
//                       >
//                         {style?.columnFormat?.includes(key + 1)
//                           ? formatNumber(a)
//                           : a}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))
//             ) : (
//               data?.map((i, key) => (
//                 <tr
//                   key={key}
//                   onDoubleClick={() =>
//                     onRowDoubleClick ? onRowDoubleClick(i) : null
//                   }
//                   onClick={() => (onRowClick ? onRowClick(i) : null)}
//                   className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-[#d7f6ff]  cursor-pointer border border-gray-200 even:bg-gray-100 odd:bg-white`}
//                 >
//                   {i?.map((a, key) => {
//                     return (
//                       <td
//                         key={key}
//                         // style={{ display: "flex", justifyContent: "center" }}
//                         className={`${
//                           style?.columnAlignRight?.includes(key + 1)
//                             ? "text-right"
//                             : style?.columnAlignCenter?.includes(key + 1)
//                             ? "text-center"
//                             : ""
//                         }   capitalize  px-2 py-1`}
//                       >
//                         {style?.columnFormat?.includes(key + 1)
//                           ? formatNumber(a)
//                           : a}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))
//             )
//           ) : defaultMessage ? (
//             <tr>
//               <td
//                 className="text-center w-full  border hover:bg-gray-100 bg-gray-100 font-semibold py-3 "
//                 colSpan={colspan}
//               >
//                 <div className="animate-pulse">{defaultMessage}</div>
//               </td>
//             </tr>
//           ) : (
//             <tr>
//               <td
//                 className="text-center border hover:bg-gray-100 bg-gray-100 font-semibold py-3 "
//                 colSpan={colspan}
//               >
//                 <div className="animate-pulse">No Data Found ...</div>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       {
//         <div className="flex justify-end mt-2 mb-2">
//           <div className="flex align-center">
//             <button
//               className={` bg-slate-600 disabled:bg-slate-400 `}
//               style={{ borderRadius: "50%", width: "25px", height: "23px" }}
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//             >
//               <div className="flex justify-center items-center">
//                 <AiOutlineArrowLeft className="text-white font-bold" />
//               </div>
//               {/* <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-6 h-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg> */}
//             </button>
//             <div className="mx-2 whitespace-nowrap">
//               Page -{" "}
//               <span style={{ color: "black", fontWeight: "bolder" }}>
//                 {currentPage}
//               </span>{" "}
//               / {totalPages}
//             </div>
//             <button
//               // className={`px-3 h-8 bg-slate-600 disabled:bg-slate-400`}
//               className={` bg-slate-600 disabled:bg-slate-400 `}
//               style={{ borderRadius: "50%", width: "25px", height: "23px" }}
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//             >
//               <div className="flex justify-center items-center">
//                 <AiOutlineArrowRight className="text-white font-bold" />
//               </div>

//               {/* <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-6 h-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg> */}
//             </button>
//           </div>
//         </div>
//       }
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import {
//   AiOutlineArrowUp,
//   AiOutlineArrowDown,
//   AiOutlineArrowLeft,
//   AiOutlineArrowRight,
// } from "react-icons/ai";

// export default function CustomTable({
//   headers,
//   data,
//   style,
//   zoom,
//   rowsPerPage,
//   theadBackground,
//   pagination,
// }) {
//   const [getTheme, setTheme] = useState(
//     JSON.parse(localStorage.getItem("theme"))
//   );
//   // const [pagination, setPagination] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

//   function formatNumber(num) {
//     const formatted = num.toLocaleString("en-US", {
//       minimumFractionDigits: 2,
//     });
//     return formatted;
//   }

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === "asc"
//     ) {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // useEffect(() => {
//   //   rowsPerPage ? setPagination(true) : setPagination(false);
//   // }, []);

//   let sortedData = [...data];

//   if (sortConfig) {
//     sortedData.sort((a, b) => {
//       const aValue = a[headers.indexOf(sortConfig.key)];
//       const bValue = b[headers.indexOf(sortConfig.key)];

//       if (aValue < bValue) {
//         return sortConfig.direction === "asc" ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return sortConfig.direction === "asc" ? 1 : -1;
//       }
//       return 0;
//     });
//   }

//   let totalPages;
//   let startIndex;
//   let endIndex;

//   if (rowsPerPage) {
//     totalPages = Math.ceil(sortedData.length / rowsPerPage);
//     startIndex = (currentPage - 1) * rowsPerPage;
//     endIndex = startIndex + rowsPerPage;
//   } else {
//     totalPages = 1;
//     startIndex = 0;
//     endIndex = sortedData.length;
//   }

//   const currentData = sortedData.slice(startIndex, endIndex);

//   return (
//     <div
//       className="bg-[#f9f9f9] tableScrollBar"
//       style={{ overflowX: "scroll" }}
//     >
//       <table className="w-full bg-white rounded-sm even:bg-slate-300 border-spacing-2 border border-gray-800">
//         <thead style={{ zoom: zoom }}>
//           <tr
//             className="py-1 capitalize font-semibold text-white"
//             style={{
//               backgroundColor: "#0580c0",
//               background: theadBackground ? theadBackground : "#0580c0",
//             }}
//           >
//             {headers?.map((header) => {
//               return (
//                 <th
//                   key={header}
//                   className="text-center px-2 py-1 border border-gray-100 cursor-pointer"
//                   style={{ whiteSpace: "nowrap" }}
//                   onClick={() => handleSort(header)}
//                 >
//                   <div className="flex">
//                     {header}
//                     {sortConfig.key === header && (
//                       <span
//                         className="ml-1"
//                         style={{ marginTop: "2px", fontWeight: "bold" }}
//                       >
//                         {sortConfig.direction === "asc" ? (
//                           <AiOutlineArrowUp />
//                         ) : (
//                           <AiOutlineArrowDown />
//                         )}
//                       </span>
//                     )}
//                   </div>
//                 </th>
//               );
//             })}
//           </tr>
//         </thead>
//         <tbody style={{ zoom: zoom }} className="">
//           {currentData?.map((row, rowIndex) => (
//             <tr
//               key={rowIndex}
//               className={`text-center h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-[#d7f6ff]  cursor-pointer border border-gray-200 even:bg-gray-100 odd:bg-white`}
//             >
//               {row.map((cell, cellIndex) => {
//                 const header = headers[cellIndex];
//                 return (
//                   <td
//                     key={`${rowIndex}-${cellIndex}`}
//                     className={`${
//                       style?.columnAlignRight?.includes(header)
//                         ? "text-right"
//                         : ""
//                     } capitalize px-2 py-1`}
//                     style={{
//                       fontSize: "85%",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {style?.columnFormat?.includes(header)
//                       ? formatNumber(cell)
//                       : cell}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {(rowsPerPage || pagination) && (
//         <div className="flex justify-end mt-2 mb-2">
//           <div className="flex align-center">
//             <button
//               className={` bg-slate-600 disabled:bg-slate-400 `}
//               style={{ borderRadius: "50%", width: "25px", height: "23px" }}
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//             >
//               <AiOutlineArrowLeft />
//             </button>
//             <div className="mx-2 whitespace-nowrap">
//               Page -{" "}
//               <span style={{ color: "black", fontWeight: "bolder" }}>
//                 {currentPage}
//               </span>{" "}
//               / {totalPages}
//             </div>
//             <button
//               className={` bg-slate-600 disabled:bg-slate-400 `}
//               style={{ borderRadius: "50%", width: "25px", height: "23px" }}
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//             >
//               <AiOutlineArrowRight />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
