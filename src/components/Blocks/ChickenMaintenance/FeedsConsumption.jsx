import { useEffect, useState } from "react";
import FeedsConsumptionTable from "../../Tables/FeedsConsumptionTable";
import { Alert, Modal } from "../../Containers";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { BigTextInput, Button, TextInput } from "../../Forms";

export default function FeedsConsumption() {
  const [selectedConsumed, setConsumption] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [feedsList, setFeedsList] = useState([]);
  const [feedsQuantity, setFeedsQuantity] = useState(0);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [buildings, setBuildings] = useState([]);

  const [refresh, doRefresh] = useState(0);
  const { capitalize, toTitle } = useFunction();
  const { getFeeds, getBuilding, updateFeedsConsumption } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    setConsumption(null);
    setFeedsQuantity(0);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await updateFeedsConsumption(selectedConsumed);
    console.log(response);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Feeds Update Success",
        message: "Successfully updated feeds consumption.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Feeds Update Error",
        message:
          "There has been an error on updating feeds consumption. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  const calculateRemaining = (e, label) => {
    const consumedCount = parseInt(document.querySelector("#consumed").value);
    const disposedCount = parseInt(document.querySelector("#disposed").value);
    setConsumption((data) => ({
      ...data,
      [label]: parseInt(e.target.value),
      remaining: feedsQuantity - (consumedCount + disposedCount),
    }));
  };

  useEffect(() => {
    const setup = async () => {
      const feedsResponse = await getFeeds();
      setFeedsList(feedsResponse);
      const buildingResponse = await getBuilding();
      setBuildings(buildingResponse);
    };
    setup();
   
  }, [refresh]);
  return (
    <>
      <div className="overflow-auto">
        <FeedsConsumptionTable
          refresh={refresh}
          setConsumption={setConsumption}
          setModal={setModalTitle}
          setFeedsQuantity={setFeedsQuantity}
        />
      </div>
      {modalTitle && (
        <Modal
          className="w-[95%] max-w-lg"
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          content={
            <>
              <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                {Object.keys(selectedConsumed)
                  .filter((key) => !key.includes("date") && key !== "id")
                  .map((label, index) => {
                    return label === "feed_id" ? (
                      <div key={index} className="flex gap-2 p-1 items-center">
                        <label
                          htmlFor={label}
                          className="whitespace-nowrap text-start w-1/2"
                        >
                          Feeds
                        </label>
                        <select
                          id={label}
                          disabled
                          className="w-full rounded px-2 outline-none border-none p-1 bg-default"
                          onChange={(e) =>
                            setConsumption((current) => ({
                              ...current,
                              feeds: parseInt(e.target.value),
                            }))
                          }
                        >
                          <option value="" selected disabled>
                            Select Feeds
                          </option>
                          {feedsList.map((feeds, index) => {
                            return (
                              <option
                                key={index}
                                value={feeds.id}
                                selected={feeds.id === selectedConsumed[label]}
                              >
                                {capitalize(feeds.name)}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : label === "remarks" ? (
                      <BigTextInput
                        id={label}
                        key={index}
                        withLabel={capitalize(toTitle(label)) + ":"}
                        value={selectedConsumed[label]}
                        orientation="row"
                        classes="p-1 items-start"
                        labelClasses="whitespace-nowrap text-start w-1/2"
                        inputClasses="w-full rounded px-2 h-full resize-none min-h-[100px] bg-default"
                        onChange={(e) =>
                          setConsumption((data) => ({
                            ...data,
                            [label]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <TextInput
                        key={index}
                        name={label}
                        type={label.includes("date") ? "date" : "number"}
                        id={label}
                        withLabel={
                          label === "building_id"
                            ? "Building No."
                            : capitalize(toTitle(label))
                        }
                        disabled={
                          label === "building_id" || label === "remaining"
                        }
                        value={
                          label === "building_id"
                            ? buildings.find(
                                (bldg) => bldg.id == selectedConsumed[label]
                              ).number
                            : selectedConsumed[label]
                        }
                        onChange={(e) => {
                          calculateRemaining(e, label);
                        }}
                        classes="p-1 items-center justify-between"
                        labelClasses="whitespace-nowrap text-start w-1/2"
                        inputClasses="bg-default rounded px-2 disabled:text-gray-600"
                      />
                    );
                  })}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="submit"
                    value="Update"
                    className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                  />
                  <Button
                    value="Cancel"
                    onClick={() => handleClose()}
                    className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                  />
                </div>
              </form>
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
