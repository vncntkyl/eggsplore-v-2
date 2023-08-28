import { useState } from "react";
import { Button, TextInput } from "../../Forms";
import { AiFillPrinter } from "react-icons/ai";
import { format } from "date-fns";
// import CurrentDateTime from "../../Fragments/CurrentDateTime";
import Modal from "../../Containers/Modal";
import DashboardCards from "../../Fragments/DashboardCards";
import DashboardGraphs from "../../Fragments/DashboardGraphs";
import { useFunction } from "../../../context/FunctionContext";
export default function Dashboard() {
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const { capitalize, toTitle } = useFunction();

  const handleClose = () => {
    setModalTitle(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <p className="font-semibold">
          {/* As of <CurrentDateTime /> */}
          {format(new Date(), "MMMM dd, yyyy")}
        </p>
        <Button
          onClick={() => setModalTitle("generate report")}
          value={
            <div className="flex items-center gap-1">
              <AiFillPrinter />
              <span>Generate Report</span>
            </div>
          }
          className={
            "bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
          }
        />
      </div>
      {/* CARDS */}
      <DashboardCards />
      {/* GRAPHS */}
      <DashboardGraphs />
      {modalTitle && (
        <Modal
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          className="min-w-[550px]"
          content={
            <>
              <form>
                <form onSubmit={handleSubmit} className="w-full">
                  <div>
                    <TextInput
                      id="name"
                      withLabel="Name (optional)"
                      classes="p-1 items-center justify-between"
                      labelClasses="whitespace-nowrap text-start w-1/2"
                      inputClasses="bg-default rounded px-2 w-1/2"
                    />
                    <div className="flex flex-row gap-4 items-center">
                      <label className="w-full text-start">Select Date</label>
                      {Object.keys(dateRange).map((label, index) => {
                        return (
                          <TextInput
                            key={index}
                            name={label}
                            type="date"
                            classes="p-1 items-center justify-between"
                            labelClasses="whitespace-nowrap text-start"
                            inputClasses="bg-default rounded px-2"
                          />
                        );
                      })}
                    </div>
                    <div className="flex p-1 items-center justify-between gap-4">
                      <label htmlFor="category" className="text-start w-1/2">Category</label>
                      <select id="category" className="bg-default rounded p-1 px-2 w-full">
                        <option value="" disabled selected>select category</option>
                        <option value="egg production">Egg Production</option>
                        <option value="maintenance cost">Maintenance Cost</option>
                        <option value="egg sales performance">Egg Sales Performance</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value="Create"
                      className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                    />
                    <Button
                      value="Cancel"
                      onClick={() => handleClose()}
                      className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                    />
                  </div>
                </form>
              </form>
            </>
          }
        />
      )}
    </>
  );
}
