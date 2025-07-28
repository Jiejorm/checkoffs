import React from "react";
import { useState, useEffect } from "react";
// import { MDBIcon } from "mdb-react-ui-kit";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { Spin } from "antd";
export default function CustomTable({
  headers,
  data,
  style,
  rowsPerPage,
  onRowDoubleClick,
  onRowClick,
  defaultMessage,
  theadBackground,
  loading,
  // pagination,
}) {
  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  const [pagination, setPagination] = useState(false);

  function formatNumber(num) {
    let formatted;
    // console.log({num})
    if (num !== "" || num !== null) {
      if (parseFloat(num)) {
        formatted = num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });
      } else {
        formatted = parseFloat(num).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });
      }
      return formatted;
    } else {
      return "";
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  // const [colSpan, setColSpan] = useState("");
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
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const currentData = data?.slice(startIndex, endIndex);
  console.log({ currentData, data, totalPages });
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    rowsPerPage ? setPagination(true) : setPagination(false);
  }, []);

  let colspan = 0;
  headers?.map((i) => {
    if (parseFloat(i.split("++")[1])) {
      colspan += parseFloat(i.split("++")[1]);
    } else {
      colspan += 1;
    }
  });
  return (
    <div
      className="bg-[#f9f9f9] tableScrollBar text-[94%] w-full"
      style={{ overflowX: "scroll" }}
    >
      <table className="w-full  bg-white rounded-sm text-gray-500">
        <thead>
          <tr
            className="py-1 capitalize font-semibold text-white"
            style={{
              backgroundColor: "#0580c0",
              background: theadBackground ? theadBackground : "#3b82f6",
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
        </thead>
        <tbody className="">
          {loading?.status ? (
            <tr>
              <td
                className="text-center w-full border hover:bg-gray-100 bg-gray-100 font-semibold py-3 "
                colSpan={colspan}
              >
                <div className="flex space-x-3 py-5 justify-center w-full">
                  <Spin />
                  <span className="animate-pulse">{loading.message}</span>
                </div>
              </td>
            </tr>
          ) : data?.length > 0 ? (
            rowsPerPage ? (
              currentData?.map((i, key) => (
                <tr
                  onDoubleClick={() =>
                    onRowDoubleClick ? onRowDoubleClick(i) : null
                  }
                  onClick={() => (onRowClick ? onRowClick(i) : null)}
                  key={key}
                  className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-[#d7f6ff]  cursor-pointer border border-gray-200 even:bg-gray-100 odd:bg-white`}
                >
                  {i.map((a, key) => {
                    return (
                      <td
                        key={key}
                        className={`${
                          style?.columnAlignRight?.includes(key + 1)
                            ? "text-right"
                            : style?.columnAlignCenter?.includes(key + 1)
                            ? "text-center"
                            : ""
                        } capitalize px-2 py-1`}
                      >
                        {style?.columnFormat?.includes(key + 1)
                          ? formatNumber(a)
                          : a}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              data?.map((i, key) => (
                <tr
                  key={key}
                  onDoubleClick={() =>
                    onRowDoubleClick ? onRowDoubleClick(i) : null
                  }
                  onClick={() => (onRowClick ? onRowClick(i) : null)}
                  className={` h-8 border-spacing-2 bg-[#f9f9f9] hover:bg-[#d7f6ff]  cursor-pointer border border-gray-200 even:bg-gray-100 odd:bg-white`}
                >
                  {i.map((a, key) => {
                    return (
                      <td
                        key={key}
                        // style={{ display: "flex", justifyContent: "center" }}
                        className={`${
                          style?.columnAlignRight?.includes(key + 1)
                            ? "text-right"
                            : style?.columnAlignCenter?.includes(key + 1)
                            ? "text-center"
                            : ""
                        }   capitalize  px-2 py-1`}
                      >
                        {style?.columnFormat?.includes(key + 1)
                          ? formatNumber(a)
                          : a}
                      </td>
                    );
                  })}
                </tr>
              ))
            )
          ) : (
            <tr>
              <td
                className="text-center border hover:bg-gray-100 bg-gray-100 font-semibold py-3 "
                colSpan={colspan}
              >
                <div className="animate-pulse">No Data Found ...</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {
        <div className="flex justify-end mt-2 mb-2">
          <div className="flex align-center">
            <button
              className={` bg-slate-600 disabled:bg-slate-400 `}
              style={{ borderRadius: "50%", width: "25px", height: "23px" }}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <div className="flex justify-center items-center">
                <AiOutlineArrowLeft className="text-white font-bold" />
              </div>
              {/* <svg
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
              </svg> */}
            </button>
            <div className="mx-2 whitespace-nowrap">
              Page -{" "}
              <span style={{ color: "black", fontWeight: "bolder" }}>
                {currentPage}
              </span>{" "}
              / {totalPages}
            </div>
            <button
              // className={`px-3 h-8 bg-slate-600 disabled:bg-slate-400`}
              className={` bg-slate-600 disabled:bg-slate-400 `}
              style={{ borderRadius: "50%", width: "25px", height: "23px" }}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <div className="flex justify-center items-center">
                <AiOutlineArrowRight className="text-white font-bold" />
              </div>

              {/* <svg
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
              </svg> */}
            </button>
          </div>
        </div>
      }
    </div>
  );
}
