import { useEffect, useState } from "react";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { Button, TextInput } from "../../Forms";
import { AiFillCalendar } from "react-icons/ai";
import classNames from "classnames";
import { Modal } from "../../Containers";
import { format } from "date-fns";
import ChickenMaintenanceTable from "../../ChickenMaintenanceTable";

export default function ChickenPopulation() {
  const [refresh, doRefresh] = useState(0);
  const [population, populate] = useState([]);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [selectedFilter, selectDateFilter] = useState("today");
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const { capitalize, getFullName, toTitle } = useFunction();
  const { retrieveProcurement, updateUser } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
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
    handleClose();
  };

  useEffect(() => {
    const setup = async () => {
      const filter =
        selectedFilter === "range" && dateRange.end_date != ""
          ? dateRange
          : selectedFilter;
      const response = await retrieveProcurement("ep_chicken", filter);
      populate(response);
    };

    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);
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
                      setModalTitle("date range picker");
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
                    "text-white p-1 px-2 rounded-sm text-[.9rem] transition-all",
                    selectedFilter === date
                      ? "bg-main"
                      : "bg-gray-400 hover:bg-tertiary hover:text-main"
                  )}
                />
              );
            }
          )}
        </div>
        <div className="w-full overflow-x-auto shadow-md">
          <ChickenMaintenanceTable
            refresh={refresh}
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
              <>blabla</>
            )
          }
        />
      )}
    </>
  );
}
