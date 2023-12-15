import { useEffect, useState } from "react";
import { useFunction } from "../../../context/FunctionContext";
import { Button, TextInput } from "../../Forms";
import classNames from "classnames";
import { format } from "date-fns";
import { AiFillCalendar, AiFillPlusCircle } from "react-icons/ai";
import { Alert, Modal } from "../../Containers";
import { useAuth } from "../../../context/authContext";
import FeedsInventoryTable from "../../Tables/FeedsInventoryTable";
import DatePicker from "../../Fragments/DatePicker";

export default function FeedsInventory() {
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [feeds, setFeeds] = useState({
    feeds: 0,
    quantity: 0,
    amount: 0,
    supplier: "",
    date_received: format(new Date(), "yyyy-MM-dd"),
  });
  const [feedsList, setFeedsList] = useState([]);
  const [selectedFilter, selectDateFilter] = useState("all");
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });

  const { capitalize, toTitle } = useFunction();
  const { getFeeds, addFeedsInventory, updateFeedsInventory } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    selectDateFilter("all");
    setFeeds({
      feeds: 0,
      quantity: 0,
      amount: "00.00",
      supplier: "",
      date_received: "",
    });
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
  };
  const handleDateChange = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const startDate = formData.get("start_date");
    const endDate = formData.get("end_date");

    setRange({
      start_date: startDate,
      end_date: endDate,
    });
    setModalTitle(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFeeds = { ...feeds };
    newFeeds.log_date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await addFeedsInventory(newFeeds);
    console.log(response);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Feeds Inventory Success",
        message: "Successfully added new feeds inventory.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Feeds Inventory Error",
        message:
          "There has been an error on adding new feeds inventory. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  const feedsInventory = () => {
    if (!feeds) return;

    const feeds_information = feedsList.find(
      (feed) => feed.feeds_id === feeds.feeds
    );
    const inventory_details = { ...feeds };
    const feedsInventory = {
      feeds_name: feeds_information.feeds_name,
      dosage_instructions: feeds_information.dosage_instructions,
      indications_for_use: feeds_information.usage_indication,
      quantity: inventory_details.quantity,
      supplier: inventory_details.supplier,
      amount: inventory_details.amount,
      date_received: inventory_details.date_received,
    };
    return feedsInventory;
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateFeeds = { ...feeds };
    updateFeeds.log_date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    updateFeeds.updateInventory = true;
    const response = await updateFeedsInventory(updateFeeds);
    console.log(response);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Feeds Inventory Success",
        message: "Successfully updated feeds inventory.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Feeds Inventory Error",
        message:
          "There has been an error on updating feeds inventory. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  useEffect(() => {
    const setup = async () => {
      const feedsList = await getFeeds();
      setFeedsList(feedsList);
    };
    const realtimeData = setInterval(setup, 5000);
    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, selectDateFilter]);
  return (
    <>
      <div>
        <div className="w-full flex flex-col md:flex-row-reverse md:items-center justify-end gap-2 p-1">
          <Button
            onClick={() => setModalTitle("add feeds")}
            value={
              <div className="flex items-center gap-1">
                <AiFillPlusCircle />
                <span>Add Feeds</span>
              </div>
            }
            className={
              "whitespace-nowrap w-fit bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
            }
          />
          <div className="w-full overflow-x-auto flex flex-row items-center justify-start p-2 gap-2">
            <p className="whitespace-nowrap">Date Filter: </p>
            <DatePicker
              dateRange={dateRange}
              setModalTitle={setModalTitle}
              selectDateFilter={selectDateFilter}
              selectedFilter={selectedFilter}
              setRange={setRange}
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto shadow-md">
          <FeedsInventoryTable
            refresh={refresh}
            setFeeds={setFeeds}
            setModal={setModalTitle}
            filter={
              selectedFilter === "range" && dateRange.end_date != ""
                ? dateRange
                : selectedFilter
            }
          />
        </div>
      </div>
      {modalTitle && (
        <Modal
          className={modalTitle === "view feeds information" ? "max-w-lg" : "w-[95%] max-w-lg"}
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          content={
            modalTitle === "date range picker" ? (
              <>
                <form
                  onSubmit={handleDateChange}
                  className="flex flex-col gap-2"
                >
                  <span>Select the date range to display the records.</span>
                  <div className="flex flex-col md:flex-row md:justify-center gap-2">
                    {Object.keys(dateRange).map((label, index) => {
                      return (
                        <TextInput
                          key={index}
                          name={label}
                          type="date"
                          id={label}
                          withLabel={capitalize(toTitle(label))}
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap text-start"
                          inputClasses="bg-default rounded px-2"
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value="Show Records"
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
            ) : ["add feeds", "edit feeds information"].includes(modalTitle) ? (
              <>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={
                    modalTitle === "add feeds" ? handleSubmit : handleUpdate
                  }
                >
                  {Object.keys(feeds)
                    .filter((key) => key !== "update" && key !== "id")
                    .map((label, index) => {
                      return label === "feeds" ? (
                        <div
                          key={index}
                          className="flex gap-2 p-1 items-center"
                        >
                          <label
                            htmlFor={label}
                            className="whitespace-nowrap text-start"
                          >
                            Feeds
                          </label>
                          <select
                          required
                            id={label}
                            className="w-full rounded px-2 outline-none border-none p-1 bg-default"
                            onChange={(e) =>
                              setFeeds((current) => ({
                                ...current,
                                feeds: parseInt(e.target.value),
                              }))
                            }
                          >
                            <option value="" selected disabled>
                              Select Feeds
                            </option>
                            {feedsList.map((med, index) => {
                              return (
                                <option
                                  key={index}
                                  value={med.id}
                                  selected={med.id === feeds[label]}
                                >
                                  {capitalize(med.name)}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ) : (
                        <TextInput
                          key={index}
                          name={label}
                          type={
                            label.includes("date")
                              ? "date"
                              : label === "supplier" || label === "amount"
                              ? "text"
                              : "number"
                          }
                          id={label}
                          important
                          withLabel={capitalize(toTitle(label))}
                          value={feeds[label]}
                          onChange={(e) => {
                            setFeeds((current) => ({
                              ...current,
                              [label]:
                                label === "supplier" ||
                                label.includes("date") ||
                                label === "amount"
                                  ? e.target.value
                                  : parseInt(e.target.value),
                            }));
                          }}
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap text-start"
                          inputClasses="bg-default rounded px-2"
                        />
                      );
                    })}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value={modalTitle === "add feeds" ? "Add" : "Update"}
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
            ) : (
              <>
                <div className="text-left flex flex-col gap-2">
                  {Object.keys(feedsInventory()).map((label, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-row justify-between"
                      >
                        <span className="w-1/2 font-semibold text-gray-800">
                          {capitalize(toTitle(label))}
                        </span>
                        <span className="w-1/2">
                          {label === "amount"
                            ? Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "PHP",
                              }).format(feedsInventory()[label])
                            : label.includes("date")
                            ? format(
                                new Date(feedsInventory()[label]),
                                "MMMM d, yyyy"
                              )
                            : feedsInventory()[label]}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      value="Edit"
                      onClick={() => setModalTitle("edit feeds information")}
                      className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                    />
                    <Button
                      value="Cancel"
                      onClick={() => handleClose()}
                      className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                    />
                  </div>
                </div>
              </>
            )
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
