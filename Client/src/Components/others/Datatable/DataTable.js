import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function DataTable({
  title,
  data,
  dataProcessingInfo,
  rowsPerPage,
  tableCellFontSize,
  columns,
  onRowClick,
  textAlign,
  download,
  print,
  filter,
  viewColumns,
  search,
}) {
  const options = {
    onRowClick: onRowClick,
    selectableRows: false,
    rowsPerPage: rowsPerPage,
    textLabels: {
      body: { noMatch: dataProcessingInfo },
    },
    download: download,
    print: print,
    filter: filter,
    viewColumns: viewColumns,
    search: search,
  };
  //   const options = {
  //     filterType: "checkbox",
  //     rowsPerPage: rowsPerPage, // rows to display per page
  //   };
  //

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              textAlign: textAlign,
              // background: bgColor,
              fontSize: tableCellFontSize,
              color: "black",
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              background: bgColor,
              fontSize: tableCellFontSize,
              color: "white !important",
              borderRight: "1px solid #ffffff3b",
            },
          },
        },
      },
    });

  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );

  const customTheme = JSON.parse(localStorage.getItem("theme"));

  const bgColor =
  "#0580c0";
  // const bgColor =
  // `url(` +
  // window.location.origin +
  // `/assets/images/background/` +
  // customTheme.theme.backgroundImage +
  // `)`;

  return (
    <div style={{ zoom: "0.85" }}>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={title}
          data={data} //should in an array
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </div>
  );
}

export default DataTable;
