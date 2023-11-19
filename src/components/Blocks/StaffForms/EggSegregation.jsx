import { useEffect, useState } from "react";
import { Button, TextInput } from "../../Forms";
import { useFunction } from "../../../context/FunctionContext";
import { format } from "date-fns";
import { useAuth } from "../../../context/authContext";
import { Alert, Modal } from "../../Containers";
import EggSegregationTable from "../../Tables/EggSegregationTable";
// eslint-disable-next-line react/prop-types
export default function EggSegregation() {
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [eggsData, setEggsData] = useState([]);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [eggData, setEggData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    unsorted_egg_production: 0,
    no_weight: [0, 0],
    pewee: [0, 0],
    pullet: [0, 0],
    brown: [0, 0],
    small: [0, 0],
    medium: [0, 0],
    large: [0, 0],
    extra_large: [0, 0],
    jumbo: [0, 0],
  });
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const { toTitle, capitalize } = useFunction();
  const { getCurrentUser, retrieveEggsForSegregation, insertEggSegregation } =
    useAuth();

  const handleInputChange = (label, value, index) => {
    if (label.includes("date")) {
      setEggData((data) => ({
        ...data,
        [label]: value,
      }));
    }

    if (index !== null) {
      let updatedEggData = {};
      const type = [...eggData[label]];
      type[index] = parseInt(value);
      updatedEggData = { ...eggData, [label]: type };

      let totalPieces = 0;
      let totalTrays = 0;
      Object.keys(updatedEggData)
        .filter(
          (key) =>
            !["unsorted_egg_production", "building_number", "date"].includes(
              key
            )
        )
        .forEach((type) => {
          totalPieces += parseInt(updatedEggData[type][1]);
          totalTrays += parseInt(updatedEggData[type][0]);
        });
      if (
        totalPieces <= eggsData.egg_pieces &&
        totalTrays <= eggsData.egg_trays
      ) {
        setEggData(updatedEggData);
      } else {
        console.log("STAHPPPP");
      }
    }
  };

  const handleSubmit = async () => {
    setModalTitle(null);
    const data = { ...eggData };
    data.user_id = parseInt(JSON.parse(getCurrentUser()).user_id);
    data.log_date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    try {
      const response = await insertEggSegregation(data);
      console.log(response);
      if (response === 1) {
        toggleAlert({
          type: "success",
          title: "Segregation Success",
          message: "You have successfully submitted!",
          show: true,
        });
      } else {
        toggleAlert({
          type: "warning",
          title: "Segregation Error",
          message:
            "There has been an error on submitting your segregation. Please try again.",
          show: true,
        });
      }
      doRefresh((count) => (count = count + 1));
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleClose = () => {
    setModalTitle(null);
    toggleAlert({ type: "success", title: "", message: "", show: false });
    setSelectedProduction(null);
    setEggData({
      date: format(new Date(), "yyyy-MM-dd"),
      unsorted_egg_production: 0,
      no_weight: [0, 0],
      pewee: [0, 0],
      pullet: [0, 0],
      brown: [0, 0],
      small: [0, 0],
      medium: [0, 0],
      large: [0, 0],
      extra_large: [0, 0],
      jumbo: [0, 0],
    });
  };

  useEffect(() => {
    const setup = async () => {
      const eggListResponse = await retrieveEggsForSegregation();
      setEggsData(eggListResponse);
    };
    setup();
  }, [refresh]);

  return (
    <>
      <div className="p-2 flex flex-col gap-2 w-full animate-fade">
        <div className="w-full">
          <p className="text-[1.2rem] font-semibold">Egg Segregation</p>
          <form
            className="flex flex-col gap-2 bg-default p-2 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              setModalTitle("Confirmation");
            }}
          >
            <div className="flex flex-col lg:flex-row gap-2 bg-default p-2">
              <div className="flex flex-col gap-2 bg-default p-2 lg:w-1/2">
                {Object.keys(eggData)
                  .splice(0, 2)
                  .map((eggKey, index) => {
                    return eggKey === "unsorted_egg_production" ? (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex flex-row items-center justify-between">
                          <span className="w-1/2 p-1">
                            Available Egg Trays:{" "}
                          </span>
                          <span className="w-1/2 p-1 px-2">
                            {eggsData.egg_trays}
                          </span>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                          <span className="w-1/2 p-1">
                            Available Egg Pieces
                          </span>
                          <span className="w-1/2 p-1 px-2">
                            {eggsData.egg_pieces}
                          </span>
                        </div>
                      </div>
                    ) : eggKey.includes("date") ? (
                      <TextInput
                        id={eggKey}
                        key={index}
                        withLabel={capitalize(toTitle(eggKey)) + ":"}
                        value={eggData[eggKey]}
                        type="date"
                        orientation="row"
                        classes="p-1 items-center "
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2 disabled:bg-default-dark"
                        onChange={(e) =>
                          handleInputChange(eggKey, e.target.value)
                        }
                      />
                    ) : (
                      <></>
                    );
                  })}
                <p className="w-1/2 ml-auto flex flex-row items-center">
                  <span className="w-1/2 text-center">Trays</span>
                  <span className="w-1/2 text-center">Pieces</span>
                </p>
                {Object.keys(eggData)
                  .splice(2, 5)
                  .map((eggKey, index) => {
                    return (
                      <div key={index} className="flex flex-row w-full">
                        <span className="w-1/2">
                          {capitalize(toTitle(eggKey)) + ":"}
                        </span>
                        <div className="w-1/2 flex flex-row">
                          <TextInput
                            id={eggKey}
                            value={eggData[eggKey][0]}
                            type="number"
                            orientation="row"
                            classes="p-1 items-center w-1/2"
                            labelClasses="whitespace-nowrap w-full text-start"
                            inputClasses="w-full rounded px-2 disabled:bg-default-dark"
                            onChange={(e) =>
                              handleInputChange(eggKey, e.target.value, 0)
                            }
                          />
                          <TextInput
                            id={eggKey}
                            value={eggData[eggKey][1]}
                            type="number"
                            orientation="row"
                            classes="p-1 items-center w-1/2"
                            labelClasses="whitespace-nowrap w-full text-start"
                            inputClasses="w-full rounded px-2 disabled:bg-default-dark"
                            onChange={(e) =>
                              handleInputChange(eggKey, e.target.value, 1)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex flex-col gap-2 bg-default p-2 lg:w-1/2">
                <p className="w-1/2 ml-auto flex flex-row items-center">
                  <span className="w-1/2 text-center">Trays</span>
                  <span className="w-1/2 text-center">Pieces</span>
                </p>
                {Object.keys(eggData)
                  .splice(7, 15)
                  .map((eggKey, index) => {
                    return (
                      <div key={index} className="flex flex-row w-full">
                        <span className="w-1/2">
                          {capitalize(toTitle(eggKey)) + ":"}
                        </span>
                        <div className="w-1/2 flex flex-row">
                          <TextInput
                            id={eggKey}
                            value={eggData[eggKey][0]}
                            type="number"
                            orientation="row"
                            classes="p-1 items-center w-1/2"
                            labelClasses="whitespace-nowrap w-full text-start"
                            inputClasses="w-full rounded px-2 disabled:bg-default-dark"
                            onChange={(e) =>
                              handleInputChange(eggKey, e.target.value, 0)
                            }
                          />
                          <TextInput
                            id={eggKey}
                            value={eggData[eggKey][1]}
                            type="number"
                            orientation="row"
                            classes="p-1 items-center w-1/2"
                            labelClasses="whitespace-nowrap w-full text-start"
                            inputClasses="w-full rounded px-2 disabled:bg-default-dark"
                            onChange={(e) =>
                              handleInputChange(eggKey, e.target.value, 1)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <Button
              type="submit"
              value="Submit"
              className="bg-tertiary p-1 px-2 w-fit rounded-md hover:bg-main hover:text-white transition-all"
            />
          </form>
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-2 p-2">
            <p className="text-[1.2rem] font-semibold">Egg Segregation Logs</p>
          </div>
          <div className="max-h-[300px] overflow-auto rounded-md overflow-y-auto shadow-md">
            <EggSegregationTable refresh={refresh} />
          </div>
        </div>
      </div>
      {modalTitle && (
        <Modal
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          content={
            <>
              <p>Are you sure to submit this information?</p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  value="Confirm"
                  onClick={() => handleSubmit()}
                  className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                />
                <Button
                  value="Cancel"
                  onClick={() => handleClose()}
                  className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                />
              </div>
            </>
          }
        />
      )}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          title={alert.title}
          onClose={() => handleClose()}
        />
      )}
    </>
  );
}
