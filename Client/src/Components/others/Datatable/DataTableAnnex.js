import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const DataTableAnnex = ({rows, columns}) => {
    return (
        <div>
            <div>
                <Box
                    sx={{
                    height: "180px",
                    width: "auto",
                    borderRadius: "5px",

                    // marginLeft: "20px",

                    "& .super-app-theme--header": {
                        backgroundColor: "black",
                        color: "white",
                        fontWeight: "",
                        fontSize: "16px",
                    },
                    }}
                >
                    <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    components={{ Toolbar: GridToolbar }}
                    />
                </Box>
            </div>
        </div>
    )
}

export default DataTableAnnex;