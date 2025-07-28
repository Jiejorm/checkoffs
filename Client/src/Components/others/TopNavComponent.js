import React, { useState, useEffect, useRef } from "react";
import usg from "../assets/usg.jpeg";
import TopNavOption from "./TopNavOption";

import { BsBank } from "../../node_modules/react-icons/bs/index.esm";
import { FiBell, FiEdit, FiFile, FiMail, FiMenu, FiRepeat, FiUser } from "react-icons/fi";
import { Select, Modal, Button } from "@mantine/core";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { API_SERVER } from "../config/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  AiFillHome,
  AiFillStar,
  AiFillHeart,
  AiOutlineClose,
  AiOutlineExpand,
  AiOutlineCompress,
  AiOutlineMinus,
} from "react-icons/ai";
import Cases from "../views/screens/cases";
import ActionButtons from "./others/action-buttons/ActionButtons";
import { LuFileScan } from "react-icons/lu";

function TopNavComponent({ toggleMenu }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenTable1, setIsModalOpenTable1] = useState(false);
  const [isModalOpenTable2, setIsModalOpenTable2] = useState(false);
  const [utils, setUtils] = useState(false);
  const [showTable1, setShowTable1] = useState(false);
  const [showTable2, setShowTable2] = useState(false);
  const [approvedItemCount, setApprovedItemCount] = useState(5);
  const [rejectedItemCount, setRejectedItemCount] = useState(3);
  const [currentTime, setCurrentTime] = useState("");
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleOpenTable1 = () => {
    setShowTable1(true);
    setShowTable2(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setUtils(false);
    }
  };
  

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      localStorage.clear();
      window.location.href = '/';;
    }
  }, []);


  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Handle logout logic
    localStorage.clear();
    window.location.reload('/');
  };

  const handleOpenTable2 = () => {
    setShowTable1(false);
    setShowTable2(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openModalTable1 = () => {
    setIsModalOpenTable1(true);
  };

  const openModalTable2 = () => {
    setIsModalOpenTable2(true);
  };

  const closeModalTable1 = () => {
    setIsModalOpenTable1(false);
  };

  const closeModalTable2 = () => {
    setIsModalOpenTable2(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  localStorage.setItem(
    "theme",
    '{"theme": {"headerImage":"headerBGDefault.jpg", "backgroundImage":"bgDefault.jpg", "breadcrumbBGColor": "#dbdbdb47", "textColor":"black", "cardBGColor":"", "fontFamily":null}}'
  );

  const [menuScreens, setMenuScreens] = useState([]);
  const [showScreen, setShowScreen] = useState(false);

  const [modalSize, setModalSize] = useState("1440px");
  const [fullScreen, setFullScreen] = useState("0px");
  const [widthC, setWidth] = useState("83.2%");
  const [marginLeftC, setMarginLeft] = useState("0px");
  const [marginTopC, setMarginTop] = useState("-51px");
  const [maximized, setMaximized] = useState(true);
  const [namesOfMinimizedModals, setNamesOfMinimizedModals] = useState(
    localStorage.getItem("namesOfMinimizedModals")
  );
  const [showMenus, setShowMenus] = useState(true);

  function closeModalFunc() {
    const closedForm = localStorage.getItem("formName");

    setWidth("83.7%");
    setModalSize("100%");
    setMarginLeft("0px");
    setMarginTop("65px");
    setValue(true);

    swal({
      title: "Are you sure?",
      text: "You're about to close the '" + closedForm + "' form",
      icon: "warning",
      buttons: ["Cancel", "Yes, Close Form"],
      dangerMode: true,
    }).then((result) => {
      if (result) {
        var minimizedModals = [];
        if (localStorage.getItem("namesOfMinimizedModals")) {
          minimizedModals = JSON.parse(
            localStorage.getItem("namesOfMinimizedModals")
          );
          if(minimizedModals){
          minimizedModals = minimizedModals.filter((e) => e !== closedForm);
          localStorage.setItem(
            "namesOfMinimizedModals",
            JSON.stringify(minimizedModals)
          );
          }
        }

        setShowScreen(false);

        setNamesOfMinimizedModals(JSON.stringify(minimizedModals));
      }
    });
  }

  function closeMinimizedModal(closedForm) {
    setWidth("83.2%");
    setModalSize("1440px");
    setMarginLeft("0px");
    setMarginTop("-51px");

    swal({
      title: "Are you sure?",
      text: "You're about to close the '" + closedForm + "' form",
      icon: "warning",
      buttons: ["Cancel", "Yes, Close Form"],
      dangerMode: true,
    }).then((result) => {
      if (result) {
        var minimizedModals = [];
        if (localStorage.getItem("namesOfMinimizedModals")) {
          minimizedModals = JSON.parse(
            localStorage.getItem("namesOfMinimizedModals")
          );
          minimizedModals = minimizedModals.filter((e) => e !== closedForm);
          localStorage.setItem(
            "namesOfMinimizedModals",
            JSON.stringify(minimizedModals)
          );
        }

        setShowScreen(false);

        setNamesOfMinimizedModals(JSON.stringify(minimizedModals));
      }
    });
  }

  function minimizedCollapsedFunc(formName) {
    // alert(formName);
    setWidth("83.7%");
    setModalSize("1440px");
    setMarginLeft("0px");
    setMarginTop("65px");
    setMaximized(true);

    var namesOfMinimizedModals = [];
    namesOfMinimizedModals = localStorage.getItem("namesOfMinimizedModals");
    var nameOfForm = localStorage.getItem("formName");

    if (namesOfMinimizedModals !== null) {
      if (!namesOfMinimizedModals.includes(nameOfForm)) {
        var minimizedModals = [];

        minimizedModals.push(namesOfMinimizedModals);
        minimizedModals.push(nameOfForm);

        localStorage.setItem(
          "namesOfMinimizedModals",
          JSON.stringify(minimizedModals.filter((e) => e !== "[]"))
        );

        setNamesOfMinimizedModals(
          JSON.stringify(minimizedModals.filter((e) => e !== "[]"))
        );
      }
    } else {
      localStorage.setItem(
        "namesOfMinimizedModals",
        JSON.stringify(nameOfForm)
      );
    }

    if (localStorage.getItem("namesOfMinimizedModals")) {
      var minModal = localStorage
        .getItem("namesOfMinimizedModals")
        .replace(/\\/g, "")
        .replace(/"/g, "")
        .replace(/[\[\]']+/g, "");

      minModal = minModal.split(",");

      localStorage.setItem("namesOfMinimizedModals", JSON.stringify(minModal));

      setNamesOfMinimizedModals(JSON.stringify(minModal));
      setShowMenus(true);
    }

    // Close Form
    setShowScreen(false);
  }

  function maximizeFunc() {
    setWidth("100.1%");
    setModalSize("1810px");
    setMarginLeft("-295px");
    setMarginTop("65px");
    setMaximized(false);
  }

  function minimizeFunc() {
    setWidth("83.7%");
    setModalSize("1515px");
    setMarginLeft("0px");
    setMarginTop("65px");
    setMaximized(true);
  }

  useEffect(() => {
    // console.log(maximized);
    setMaximized(maximized);
  }, [maximized]);

  useEffect(() => {
    // console.log(widthC);
    setWidth(widthC);
  }, [widthC]);

  useEffect(() => {
    // console.log(showMenus);
    setShowMenus(showMenus);
  }, [showMenus]);

  useEffect(() => {
    localStorage.setItem("namesOfMinimizedModals", namesOfMinimizedModals);
    setNamesOfMinimizedModals(namesOfMinimizedModals);
  }, [namesOfMinimizedModals]);

  useEffect(() => {
    // console.log(modalSize);
    setModalSize(modalSize);
  }, [modalSize]);

  useEffect(() => {
    // console.log(marginLeftC);
    setMarginLeft(marginLeftC);
  }, [marginLeftC]);

  useEffect(() => {
    // console.log(marginTopC);
    setMarginTop(marginTopC);
  }, [marginTopC]);

  function handleIconClickEvent(formName) {
    // alert(formName);
    setWidth("83.2%");
    setModalSize("1440px");
    setMarginLeft("0px");
    setMarginTop("-51px");
    setMaximized(true);
    localStorage.setItem("formName", formName);
    setShowScreen(true);
  }

  function handleSearchClickEvent(formName) {
    if (formName === "" || formName === undefined || formName === null) {
      document.getElementById("menuShortCut").required = true;
      document.getElementById("menuShortCut").focus();
      return false;
    } else {
      // const storeSystemAuditLog = async () => {
      //   await axios
      //     .post(
      //       API_SERVER + "/api/store-system-audit-logs",
      //       {
      //         user_id: JSON.parse(localStorage.getItem("userInfo")).id,
      //         page_accessed: formName,
      //         page_url: null,
      //       },
      //       { headers }
      //     )
      //     .then(function (response) {
      //       // console.log(response);
      //     })
      //     .catch(function (error) {
      //       // console.log(error);
      //     });
      // };

      // storeSystemAuditLog();

      // alert(formName);
      // if (document.getElementById("minimizeContainer")) {
      //   document.getElementById("minimizeContainer").click();
      // }
      localStorage.setItem("formName", formName);

      // navigate(item.key);

      setShowScreen(true);

      // return alert(formName);

      // setLoading(true);
      // setTimeout(() => {
      //   setGlobalModal(true);
      //   setLoading(false);
      // }, 0);
    }
  }

  const onGoButtonClick = () => {
    setWidth("83.7%");
    setModalSize("1440px");
    setMarginLeft("0px");
    setMarginTop("65px");
    localStorage.setItem("formName", selectedMenuItem);
    handleSearchClickEvent(selectedMenuItem);
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(year, monthIndex)
    );
    const day = currentDate.getDate().toString().padStart(2, "0");
    return `${month} ${day}, ${year}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const hours = currentDate.getHours().toString().padStart("0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const seconds = currentDate.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const [response, setResponse] = useState([]);
  const [value, setValue] = useState("");

  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  const [approvalSummaryCount, setApprovalSummaryCount] = useState(0);

  const headers = {
    "x-api-key":
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Content-Type": "application/json",
  };

  // console.log(headers);

  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(userInfoString);

  const user_id = userInfo.id;
  const branch = userInfo.branch;

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${API_SERVER}/api/summary-approvals`,
        { user_id: user_id, branch: branch },
        { headers }
      );

      let counter = 0;

      response.data.map((d, index) => {
        counter += d.num;
      });

      setApprovalSummaryCount(counter);
    } catch (error) {
      // Handle error here
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 3000); // Set the timeout duration as needed

    return () => {
      clearTimeout(timeout);
    };
  }, [approvalSummaryCount]);


  useEffect(() => {
    function getMenuIcons() {
      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = JSON.parse(userInfoString);

      const user_id = userInfo?.id;
      const authCode = userInfo?.authorityCode;

      axios
        .post(
          API_SERVER + "/api/get-active-menus-by-menu-level",
          {
            menu_level: 3,
            userID: user_id,
            authorityCode: authCode,
          },
          { headers }
        )
        .then((res) => {
          const arr = [];
          res.data.map((i) => {
            arr.push({
              key: `${i.menu_id}`,
              value: `${i.menu_name}`,
              label: `${i.menu_id} - ${i.menu_name}`,
            });
          });
          setResponse(arr);
        });
    }
    getMenuIcons();
  }, []);

  const generateApprovedItems = () => {
    const rows = [];
    for (let i = 1; i <= approvedItemCount; i++) {
      rows.push(
        <tr key={i}>
          <td className="border px-4 py-1 text-center">Item {i}</td>
          <td className="border px-4 py-1 text-center">Description {i}</td>
          <td className="border px-4 py-2 flex items-center justify-center">
            <AiOutlineCheckCircle className="text-green-500" />
          </td>
        </tr>
      );
    }
    return rows;
  };

  const generateRejectedItems = () => {
    const rows = [];
    for (let i = 1; i <= rejectedItemCount; i++) {
      rows.push(
        <tr key={i}>
          <td className="border px-4 py-1 text-center">Item {i}</td>
          <td className="border px-4 py-1 text-center">Description {i}</td>
          <td className="border px-4 py-2 flex items-center justify-center">
            <MdOutlineCancel className="text-red-500" />
          </td>
        </tr>
      );
    }
    return rows;
  };

  const modalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Background color for the modal overlay
    },
    modal: {
      backgroundColor: "#000", // Background color for the modal content
    },
  };

  return (
    <div className=" ">
      {showScreen && (
        <div
          className="w-[82.5%] h-auto mt-2 mb-2"
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            height: "86.5%",
            marginTop: marginTopC,
            marginLeft: marginLeftC,
            zoom: "0.85",
            zIndex: 10,
            overflowY: "auto",
            overflowX: "hidden", // Added to prevent horizontal scrollbar
            width: widthC,
          }}
        >
          <div>
            <div
              style={{
                height: "25px",
                display: "flex",
                zIndex: 10,
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className="bg-sky-700"
            >
              <span className="ml-2 text-white font-bold">
                {localStorage.getItem("formName")}
              </span>

              <div className="flex flex-row mr-2">
                <span className="mr-2">
                  <AiOutlineMinus
                    className="hover:cursor-pointer"
                    color="white"
                    onClick={() =>
                      minimizedCollapsedFunc(localStorage.getItem("formName"))
                    }
                  />
                </span>
                <span className="mr-2">
                  {(() => {
                    if (maximized) {
                      return (
                        <AiOutlineExpand
                          className="hover:cursor-pointer"
                          color="white"
                          onClick={() => maximizeFunc()}
                        />
                      );
                    } else {
                      return (
                        <AiOutlineCompress
                          className="hover:cursor-pointer"
                          color="white"
                          onClick={() => minimizeFunc()}
                        />
                      );
                    }
                  })()}
                </span>
                <span>
                  <AiOutlineClose
                    className="hover:cursor-pointer"
                    color="white"
                    id="exitBTN1"
                    onClick={() => closeModalFunc()}
                  />
                </span>
              </div>
            </div>

            <div style={{ width: modalSize }} className="p-3">
              <Cases
                setModalSize={setModalSize}
                // setFullScreen={setFullScreen}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        title="My Pending Items"
        styles={modalStyles}
      >
        <div>
          <div className="flex items-center justify-evenly">
            {/* <button onClick={openModalTable1} className="border p-2 rounded-md hover:shadow bg-green-400 ">Approved Items</button>
            <button onClick={openModalTable2}>Rejected Items</button> */}
            {/* <button onClick={openModalTable1} className="relative border p-2 rounded-md hover:shadow bg-sky-700">
              Approve These
              {approvedItemCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-2 translate-y-0 bg-gray-300 text-black rounded-full w-5 h-5">
                  {approvedItemCount}
                </span>
              )}
            </button> */}

            <button
              onClick={openModalTable1}
              className="relative border p-2 rounded-md hover:shadow bg-green-400"
            >
              Approved Items
              {approvedItemCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-2 translate-y-0 bg-sky-700 text-white rounded-full w-5 h-5">
                  {approvedItemCount}
                </span>
              )}
            </button>
            <button
              onClick={openModalTable2}
              className="relative border p-2 rounded-md hover:shadow bg-red-400"
            >
              Rejected Items
              {rejectedItemCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-2 translate-y-0 bg-green-500 text-white rounded-full w-5 h-5">
                  {rejectedItemCount}
                </span>
              )}
            </button>
          </div>

          <Modal
            opened={isModalOpenTable1}
            onClose={closeModalTable1}
            title="Approved Items"
          >
            <table className="table w-full">
              <thead>
                <tr className="bg-sky-700">
                  <th className="border px-2">Items</th>
                  <th className="border px-2">Description</th>
                  <th className="border px-2">Status</th>
                </tr>
              </thead>
              <tbody>{generateApprovedItems()}</tbody>
            </table>
          </Modal>

          <Modal
            opened={isModalOpenTable2}
            onClose={closeModalTable2}
            title="Reject Items"
          >
            <table className="table w-full">
              <thead>
                <tr className="bg-sky-700">
                  <th className="border px-2 py-1">Items</th>
                  <th className="border px-2 py-1">Description</th>
                  <th className="border px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>{generateRejectedItems()}</tbody>
            </table>
          </Modal>
        </div>
      </Modal>

      {/* flexing the x 100 logo and the other options on the right side */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1px",
          alignItems: "center",
          borderBottom: "1px solid lightgray",
          // height: '100px'
        }}
        className="bg-sky-100"
      >
        {/* x100 logo */}
        <div onClick={toggleMenu} className="cursor-pointer">
          <div className="flex items-end">
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* <img 
                src={usg}
                alt="Union Systems Global"
                style={{ height: "60px" }}
              /> */}

              <div
                style={{
                  fontSize: "35px",
                  // fontStyle: "italic",
                  fontWeight: "500",
                  fontFamily: "Segoe Print",
                }}
                className="ml-2"
              >
                X.100
              </div>
            </div>

            <div
              style={{
                fontSize: "10px",
                fontWeight: "500",
              }}
              className="mb-2"
            >
              Banking&nbsp;System
            </div>
          </div>
        </div>

        {/* other options on the right side */}
        <div className="flex items-center">
          <div style={{ display: "flex" }}>
            <div className="relative">
              <div
                className="mb-2"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setUtils(!utils);
                }}
              >
                <TopNavOption title="Utilities" icon={<FiMenu />} />
              </div>
              {utils && (
                <div className="absolute top-10 left-[2px] " ref={modalRef}>
                  <Menu
                    mode="vertical"
                    // openKeys={openKeys}
                    // onOpenChange={onOpenChange}
                    style={{ width: 210 }}
                    items={[
                      // {
                      //   label: (
                      //     <div
                      //       style={{
                      //         borderBottom: "4px solid black",
                      //       }}
                      //     >
                      //       ghana
                      //     </div>
                      //   ),
                      //   icon: <FiMenu />,
                      //   children: [{ label: "jijij" }],
                      // },
                      {
                        label: "Scan Document",
                        icon: <LuFileScan />,
                        children: [{ label: "jijij" }],
                      },
                      {
                        label: "Offline Reports",
                        icon: <FiFile />,
                        children: [{ label: "jijij" }, { label: "jijij" }],
                      },
                      {
                        label: "Change Branch",
                        icon: <FiRepeat />,
                        children: [{ label: "jijij" }, { label: "jijij" }],
                      },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* <div style={{ marginRight: "10px" }}>
              <TopNavOption title="Rejected Queue" icon={<FiUser />} />
            </div> */}

            <div
              style={{ marginLeft: "10px", marginRight: "23px" }}
              onClick={() => {
                setSelectedMenuItem("My Approvals");
                setWidth("83.7%");
                setModalSize("100%");
                setMarginLeft("0px");
                setMarginTop("65px");
                setValue(true);
                handleSearchClickEvent("My Approvals");
              }}
              className="relative mr-2"
            >
              <div
                style={{ zIndex: "999999999" }}
                className="absolute -top-2 -right-2 rounded-full bg-green-500 p-1 text-xs text-white"
              >
                {approvalSummaryCount}
              </div>

              {/* <TopNavOption title="Pending Items" icon={<FiBell />} /> */}
              <button
                className="px-3 py-1 rounded text-white"
                style={{ background: "#2a93f5" }}
              >
                Pending Items
              </button>
            </div>

            <div
              style={{ marginRight: "30px" }}
              onClick={() => alert("Welcome!")}
            >
              <TopNavOption title="Messages" icon={<FiMail />} />
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div
              style={{ marginRight: "10px", cursor: "pointer" }}
              onClick={handleToggle}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <TopNavOption
                  title="Profile"
                  icon={<BsBank />}
                  width={50}
                  height={50}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-12px",
                    transform: "translateY(-50%)",
                    width: "10px",
                    height: "10px",
                    background: "#f0f9ff",
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  }}
                />
              </div>
            </div>
            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#f0f9ff",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  borderRadius: "4px",
                  marginLeft: "-300px",
                  zIndex: 9999999999999,
                  width: "210px",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  {/* User Avatar */}
                  <div
                    style={{
                      width: "40px",
                      height: "35px",
                      borderRadius: "50%",
                      background: "#2a93f5",
                      marginRight: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "5px",
                    }}
                  >
                    <FiUser size={20} color="#fff" />
                  </div>
                  {/* Username */}
                  <div>
                    <span style={{ whiteSpace: "nowrap" }}>
                      {localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).username : ""}
                    </span>
                  </div>
                </div>
                {/* Divider */}
                <div
                  style={{
                    borderTop: "1px solid #eee",
                    marginBottom: "10px",
                    marginTop: "-5px",
                  }}
                />
                {/* Profile Option */}
                <div style={{ cursor: "pointer" }} onClick={handleLogout}>
                  &nbsp;&nbsp;&nbsp;My Profile Details
                </div>
                {/* Divider */}
                <div
                  style={{
                    borderTop: "1px solid #eee",
                    marginBottom: "5px",
                    marginTop: "10px",
                  }}
                />
                {/* Logout Option */}
                <div style={{ cursor: "pointer" }} onClick={handleLogout}>
                  &nbsp;&nbsp;&nbsp;Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* bottom part of the top nav */}
      <div
        className="bg-sky-50"
        style={{
          padding: "4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid lightgray",
        }}
      >
        {/* Menu Shortcut */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              marginRight: "5px",
              marginLeft: "8px",
              fontSize: "13.5px",
            }}
          >
            Menu&nbsp;Shortcut
          </div>
          <div style={{ marginRight: "5px" }}>
            <Select
              id="menuShortCut"
              require="required"
              // size="medium"
              style={{ width: "270px", fontSize: "10px" }}
              placeholder="Menu Shortcut"
              searchable
              nothingFound="No options"
              data={response}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchClickEvent(
                    document.getElementById("menuShortCut").value
                  );
                  setSelectedMenuItem(
                    document.getElementById("menuShortCut").value
                  );
                }
              }}
              onChange={(formName) => {
                setSelectedMenuItem(formName);
                setWidth("83.7%");
                setModalSize("1440px");
                setMarginLeft("0px");
                setMarginTop("65px");
                setValue(true);
                handleSearchClickEvent(formName);
              }}
            />
          </div>
          <div
            onClick={onGoButtonClick}
            style={{
              padding: "5px",
              // backgroundColor: "#2a93f5",
              color: "white",
              borderRadius: "4px",
              marginRight: "5px",
              fontWeight: "500",
            }}
            className="cursor-pointer bg-sky-700 hover:bg-sky-500"
          >
            Go
          </div>
        </div>

        <div
          style={{ display: "flex", fontSize: "13.5px", alignItems: "center" }}
        >
          <Timer />
          <div
            style={{
              marginRight: "5px",
              paddingRight: "10px",
              paddingLeft: "3px",
              borderRight: "1px solid",
              whiteSpace: "nowrap",
            }}
          >
            User: <b>{localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).username : ""}</b>
          </div>
          <div
            style={{
              marginRight: "5px",
              paddingRight: "0px",
              paddingLeft: "3px",
              whiteSpace: "nowrap",
            }}
          >
            Branch: <b>{localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).branch : ""}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavComponent;

function Timer() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const hours = currentDate.getHours().toString().padStart("0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const seconds = currentDate.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(year, monthIndex)
    );
    const day = currentDate.getDate().toString().padStart(2, "0");
    return `${month} ${day}, ${year}`;
  };
  return (
    <div
      style={{
        marginRight: "5px",
        paddingRight: "10px",
        borderRight: "1px solid",
        whiteSpace: "nowrap",
      }}
    >
      &nbsp;&nbsp;{getCurrentDate()} : {currentTime}
    </div>
  );
}
