import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import DataTable from "../../../../components/others/Datatable/DataTable";
import { API_SERVER } from "../../../../config/constant";
import InputField from "./inputField";
import swal from "sweetalert";
import axios from "axios";
import SelectField from "./SelectField";
import ListOfValue from "./ListOfValue";
import Phone_number from "./Phone_number";
import ButtonComponent from "../../../../components/others/Button/ButtonComponent";
import { headers } from "../teller/teller-activities";

const GlobalModal = ({
  showModal,
  setShowModal,
  body,
  setContact,
  setisThirdParty,
  batchNo,
  setThirdPartyEntries,
}) => {
  const [filter, setFilter] = useState([]);
  const [title, setTitle] = useState([]);
  const [IDType, setIDType] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    IDType: "",
    first_name: "",
    last_name: "",
    contact: "",
    IDNumber: "",
  });

  const handleClose = () => {
    swal({
      title: "Are you sure?",
      text: 'You\'re about to close the " AML THIRD PARTY " form',
      icon: "warning",
      buttons: ["Cancel", "Yes, Close Form"],
      dangerMode: true,
    }).then((result) => {
      if (result) {
        setShowModal(false);
        setisThirdParty(false);
      }
    });
  };
  const handleShow = () => setShowModal(true);
  const [fullScreen, setFullscreen] = useState(false);
  const [modalSize, setModalSize] = useState("lg");

  const [getTheme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme"))
  );
  function handleChange(e, name) {
    e.persist();
    console.log({ e });
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  }

  console.log({ formData });

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  async function handleThirdPartySave() {
    if (
      formData.title === "" ||
      formData.IDType === "" ||
      formData.first_name === "" ||
      formData.last_name === "" ||
      formData.contact === "" ||
      formData.IDNumber === ""
    ) {
      swal({
        title: "Kindly Fill all required fields",
        text: "Kindly fill all required fields",
        icon: "warning",
        buttons: "OK",
        dangerMode: true,
      }).then((result) => {
        if (result) {
          // setShowModal(false);
        }
      });
    } else {
      setThirdPartyEntries({ ...formData });

      // console.log({ response });
      // if (response) {
      setisThirdParty(true);

      swal({
        title: "Successful",
        text: "Record saved sucessfully kindly complete transaction",
        icon: "success",
        buttons: "OK",
        dangerMode: false,
      }).then((result) => {
        if (result) {
          setShowModal(false);
        }
      });
      // }
    }
  }
  // useEffect(() => {
  //   console.log("ghamannnan");
  //   const getTitle = async () => {
  //     const response = axios.post(
  //       API_SERVER + "api/get-code-details",
  //       {
  //         code: "TIT",
  //       },
  //       headers
  //     );
  //     setTitle(response.data);
  //   };
  //   getTitle();

  //   const getIDType = () => {
  //     axios
  //       .post(
  //         API_SERVER + "api/get-code-details",
  //         {
  //           code: "HRD",
  //         },
  //         headers
  //       )
  //       .then(function (response) {
  //         //  localStorage.setItem("title", JSON.stringify(response.data));
  //         setIDType(response.data);
  //       });
  //   };

  //   const getNationality = () => {
  //     axios
  //       .post(
  //         API_SERVER + "api/get-code-details",
  //         {
  //           code: "CON",
  //         },
  //         headers
  //       )
  //       .then(function (response) {
  //         //  localStorage.setItem("title", JSON.stringify(response.data));
  //         setNationality(response.data);
  //       });
  //   };

  //   // getNationality();
  //   // getTitle();
  //   // getIDType();
  // }, []);

  useEffect(() => {
    axios
      .post(API_SERVER + "/api/get-code-details", { code: "TIT" }, { headers })
      .then((res) => {
        console.log(res.data);
        setTitle(res.data);
      });

    axios
      .post(API_SERVER + "/api/get-code-details", { code: "HRD" }, { headers })
      .then((res) => {
        console.log(res.data);
        setIDType(res.data);
      });

    axios
      .post(API_SERVER + "/api/get-code-details", { code: "CON" }, { headers })
      .then((res) => {
        console.log(res.data);
        setNationality(res.data);
      });
  }, []);

  return (
    <Modal
      className=""
      size={"70%"}
      fullscreen={"xl"}
      opened={showModal}
      onClose={handleClose}
      withCloseButton={false}
      padding={0}
      // centered
    >
      <div className="" style={{ zoom: 0.9 }}>
        <div>
          <div
            style={{
              backgroundColor: "#0580c0",
            }}
            className=" w-full "
          >
            <div className=" flex justify-between py-1 px-2 items-center ">
              <div className="text-white font-semibold">AML THIRD PARTY</div>

              <svg
                onClick={() => handleClose()}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                // style={{ padding: "10px" }}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer fill-cyan-500 stroke-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          {/* <hr style={{ marginTop: "-10%" }} /> */}
        </div>
        <div style={{ background: "whitesmoke" }} className="text-gray-600">
          {/* <div className="bg-gray-200 px-2 py-1 scale-[0.85] -mx-20 -mt-9 -mb-14">
          <div>
            <p>Find a partial value to limit the list , %% to see all values</p>
            <p>
              Warning : Entering % to see all values may take a very long time
              Entering criteria that can be used to reduce the list may be
              significantly faster
            </p>
          </div>
          <div>
            <div className="mb-3">
              <InputField
                label={"Find"}
                labelWidth={"15%"}
                inputWidth={"85%"}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <DataTable
                data={filter}
                rowsPerPage={10}
                columns={["Account Name", "Account Number", "ISO code"]}
              />
            </div>
          </div>
        </div> */}

          <div className="bg-white shadow rounded p-3">
            <div className="">
              <div className="  flex border-2 mb-3 rounded px-1 py-2">
                <div className="px-2  w-1/2">
                  <div className="mb-2 font-semibold">Personal Details</div>
                  <ListOfValue
                    marginBottom={"8px"}
                    label={"Title"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    required={true}
                    data={title}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, title: value }));
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"First Name"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    required={true}
                    onChange={(e) => {
                      handleChange(e, "first_name");
                    }}
                  />

                  <InputField
                    marginBottom={"8px"}
                    label={"Middle Name"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "middle_name");
                    }}
                  />

                  <InputField
                    marginBottom={"8px"}
                    label={"Last name"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    required={true}
                    onChange={(e) => {
                      handleChange(e, "last_name");
                    }}
                  />

                  <InputField
                    marginBottom={"8px"}
                    label={"Alias"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "alias");
                    }}
                  />

                  <div className="flex space-x-2">
                    <div className="w-[70%]">
                      <SelectField
                        marginBottom={"8px"}
                        labelWidth={"43%"}
                        inputWidth={"50%"}
                        label={"Gender"}
                        data={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                        ]}
                        onChange={(value) => {
                          setFormData((prev) => ({ ...prev, gender: value }));
                        }}
                      />
                    </div>
                    <div className="w-[30%]">
                      <InputField
                        marginBottom={"8px"}
                        label={"Prefix"}
                        labelWidth={"40%"}
                        inputWidth={"60%"}
                        onChange={(e) => {
                          handleChange(e, "prefix");
                        }}
                      />
                    </div>
                  </div>
                  <InputField
                    marginBottom={"8px"}
                    label={"Date of Birth"}
                    labelWidth={"30%"}
                    inputWidth={"40%"}
                    type={"date"}
                    onChange={(e) => {
                      handleChange(e, "date_of_birth");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"Place of Birth"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "place_of_Birth");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"Mother's Name"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "mothers_name");
                    }}
                  />
                  <Phone_number
                    required={true}
                    marginBottom={"8px"}
                    label={"Contact"}
                    labelWidth={"43%"}
                    inputWidth={"60%"}
                    onChange={(value) => {
                      setContact(value);
                      setFormData((prev) => ({ ...prev, contact: value }));
                    }}
                  />
                </div>
                <div className="px-2  w-1/2">
                  <div className="mb-2 font-semibold">Other Details</div>

                  <InputField
                    marginBottom={"8px"}
                    label={"Occupation"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "occupation");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"Source of Wealth"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "sow");
                    }}
                  />
                  <ListOfValue
                    marginBottom={"8px"}
                    label={"Nationality 1"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    data={nationality}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, nationality1: value }));
                    }}
                  />
                  <ListOfValue
                    marginBottom={"8px"}
                    label={"Nationality 2"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    data={nationality}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, nationality2: value }));
                    }}
                  />
                  <ListOfValue
                    marginBottom={"8px"}
                    label={"Nationality 3"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    data={nationality}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, nationality3: value }));
                    }}
                  />

                  <InputField
                    marginBottom={"8px"}
                    label={"Residence"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "residence");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"Email"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "email");
                    }}
                  />
                </div>
              </div>
              <div className="flex border-2 rounded px-1 py-2">
                <div className="px-2 w-1/2">
                  <div className="flex mb-2 font-semibold">
                    <div className="whitespace-nowrap mr-2">ID Details </div>
                  </div>
                  <ListOfValue
                    marginBottom={"8px"}
                    label={"ID Type"}
                    data={IDType}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    required={true}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, IDType: value }));
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"ID Number"}
                    type={"number"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    required={true}
                    onChange={(e) => {
                      handleChange(e, "IDNumber");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"Tax Number"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "taxNo");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"SNN"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "SNN");
                    }}
                  />
                </div>
                <div className="px-2 w-1/2">
                  <div className="flex mb-2 font-semibold">
                    Employee Details{" "}
                    <div className="relative">
                      <hr className="absolute " />
                    </div>
                  </div>

                  <InputField
                    marginBottom={"8px"}
                    label={"Employee Name"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "employee_name");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"Employee Phone"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "employee_phone");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"Employee Address"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "employee_address");
                    }}
                  />
                  <InputField
                    marginBottom={"8px"}
                    label={"Tax Reg Number"}
                    labelWidth={"30%"}
                    inputWidth={"70%"}
                    onChange={(e) => {
                      handleChange(e, "tax_reg_number");
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <ButtonComponent
                onClick={() => {
                  handleThirdPartySave();
                }}
                label="Save"
                buttonBackgroundImage={
                  `url(` +
                  window.location.origin +
                  `/assets/images/headerBackground/` +
                  getTheme.theme.headerImage +
                  `)`
                }
                buttonWidth="12%"
                buttonHeight="30px"
                buttonColor="white"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalModal;
