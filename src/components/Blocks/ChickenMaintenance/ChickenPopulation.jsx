import { useState } from "react";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { BigTextInput, Button, TextInput } from "../../Forms";
import { AiFillCalendar } from "react-icons/ai";
import classNames from "classnames";
import { Alert, Modal } from "../../Containers";
import { format } from "date-fns";
import ChickenMaintenanceTable from "../../ChickenMaintenanceTable";

export default function ChickenPopulation() {
  const [refresh, doRefresh] = useState(0);
  const [selectedChicken, setChicken] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [selectedFilter, selectDateFilter] = useState("all");
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const { capitalize, toTitle } = useFunction();
  const { updateChickenPopulation } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    selectDateFilter("all");
    setChicken(null);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
  };

  const handleUpdateChickenPopulation = async (e) => {
    e.preventDefault();
    const response = await updateChickenPopulation(selectedChicken);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Chicken Population Update Success",
        message: "Successfully updated the chicken population information.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Chicken Population Update Error",
        message:
          "There has been an error on updating chicken population information. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleInputChange = (e, chickenKey, exception = null) => {
    const population = parseInt(document.querySelector("#population").value);
    const mortality_count = parseInt(
      document.querySelector("#mortality").value
    );
    const missing_count = parseInt(document.querySelector("#missing").value);

    setChicken((data) => ({
      ...data,
      [chickenKey]: exception
        ? chickenKey === exception
          ? e.target.value
          : parseInt(e.target.value)
        : parseInt(e.target.value),
      remaining: e.target.value
        ? population - (mortality_count + missing_count)
        : population,
    }));
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
  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-start p-2 gap-2">
          <p>Date Filter: </p>
          {["range", "today", "yesterday", "this_week", "this_month"].map(
            (date, index) => {
              return (
                <Button
                  type="button"
                  key={index}
                  onClick={() => {
                    if (date === "range") {
                      if (
                        !Object.values(dateRange).every((item) => item !== "")
                      ) {
                        setModalTitle("date range picker");
                      }
                    }
                    selectDateFilter(date);
                  }}
                  value={
                    date === "range" ? (
                      <div className="flex items-center gap-1">
                        <AiFillCalendar />
                        <span>
                          {Object.values(dateRange).every(
                            (value) => value != ""
                          ) ? (
                            <>
                              {`${format(
                                new Date(dateRange.start_date),
                                "MMMM d, yyyy"
                              )} - ${format(
                                new Date(dateRange.end_date),
                                "MMMM d, yyyy"
                              )}`}
                            </>
                          ) : (
                            "Select Date Range"
                          )}
                        </span>
                      </div>
                    ) : (
                      capitalize(toTitle(date))
                    )
                  }
                  className={classNames(
                    "text-white p-1 px-2 rounded-sm text-[.9rem] transition-all whitespace-nowrap",
                    selectedFilter === date
                      ? "bg-main"
                      : "bg-gray-400 hover:bg-tertiary hover:text-main"
                  )}
                />
              );
            }
          )}
          {selectedFilter !== "all" && (
            <Button
              type="button"
              value="Reset Filter"
              onClick={() => {
                setRange({
                  start_date: "",
                  end_date: "",
                });
                selectDateFilter("all");
              }}
              className="text-white p-1 px-2 rounded-sm text-[.9rem] transition-all bg-gray-400 hover:bg-tertiary hover:text-main whitespace-nowrap"
            />
          )}
        </div>
        <div className="w-full overflow-x-auto shadow-md">
          <ChickenMaintenanceTable
            refresh={refresh}
            setModal={setModalTitle}
            setChicken={setChicken}
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
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          content={
            modalTitle !== "edit chicken information" ? (
              <>
                <form
                  onSubmit={handleDateChange}
                  className="flex flex-col gap-2"
                >
                  <span>Select the date range to display the records.</span>
                  <div className="flex flex-row gap-2">
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
            ) : (
              <>
                <form onSubmit={handleUpdateChickenPopulation}>
                  <div className="flex flex-col gap-2">
                    {Object.keys(selectedChicken).map((label, index) => {
                      return (
                        ![
                          "id",
                          "user_id",
                          "date_procured",
                          "date_logged",
                        ].includes(label) &&
                        (label === "remarks" ? (
                          <BigTextInput
                            key={index}
                            name={label}
                            id={label}
                            value={selectedChicken[label]}
                            withLabel={capitalize(toTitle(label))}
                            classes="p-1 items-center justify-between"
                            labelClasses="whitespace-nowrap text-start"
                            inputClasses="bg-default rounded px-2"
                            onChange={(e) => {
                              setChicken((current) => ({
                                ...current,
                                remarks: e.target.value,
                              }));
                            }}
                          />
                        ) : (
                          <TextInput
                            key={index}
                            name={label}
                            id={label}
                            type="number"
                            value={selectedChicken[label]}
                            disabled={["building_id", "remaining"].includes(
                              label
                            )}
                            withLabel={capitalize(toTitle(label))}
                            classes="p-1 items-center justify-between"
                            labelClasses="whitespace-nowrap text-start"
                            inputClasses="bg-default rounded px-2 disabled:text-gray-500"
                            onChange={(e) => handleInputChange(e, label)}
                          />
                        ))
                      );
                    })}
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="submit"
                        value="Save Changes"
                        className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                      />
                      <Button
                        value="Cancel"
                        onClick={() => handleClose()}
                        className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                      />
                    </div>
                  </div>
                </form>
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
