/* eslint-disable react/prop-types */
import { AiFillCalendar } from "react-icons/ai";
import { Button } from "../Forms";
import { format } from "date-fns";
import { useFunction } from "../../context/FunctionContext";
import classNames from "classnames";

export default function DatePicker({
  dateRange,
  setModalTitle,
  selectDateFilter,
  selectedFilter,
  setRange,
  rangeAndMonthOnly = false,
}) {
  const { capitalize, toTitle } = useFunction();
  const options = rangeAndMonthOnly
    ? ["range", "this_month"]
    : ["range", "today", "yesterday", "this_week", "this_month"];
  return (
    <div className="w-full overflow-x-auto flex flex-row items-center justify-start gap-2">
      {options.map((date, index) => {
        return (
          <Button
            type="button"
            key={index}
            onClick={() => {
              if (date === "range") {
                if (!Object.values(dateRange).every((item) => item !== "")) {
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
                    {Object.values(dateRange).every((value) => value != "") ? (
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
      })}
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
  );
}
