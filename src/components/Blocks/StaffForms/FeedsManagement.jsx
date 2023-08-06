import React, { useEffect, useState } from "react";
import { Alert, Modal } from "../../Containers";
import { format } from "date-fns";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { BigTextInput, Button, TextInput } from "../../Forms";
import FeedsConsumptionTable from "../../Tables/FeedsConsumptionTable";

export default function FeedsManagement({ building }) {
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [currentBuilding, setCurrentBuilding] = useState([]);
  const [feedsList, setFeedsList] = useState([]);
  const [feedsQuantity, setFeedsQuantity] = useState([]);
  const [selectedFeeds, setSelectedFeeds] = useState(null);

  const [feedsData, setFeedsData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    building_number: 0,
    feed: 0,
    consumed: 0,
    disposed: 0,
    remaining: 0,
    remarks: "",
  });
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });

  const { toTitle, capitalize } = useFunction();
  const {
    getCurrentUser,
    getBuilding,
    getFeeds,
    addFeedsConsumption,
    getFeedQuantity,
  } = useAuth();
  const handleClose = () => {
    setModalTitle(null);
    toggleAlert({ type: "success", title: "", message: "", show: false });
    setSelectedFeeds(null);
    setFeedsData({
      date: format(new Date(), "yyyy-MM-dd"),
      building_number: 0,
      feed: 0,
      consumed: 0,
      disposed: 0,
      remaining: 0,
      remarks: "",
    });
  };
  const handleInputChange = (e, key, exception = null) => {
    const quantity = parseInt(
      feedsQuantity.find((feeds) => feeds.feed_id === feedsData.feed)
        ? feedsQuantity.find((feeds) => feeds.feed_id === feedsData.feed)
            .remaining_quantity
        : 0
    );
    const consumed = parseInt(document.querySelector("#consumed").value);
    const disposed = parseInt(document.querySelector("#disposed").value);

    console.log(quantity - (consumed + disposed));
    setFeedsData((data) => ({
      ...data,
      [key]: exception
        ? key === exception
          ? e.target.value
          : parseInt(e.target.value)
        : parseInt(e.target.value),
      remaining: parseInt(e.target.value)
        ? quantity - (consumed + disposed)
        : quantity,
    }));
  };
  const handleSubmit = async () => {
    setModalTitle(null);
    const building_id = document.querySelector("#building_id");
    const id = parseInt(building_id.value);

    const data = {
      feed_id: feedsData.feed,
      date: feedsData.date,
      building: id,
      medicine_id: feedsData.medicine,
      consumed: feedsData.consumed,
      disposed: feedsData.disposed,
      remaining: feedsData.remaining,
      remarks: feedsData.remarks,
      staff: JSON.parse(getCurrentUser()).user_id,
      log_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    try {
      const response = await addFeedsConsumption(data);
      console.log(response);
      if (response === 1) {
        toggleAlert({
          type: "success",
          title: "Feed Consumption Update Success",
          message: "You have successfully updated feeds consumption!",
          show: true,
        });
      } else {
        toggleAlert({
          type: "warning",
          title: "Feed Consumption Update Error",
          message:
            "There has been an error on updating feeds consumption. Please try again.",
          show: true,
        });
      }
      doRefresh((count) => (count = count + 1));
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getBuilding(building);
      setCurrentBuilding(response);
      const feeds = await getFeeds();
      setFeedsList(feeds);
      const feedQuantity = await getFeedQuantity();
      setFeedsQuantity(feedQuantity);
      setFeedsData({
        date: format(new Date(), "yyyy-MM-dd"),
        building_number: response.number,
        feed: 0,
        consumed: 0,
        disposed: 0,
        remaining: 0,
        remarks: "",
      });
    };
    setup();
  }, [building, refresh]);
  return (
    <>
      <div className="p-2 flex flex-col gap-2 w-full animate-fade">
        <div className="w-full">
          <p className="text-[1.2rem] font-semibold">Feeds Management</p>
          <form
            className="flex flex-col gap-2 bg-default p-2 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              setModalTitle("Confirmation");
            }}
          >
            <div className="flex flex-row gap-2">
              <div className="w-full flex flex-col gap-2 bg-default p-2 rounded-md disabled:bg-default-dark">
                {Object.keys(feedsData)
                  .splice(0, 4)
                  .map((feedsKey, index) => {
                    return feedsKey === "building_number" ? (
                      <>
                        <TextInput
                          type="hidden"
                          value={currentBuilding.id}
                          id="building_id"
                        />
                        <TextInput
                          id={feedsKey}
                          key={index}
                          withLabel={capitalize(toTitle(feedsKey)) + ":"}
                          value={currentBuilding.number}
                          type="number"
                          disabled={true}
                          orientation="row"
                          classes="p-1 items-center"
                          labelClasses="whitespace-nowrap w-full text-start"
                          inputClasses="w-full rounded px-2 disabled:bg-default-dark"
                        />
                      </>
                    ) : feedsKey === "feed" ? (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex gap-2 p-1 items-center">
                          <label
                            htmlFor={feedsKey}
                            className="whitespace-nowrap w-full text-start"
                          >
                            Feeds Type
                          </label>
                          <select
                            id={feedsKey}
                            className="w-full rounded px-2 outline-none border-none p-1"
                            onChange={(e) => {
                              setSelectedFeeds(e.target.value);
                              setFeedsData((current) => ({
                                ...current,
                                remaining: feedsQuantity.find(
                                  (feeds) =>
                                    feeds.feed_id === parseInt(e.target.value)
                                )
                                  ? feedsQuantity.find(
                                      (feeds) =>
                                        feeds.feed_id ===
                                        parseInt(e.target.value)
                                    ).remaining_quantity
                                  : 0,
                                feed: parseInt(e.target.value),
                              }));
                            }}
                          >
                            <option value="" selected={!selectedFeeds} disabled>
                              Select Feed Type
                            </option>
                            {feedsList.map((feeds, index) => {
                              return (
                                <option
                                  key={index}
                                  value={feeds.id}
                                  selected={feeds.id === feedsData[feedsKey]}
                                >
                                  {capitalize(feeds.name)}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                          <span className="w-1/2 p-1">Current Quantity:</span>
                          <span className="w-1/2 p-1 px-2">
                            {feedsData.feed
                              ? feedsQuantity.find(
                                  (feeds) => feeds.feed_id === feedsData.feed
                                )
                                ? feedsQuantity.find(
                                    (feeds) => feeds.feed_id === feedsData.feed
                                  ).remaining_quantity
                                : 0
                              : 0}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <TextInput
                        id={feedsKey}
                        key={index}
                        withLabel={capitalize(toTitle(feedsKey)) + ":"}
                        value={feedsData[feedsKey]}
                        type={feedsKey === "date" ? "date" : "number"}
                        orientation="row"
                        classes="p-1 items-center"
                        disabled={
                          !selectedFeeds ||
                          !feedsQuantity.find(
                            (feeds) => feeds.feed_id === feedsData.feed
                          )
                        }
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2 disabled:bg-default-dark"
                        onChange={(e) => handleInputChange(e, feedsKey, "date")}
                      />
                    );
                  })}
              </div>
              <div className="w-full flex flex-col gap-2 bg-default p-2 rounded-md">
                {Object.keys(feedsData)
                  .splice(4, 8)
                  .map((feedsKey, index) => {
                    return feedsKey === "remarks" ? (
                      <BigTextInput
                        id={feedsKey}
                        key={index}
                        withLabel={capitalize(toTitle(feedsKey)) + ":"}
                        value={feedsData[feedsKey]}
                        disabled={
                          !selectedFeeds ||
                          !feedsQuantity.find(
                            (feeds) => feeds.feed_id === feedsData.feed
                          )
                        }
                        orientation="row"
                        classes="p-1 items-start"
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2 h-full resize-none min-h-[100px] disabled:bg-default-dark"
                        onChange={(e) =>
                          setFeedsData((data) => ({
                            ...data,
                            [feedsKey]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <TextInput
                        id={feedsKey}
                        key={index}
                        withLabel={capitalize(toTitle(feedsKey)) + ":"}
                        value={feedsData[feedsKey]}
                        type="number"
                        disabled={
                          feedsKey === "remaining"
                            ? true
                            : !selectedFeeds ||
                              !feedsQuantity.find(
                                (feeds) => feeds.feed_id === feedsData.feed
                              )
                        }
                        orientation="row"
                        classes="p-1 items-center"
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2 disabled:bg-default-dark"
                        onChange={(e) => handleInputChange(e, feedsKey)}
                      />
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
          <p className="text-[1.2rem] font-semibold">Feeds Consumption Logs</p>
          <FeedsConsumptionTable />
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
