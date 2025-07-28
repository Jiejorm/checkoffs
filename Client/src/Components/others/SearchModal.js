import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import { API_SERVER } from "../../config/constant";
import ButtonComponent from "./Button/ButtonComponent";
import InputField from "./Fields/InputField";
import axios from "axios";
import ModalComponent from "./Modal/modal";
import Swal from "sweetalert2";

const headers = {
  // "x-api-key": process.env.REACT_APP_API_KEY,
  "x-api-key": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "Content-Type": "application/json",
};

const GlobalModal = ({ showModal, setShowModal, handleSelected }) => {
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [accountDescription, setAccountDescription] = useState("");

  useEffect(() => {
    if (showModal === false) {
      setFilter([]);
    }
    if (showModal === true) {
      const input = document.getElementById("search-bar");
      input?.focus();
    }
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
    setFilter([]);
  };

  async function handleFind() {
    setLoading(true);
    try {
      const response = await axios.post(
        API_SERVER + "/api/find-by-name",
        {
          accountName: accountDescription,
        },
        { headers }
      );

      if (response.data.length > 0) {
        setLoading(false);
        setFilter(response.data);
      } else {
        Swal.fire({
          text: `No record match for account name : '${accountDescription}' `,
          icon: "warning",
          confirmButtonText: "Ok",
        }).then(() => {
          setFilter([]);
          setLoading(false);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log({ filter });

  return (
    <ModalComponent
      width={"50%"}
      title={"search account by name"}
      open={showModal}
      handleClose={handleClose}
      content={
        <div>
          <div className="rounded-b ">
            <div className="bg-white shadow rounded px-2 pt-1 pb-8   ">
              <div className="rounded p-2 space-y-2 border-2 mb-3 ">
                <div>Find a partial value to limit the list , %% to see all values</div>
                <div className="border-l-4 border-yellow-500 rounded leading-6  px-3 py-2 bg-yellow-50">
                  <span className="font-semibold flex items-center space-x-2">
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
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <div>Warning</div>
                  </span>{" "}
                  Entering % to see all values may take a very long time <br />
                  Entering criteria that can be used to reduce the list may be significantly faster
                </div>
              </div>
              <div>
                <div className="mb-3 flex items-center space-x-2">
                  <InputField
                    inputWidth={"100%"}
                    id={"search-bar"}
                    noMarginRight
                    onChange={(e) => {
                      setAccountDescription(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      e.key === "Enter" && handleFind();
                    }}
                  />
                  <ButtonComponent
                    label={"Find"}
                    onClick={handleFind}
                    buttonWidth={"15%"}
                    buttonHeight={"30px"}
                    buttonColor={"white"}
                    buttonBackgroundColor={"#0580c0"}
                  />
                </div>

                <div style={{ maxHeight: "320px", overflow: "auto" }} className>
                  <table className="w-full text-[90%]  bg-white rounded-sm   even:bg-gray-100  border-spacing-2 border border-gray-400">
                    <thead className="top-0 sticky">
                      <tr
                        className="py-1 uppercase font-semibold text-gray-100 text-md"
                        style={{
                          backgroundColor: "#0580c0",
                        }}
                      >
                        <th className="px-2 py-2 border border-gray-400 whitespace-nowrap">
                          Account Name
                        </th>
                        <th className="px-2 py-2 border border-gray-400 whitespace-nowrap">
                          Account Number
                        </th>
                        <th className="px-2 py-2 border w-32 border-gray-400 whitespace-nowrap">
                          ISO Code
                        </th>
                        <th className="px-2 py-2 border border-gray-400 whitespace-nowrap">
                          Customer Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {!loading &&
                        filter.map((i, key) => {
                          return (
                            <tr
                              onDoubleClick={() => {
                                handleSelected(i?.accountNumber);
                                setSelected("");
                              }}
                              onClick={() => {
                                setSelected(i?.accountNumber);
                              }}
                              key={key}
                              className={`${
                                selected === i.accountNumber
                                  ? "bg-blue-400 text-white"
                                  : "bg-[#f9f9f9] hover:bg-zinc-200"
                              } h-8 border-spacing-2   cursor-pointer border border-gray-400`}
                            >
                              <td className="capitalize px-2 py-1">{i.accountName}</td>
                              <td className="    px-2 py-1">
                                {i.accountNumber === "null" ? "0.00" : i.accountNumber}
                              </td>
                              <td className="    px-2 py-1">
                                {i.isoCode === "null" ? "0.00" : i.isoCode}
                              </td>
                              <td className="    px-2 py-1">
                                {i.customer_number === "null" ? "0.00" : i.customer_number}
                              </td>
                            </tr>
                          );
                        })}

                      {loading && (
                        <tr className="">
                          <td className="px-2 pt-2">
                            <Skeleton active />
                          </td>
                          <td className="px-2">
                            <Skeleton active />
                          </td>
                          <td className="px-2">
                            <Skeleton active />
                          </td>
                          <td className="px-2">
                            <Skeleton active />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <br />
          </div>
        </div>
      }
    />
  );
};

export default GlobalModal;
