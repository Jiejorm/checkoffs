import { useEffect, useState } from "react";
import { MDBIcon, MDBRadio } from "mdb-react-ui-kit";
import ListOfValue from "../components/ListOfValue";
import InputField from "../components/inputField";
import ActionButtons from "../../../../components/others/action-buttons/ActionButtons";
import CustomTable from "../components/CustomTable";
import { API_SERVER } from "../../../../config/constant";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import swal from "sweetalert";

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

export default function DenominationExchange() {
  // states
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [tillPosition, setTillPosition] = useState("");
  const [outgoingTotalAmount, setOutgoingTotalAmount] = useState(0);
  const [receivingTotalAmount, setReceivingTotalAmount] = useState(0);
  const [okClick, setOkClick] = useState(false);
  const [params, setParams] = useState([
    {
      denomination: "",
      denominationDesc: "",
      amount: "",
      quantity: "",
      currency_code: "",
    },
  ]);
  const [receivingParams, setReceivingParams] = useState([
    {
      denomination: "",
      denominationDesc: "",
      amount: "",
      quantity: "",
      currency_code: "",
    },
  ]);
  const dates = new Date(
    JSON.parse(localStorage.getItem("userInfo"))?.postingDate
  );
  const month = dates.getMonth() + 1; // getMonth() returns a zero-indexed value, so add 1 to get the actual month number
  const day = dates.getDate();
  const year = dates.getFullYear();

  const removeParam = (index) => {
    const list = [...params];
    list.splice(index, 1);
    setParams(list);
  };
  const removeReceivingParam = (index) => {
    const list = [...receivingParams];
    list.splice(index, 1);
    setReceivingParams(list);
  };

  function handleNewBtnClick() {
    setOutgoingTotalAmount(0);
    setReceivingTotalAmount(0);
    setParams([
      {
        denomination: "",
        denominationDesc: "",
        amount: "",
        quantity: "",
        currency_code: "",
      },
    ]);
    setReceivingParams([
      {
        denomination: "",
        denominationDesc: "",
        amount: "",
        quantity: "",
        currency_code: "",
      },
    ]);
    setOkClick(!okClick);
  }
  const updateDenomination = (index, newDenomination) => {
    setParams((prevParams) => {
      return prevParams.map((param, i) => {
        if (i === index) {
          return { ...param, denomination: newDenomination };
        }
        return param; // Return the unchanged param for other elements
      });
    });
  };

  const handleMatchDenomination = (e) => {
    if (params[params.length - 1]?.denomination !== "") {
      const matchedItem = tillPosition?.denominations.find(
        (item) => item[0] === params[params.length - 1]?.denomination
      );

      if (matchedItem) {
        const arr = [...params];
        arr.pop();
        arr.push({
          denomination: matchedItem[0],
          denominationDesc: matchedItem[1],
          quantity: "",
        });
        setParams(arr);
        var input = document.getElementById("oAmount");
        input.focus();
      } else {
        swal({
          title: "",
          text: "Invalid Denomination Entered",
          icon: "warning",
          buttons: "OK",
          dangerMode: true,
          if(result) {},
        });
      }
    }
  };
  const handleReceivingMatchDenomination = (e) => {
    const matchedItem = tillPosition?.denominations.find(
      (item) =>
        item[0] === receivingParams[receivingParams.length - 1]?.denomination
    );

    if (matchedItem) {
      const arr = [...receivingParams];
      arr.pop();
      arr.push({
        denomination: matchedItem[0],
        denominationDesc: matchedItem[1],
        quantity: "",
      });
      setReceivingParams(arr);
      var input = document.getElementById("rAmount");
      input.focus();
    } else {
      swal({
        title: "",
        text: "Invalid Denomination Entered",
        icon: "warning",
        buttons: "OK",
        // dangerMode: true,
      }).then((result) => {
        if (result) {
          // setShowModal(false);
        }
      });
    }
  };
  console.log(params[params.length - 1]?.denomination, "amount");
  const handleAmount = async (e) => {
    const lastIndex = params.length - 1;
    if (
      params[lastIndex]?.amount !== undefined &&
      params[lastIndex]?.denomination !== undefined &&
      params[lastIndex]?.amount !== "" &&
      tillPosition?.denominations.find(
        (item) =>
          item[0] === params[lastIndex]?.denomination &&
          params[lastIndex]?.amount <= item[2]
      )
    ) {
      const divisionResult =
        params[lastIndex].amount / params[lastIndex].denomination;
      // Check if the division result is an integer (no remainder).
      if (Number.isInteger(divisionResult)) {
        params[lastIndex].quantity = divisionResult;
        params[lastIndex].currency_code = selectedCurrency;
        // params[lastIndex].amount =z

        setParams([...params]);

        const totalAmount = params.reduce((acc, param) => {
          // Check if the 'amount' property exists and is a valid number.
          const amountValue = parseInt(param.amount);
          if (!isNaN(amountValue)) {
            return acc + amountValue;
          } else {
            return acc;
          }
        }, 0);
        setOutgoingTotalAmount(totalAmount);
        // console.log("Total Amount:", totalAmount);
      } else if (!Number.isInteger(divisionResult)) {
        // alert("Invalid Amount");
        const response = await axios.post(
          API_SERVER + "/api/get-error-message",
          { code: "00603" },
          { headers }
        );
        swal({
          // title: "ERR - 01346",
          text: response.data,
          icon: "warning",
          buttons: "OK",
          dangerMode: true,
        }).then((result) => {
          if (result) {
          }
        });
      }
    } else {
      if (
        tillPosition?.denominations.find(
          (item) =>
            item[0] === params[lastIndex]?.denomination &&
            params[lastIndex]?.amount >= item[2]
        )
      ) {
        if (
          tillPosition?.denominations.find(
            (item) =>
              item[0] === params[lastIndex]?.denomination &&
              parseFloat(params[lastIndex]?.denomination) %
                parseFloat(params[lastIndex]?.amount) !==
                0
          )
        ) {
          // alert("sdk");
          const response = await axios.post(
            API_SERVER + "/api/get-error-message",
            { code: "00603" },
            { headers }
          );
          return swal({
            // title: "ERR - 01346",
            text: response.data,
            icon: "warning",
            buttons: "OK",
            dangerMode: true,
          });
        }

        const response = await axios.post(
          API_SERVER + "/api/get-error-message",
          { code: "00602" },
          { headers }
        );
        return swal({
          // title: "ERR - 01346",
          text: response.data,
          icon: "warning",
          buttons: "OK",
          dangerMode: true,
        });
      }

      // alert("Invalid Parameters");
      if (
        tillPosition?.denominations.find(
          (item) =>
            item[0] === params[lastIndex]?.denomination &&
            (params[lastIndex]?.amount === "" || params[lastIndex]?.amount == 0)
        )
      ) {
        const response = await axios.post(
          API_SERVER + "/api/get-error-message",
          { code: "00349" },
          { headers }
        );
        swal({
          // title: "ERR - 01346",
          text: response.data,
          icon: "warning",
          buttons: "OK",
          dangerMode: true,
        }).then((result) => {
          if (result) {
          }
        });
      }
    }
  };

  const handleReceivingAmount = async (e) => {
    const lastIndex = receivingParams.length - 1;
    if (
      receivingParams[lastIndex]?.amount !== undefined &&
      receivingParams[lastIndex]?.denomination !== undefined
    ) {
      const divisionResult =
        receivingParams[lastIndex].amount /
        receivingParams[lastIndex].denomination;
      // Check if the division result is an integer (no remainder).
      if (Number.isInteger(divisionResult)) {
        receivingParams[lastIndex].quantity = divisionResult;
        receivingParams[lastIndex].currency_code = selectedCurrency;
        // receivingParams[lastIndex].amount = formatNumber(parseFloat(receivingParams[lastIndex].amount));

        setReceivingParams([...receivingParams]);
        // console.log(receivingParams);
        // Calculate the total amount by summing all 'amount' values.
        const totalAmount = receivingParams.reduce((acc, receivingParam) => {
          // Check if the 'amount' property exists and is a valid number.
          const amountValue = parseInt(receivingParam.amount);
          if (!isNaN(amountValue)) {
            return acc + amountValue;
          } else {
            return acc;
          }
        }, 0);
        setReceivingTotalAmount(totalAmount);
        // console.log("Total Amount:", totalAmount);
      } else {
        // alert("Invalid Amount");
        const response = await axios.post(
          API_SERVER + "/api/get-error-message",
          { code: "00603" },
          { headers }
        );
        swal({
          // title: "ERR - 01346",
          text: response.data,
          icon: "warning",
          buttons: "OK",
          dangerMode: true,
        }).then((result) => {
          if (result) {
          }
        });
      }
    } else {
      const response = await axios.post(
        API_SERVER + "/api/get-error-message",
        { code: "00349" },
        { headers }
      );
      swal({
        // title: "ERR - 01346",
        text: response.data,
        icon: "warning",
        buttons: "OK",
        dangerMode: true,
      }).then((result) => {
        if (result) {
        }
      });
    }
  };

  const addNewParam = () => {
    // console.log(params);
    setParams([
      ...params,
      { param: `PARAM${params.length + 1}`, description: "" },
    ]);
  };
  const addReceivingNewParam = () => {
    // console.log(params);
    setReceivingParams([
      ...receivingParams,
      { param: `PARAM${receivingParams.length + 1}`, description: "" },
    ]);
  };

  const updateParam = (e, index) => {
    const { name, value } = e.target;
    const list = [...params];
    list[index][name] = value;
    setParams(list);
  };

  const updateReceivingParam = (e, index) => {
    const { name, value } = e.target;
    const list = [...receivingParams];
    list[index][name] = value;
    setReceivingParams(list);
  };
  let outgoingFields = [];
  let receivingFields = [];
  const totalAmountRow = [
    "Total",
    // outgoingTotalAmount,
    formatNumber(outgoingTotalAmount),
    "",
  ];
  const totalReceivingAmountRow = [
    "Total",
    formatNumber(receivingTotalAmount),
    "",
  ];

  const handleSubmit = async () => {
    // Convert "denomination & amount" values to numbers
    const convertDenominationsToNumbers = (paramsArray) => {
      return paramsArray.map((param) => ({
        ...param,
        denomination: parseFloat(param.denomination), // Use parseInt or parseFloat to convert to a number
        amount: parseInt(param.amount),
      }));
    };

    // Convert "denomination & amount" values to numbers for both params and receivingParams
    const processedParams = convertDenominationsToNumbers(params);
    const processedReceivingParams =
      convertDenominationsToNumbers(receivingParams);
    if (
      outgoingTotalAmount === receivingTotalAmount &&
      outgoingTotalAmount !== 0
    ) {
      // Outgoing Denominations
      axios
        .post(
          API_SERVER + "/api/denominations",
          {
            denominations: processedParams.reduce((acc, param) => {
              const { denomination, quantity, amount, currency_code } = param;
              acc[denomination] = { amount, quantity, currency_code };
              return acc;
            }, {}),
            teller_name: JSON.parse(localStorage.getItem("userInfo")).id,
            branch: JSON.parse(localStorage.getItem("userInfo")).branchCode,
            batch_no: batchNumber,
            accountNumber: JSON.parse(localStorage.getItem("userInfo")).id,
            collection_flag: "O",
          },
          {
            headers,
          }
        )
        .then(function (response) {
          console.log(response.data);
          if (response.data?.responseCode === "000") {
            // If the first POST request is successful, proceed with the second POST request for receivingParams
            axios
              .post(
                API_SERVER + "/api/denominations",
                {
                  denominations: processedReceivingParams.reduce(
                    (acc, param) => {
                      const { denomination, quantity, amount, currency_code } =
                        param;
                      acc[denomination] = { amount, quantity, currency_code };
                      return acc;
                    },
                    {}
                  ),
                  teller_name: JSON.parse(localStorage.getItem("userInfo")).id,
                  branch: JSON.parse(localStorage.getItem("userInfo"))
                    .branchCode,
                  batch_no: batchNumber,
                  accountNumber: JSON.parse(localStorage.getItem("userInfo"))
                    .id,
                  collection_flag: "I",
                },
                {
                  headers,
                }
              )
              .then(function (response) {
                setOutgoingTotalAmount(0);
                setReceivingTotalAmount(0);
                setParams([
                  {
                    denomination: "",
                    denominationDesc: "",
                    amount: "",
                    quantity: "",
                    currency_code: "",
                  },
                ]);
                setReceivingParams([
                  {
                    denomination: "",
                    denominationDesc: "",
                    amount: "",
                    quantity: "",
                    currency_code: "",
                  },
                ]);
                setOkClick(!okClick);
                // console.log(response.data);
                if (response.data?.responseCode === "000") {
                  swal({
                    title: "Success",
                    text: response.data?.responseMessage,
                    icon: "success",
                    buttons: "OK",
                    // dangerMode: true,
                  }).then((result) => {
                    if (result) {
                    }
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const response = await axios.post(
        API_SERVER + "/api/get-error-message",
        { code: "05837" },
        { headers }
      );

      console.log(response.data, "ghana");
      swal({
        title: "ERROR",
        text: response.data,
        icon: "warning",
        buttons: "OK",
        dangerMode: true,
      }).then((result) => {
        if (result) {
        }
      });
    }
  };

  outgoingFields = params?.map((param, index) => [
    <div className="flex items-start justify-start">
      <InputField
        name={"denomination"}
        id="oDenomination"
        value={params[index]?.denomination}
        onChange={(e) => {
          e.persist();
          if (e.target.value === "") {
            const arr = [...params];

            arr[index].denominationDesc = "";
            arr[index].denomination = e.target.value;
            setParams(arr);
            return;
          }
          setParams((prev) => [
            ...prev,
            { ...prev[index], denomination: e.target.value },
          ]);
          updateParam(e, index);
        }}
        inputWidth={"100%"}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleMatchDenomination(e);
          }
        }}
        onBlur={(e) => {
          handleMatchDenomination(e);
        }}
      />
      <InputField
        id="oDenominationDesc"
        name={"denominationDesc"}
        inputWidth={"100%"}
        value={params[index]?.denominationDesc}
        disabled={true}
        onChange={(e) => {
          e.persist();
          setParams((prev) => [
            ...prev,
            { ...prev[index], denomination: e.target.value },
          ]);
          updateParam(e, index);
        }}
      />
    </div>,
    <InputField
      id="oAmount"
      name={"amount"}
      textAlign={"right"}
      value={params[index]?.amount}
      labelWidth={"0"}
      onChange={(e) => {
        e.persist();
        setParams((prev) => [
          ...prev,
          { ...prev[index], amount: e.target.value },
        ]);
        updateParam(e, index);
      }}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          // console.log(e.target.value);
          handleAmount(e);
        }
      }}
      onBlur={(e) => {
        if (e.target.value.trim() !== "") {
          handleAmount(e);
        }
      }}
      inputWidth={"100%"}
    />,
    <div className="flex items-center">
      <InputField
        id="oQuantity"
        name={"quantity"}
        // label={param.param}
        value={params[index]?.quantity}
        disabled={true}
        inputWidth={"100%"}
      />
      <div
        className={`flex items-center ${
          index !== params.length - 1 ? "invisible" : "visible"
        }`}
      >
        <IoIosAdd
          className="cursor-pointer text-green-600 ml-2 text-xl font-bold border-2 rounded-xl"
          onClick={() => addNewParam(index)}
        />
        <AiOutlineClose
          className={`cursor-pointer text-red-600 ml-2 text-xl font-bold border-2 rounded-xl ${
            index === 0 ? "invisible" : "visible"
          }`}
          onClick={() => removeParam(index)}
        />
      </div>
    </div>,
  ]);
  outgoingFields.push(totalAmountRow);

  receivingFields = receivingParams?.map((receivingParam, index) => [
    <div className="flex items-start justify-start">
      <InputField
        name={"denomination"}
        id="rDenomination"
        value={receivingParams[index]?.denomination}
        onChange={(e) => {
          console.log(e.target.value);
          e.persist();
          setReceivingParams((prev) => [
            ...prev,
            { ...prev[index], denomination: e.target.value },
          ]);
          updateReceivingParam(e, index);
        }}
        inputWidth={"100%"}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleReceivingMatchDenomination(e);
          }
        }}
      />
      <InputField
        id="rDenominationDesc"
        name={"denominationDesc"}
        inputWidth={"100%"}
        value={receivingParams[index]?.denominationDesc}
        disabled={true}
        onChange={(e) => {
          e.persist();
          setReceivingParams((prev) => [
            ...prev,
            { ...prev[index], denominationDesc: e.target.value },
          ]);
          updateReceivingParam(e, index);
        }}
      />
    </div>,
    <InputField
      id="rAmount"
      name={"amount"}
      textAlign={"right"}
      value={receivingParams[index]?.amount}
      labelWidth={"0"}
      onChange={(e) => {
        e.persist();
        setReceivingParams((prev) => [
          ...prev,
          { ...prev[index], amount: e.target.value },
        ]);
        updateReceivingParam(e, index);
      }}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          // console.log(e.target.value);
          handleReceivingAmount(e);
        }
      }}
      inputWidth={"100%"}
    />,
    <div className="flex items-center">
      <InputField
        id="rQuantity"
        name={"quantity"}
        // label={param.param}
        value={receivingParams[index]?.quantity}
        disabled={true}
        inputWidth={"100%"}
      />
      <div
        className={`flex items-center ${
          index !== receivingParams.length - 1 ? "invisible" : "visible"
        }`}
      >
        <IoIosAdd
          className="cursor-pointer text-green-600 ml-2 text-xl font-bold border-2 rounded-xl"
          onClick={() => addReceivingNewParam(index)}
        />
        <AiOutlineClose
          className={`cursor-pointer text-red-600 ml-2 text-xl font-bold border-2 rounded-xl ${
            index === 0 ? "invisible" : "visible"
          }`}
          onClick={() => removeReceivingParam(index)}
        />
      </div>
    </div>,
  ]);
  receivingFields.push(totalReceivingAmountRow);
  useEffect(() => {
    axios
      .get(API_SERVER + "/api/get-unique-ref", {
        headers: headers,
      })
      .then(function (response) {
        // console.log(response.data[0]?.unique_ref, "unique ref");
        setBatchNumber(response.data[0]?.unique_ref);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(
        API_SERVER + "/api/get-branch",
        {
          code: localStorage.getItem("userInfo").branchCode,
        },
        { headers }
      )
      .then((res) => {
        setBranch(res.data);
      });

    axios
      .get(API_SERVER + "/api/get-currency-breado/1", { headers })
      .then((response) => {
        console.log({ cur: response.data });
        setCurrencies(response.data);
      });
  }, [okClick]);

  useEffect(() => {
    axios
      .post(
        API_SERVER + "/api/till-position",
        {
          username: JSON.parse(localStorage.getItem("userInfo"))?.id,
          currency_code: selectedCurrency,
        },
        { headers: headers }
      )
      .then((response) => {
        // console.log("ghana", response);
        const arr = [];
        let total = 0;
        response.data?.denominations?.map((i) => {
          arr.push([...i]);
          total += i[2];
        });

        arr.push([null, "Total", total, null]);

        // console.log({ arr });
        setTillPosition({
          denominations: arr,
          // console.log({ arr });

          tillActivities: response?.data?.tillActivities,
        });
        // console.log({ response });
      });
  }, [selectedCurrency, okClick]);

  console.log(tillPosition?.denominations);
  const handleExitClick = () => {
    // alert("ka");
    if (document.getElementById("exitBTN1")) {
      const exitBTN = document.getElementById("exitBTN1");
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      exitBTN.dispatchEvent(clickEvent);
    }
  };
  return (
    <>
      <div className="rounded h-auto px-2 transform scale-[0.85] -mx-24 ">
        <ActionButtons
          onOkClick={handleSubmit}
          onNewClick={handleNewBtnClick}
          onExitClick={handleExitClick}
        />
        <hr />
        <div>
          <div
            // style={{ background: getTheme.theme.navBarColor }}
            className="mb-2 mt-2 py-2 bg-white"
          >
            <div className="px-2 space-y-2">
              <InputField
                label={"Till ID"}
                labelWidth={"12%"}
                inputWidth="28%"
                disabled={true}
                value={`${JSON.parse(localStorage.getItem("userInfo")).id} - ${
                  JSON.parse(localStorage.getItem("userInfo")).username
                }`}
              />
              <div className="flex justify-between w-full">
                <div className="w-[80%]">
                  <ListOfValue
                    inputWidth={"35%"}
                    label={"Choose Currency"}
                    labelWidth={"15%"}
                    data={currencies}
                    value={selectedCurrency}
                    // defaultValue="010"

                    onChange={(value) => {
                      setSelectedCurrency(value);
                      setTimeout(() => {
                        const input = document.getElementById("oDenomination");
                        input.focus();
                      }, 0);
                    }}
                    // oDenomination
                    onKeyDown={(e) => {
                      // switchFocuslov(e,"branch")
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = document.getElementById("oDenomination");
                        input.focus();
                      }
                    }}
                  />
                </div>
                <div className="w-[20%]">
                  <InputField
                    label={"Batch Number"}
                    labelWidth={"48%"}
                    inputWidth="50%"
                    disabled={true}
                    value={batchNumber}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="my-2" />
          <div className="flex space-x-4 border-2 rounded p-3">
            <div className="w-[65%] space-y-4">
              <div>
                <div className=" px-2 uppercase text-gray-600 font-semibold">
                  DENOMINATION TO CHANGE INTO - OUTGOING
                </div>
                <div className="">
                  <CustomTable
                    headers={["Denomination", "Amount", "Quantity"]}
                    data={outgoingFields}
                  />
                </div>
              </div>

              <div>
                <div className=" px-2 uppercase text-gray-600 font-semibold">
                  denomination being changed - Receiving
                </div>
                <div className="">
                  <CustomTable
                    headers={["Denomination", "Amount", "Quantity"]}
                    data={receivingFields}
                  />
                </div>
              </div>
            </div>
            <div className="w-[35%] bg-white rounded-sm  ">
              <div>
                <div className=" px-2 uppercase text-gray-600 font-semibold">
                  till position
                </div>
                <div style={{ zoom: "90%" }} className="min-h-[150px] ">
                  <CustomTable
                    headers={["Denomination ++ 2", "Amount", "Quantity"]}
                    theadBackground="#22c55e"
                    style={{ columnFormat: [3], columnAlignRight: [3, 4] }}
                    data={tillPosition?.denominations}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
