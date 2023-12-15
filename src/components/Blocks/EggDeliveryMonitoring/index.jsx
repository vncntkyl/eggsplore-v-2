import { useEffect, useState } from "react";
import { Alert, Modal } from "../../Containers";
import { useFunction } from "../../../context/FunctionContext";
import DatePicker from "../../Fragments/DatePicker";
import { Button, TextInput } from "../../Forms";
import { AiFillPlusCircle } from "react-icons/ai";
import EggsDeliveryMonitoringTable from "../../Tables/EggsDeliveryMonitoringTable";
import DeliveryForm from "../../Forms/DeliveryForm";
import { useAuth } from "../../../context/authContext";
import { format } from "date-fns";

export default function EggDeliveryMonitoring() {
  const [modalTitle, setModalTitle] = useState(null);
  const [selectedFilter, selectDateFilter] = useState("all");
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const [salesInvoices, setSalesInvoices] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [deliveryInformation, setDeliveryInformation] = useState({
    location: "",
    departure_date: "",
    target_arrival: "",
    driver_name: "",
    assistant_driver_name: "",
    driver_expense: "",
    assistant_driver_expense: "",
    parking_expense: "",
    food_expense: "",
    gas_expense: "",
    toll_gate_expense: "",
    tenor_and_load_expense: "",
  });
  const [refresh, doRefresh] = useState(0);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [disable, toggleDisable] = useState(false);

  const {
    insertDeliveryInformation,
    updateDeliveryStatus,
    retrieveSalesInvoiceForUpdate,
    getInvoicesForDelivery,
    retrieveSalesInvoiceForDispatch,
    updateDeliveryInformation,
  } = useAuth();
  const { capitalize, toTitle } = useFunction();

  const handleClose = () => {
    setModalTitle(null);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setDeliveryInformation({
      location: "",
      departure_date: "",
      target_arrival: "",
      driver_name: "",
      assistant_driver_name: "",
      driver_expense: "",
      assistant_driver_expense: "",
      parking_expense: "",
      food_expense: "",
      gas_expense: "",
      toll_gate_expense: "",
      tenor_and_load_expense: "",
    });
    setSelectedInvoices([]);
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
  const handleUpdateDeliveryStatus = async (e) => {
    e.preventDefault();
    toggleDisable((prev) => !prev);
    setModalTitle(null);
    let response;
    const arrivalDate = document.querySelector("#arrival_date");
    const arrivalStatus = document.querySelector("#arrival_status");
    if (arrivalStatus.checked) {
      //run cancellation of status
      response = await updateDeliveryStatus(
        "status",
        "cancelled",
        deliveryInformation.dispatch_id
      );
    } else {
      if (!arrivalDate.value) return;
      //run updating of arrival date
      response = await updateDeliveryStatus(
        "actual_arrival",
        arrivalDate.value,
        deliveryInformation.dispatch_id,
        deliveryInformation.target_arrival
      );
    }
    console.log(response);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Status Update Success",
        message:
          "You have successfully updated the delivery status of Delivery #" +
          deliveryInformation.dispatch_id,
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Status Update Error",
        message:
          "There has been an error on updating delivery status. Please try again.",
        show: true,
      });
    }
    toggleDisable((prev) => !prev);
    doRefresh((count) => (count = count + 1));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    toggleDisable((prev) => !prev);
    setModalTitle(null);

    const response = await updateDeliveryInformation(
      deliveryInformation,
      selectedInvoices
    );
    console.log(response);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Update Delivery Information Success",
        message: "You have successfull updated delivery information.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Update Delivery Information Error",
        message:
          "There has been an error on updating delivery information. Please try again.",
        show: true,
      });
    }
    toggleDisable((prev) => !prev);
    doRefresh((count) => (count = count + 1));
  };
  const handleRegistration = async (e) => {
    e.preventDefault();
    toggleDisable((prev) => !prev);
    setModalTitle(null);

    const delivery = {
      ...deliveryInformation,
      log_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    if (selectedInvoices.length === 0) {
      window.alert("Please select a sales invoice to proceed.");
      return;
    }
    const response = await insertDeliveryInformation(
      delivery,
      selectedInvoices.map((invoice) => invoice.sales_id)
    );
    console.log(response);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Add Delivery Information Success",
        message: "You have successfull added new delivery information.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Add Delivery Information Error",
        message:
          "There has been an error on adding delivery information. Please try again.",
        show: true,
      });
    }
    toggleDisable((prev) => !prev);

    doRefresh((count) => (count = count + 1));
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveSalesInvoiceForDispatch();
      setSalesInvoices(response);
    };
    setup();
  }, [refresh, modalTitle]);

  useEffect(() => {
    const setup = async () => {
      const invoices = await retrieveSalesInvoiceForUpdate(
        deliveryInformation.delivery_id
      );
      const response = await getInvoicesForDelivery(
        deliveryInformation.delivery_id
      );
      console.log(invoices);
      setSalesInvoices(invoices);
      setSelectedInvoices(
        response.map((sales) => ({
          sales_id: sales.sales_id,
          invoice_no: sales.invoice_no,
        }))
      );
    };
    if (
      modalTitle === "edit delivery information" ||
      modalTitle === "view delivery information"
    ) {
      setup();
    }
  }, [modalTitle]);
  return (
    <>
      <div className="flex flex-col gap-4 items-end 3xl:px-32">
        <div className="bg-white w-full rounded-md flex flex-col gap-2 pb-2">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between p-2 gap-2">
            <div className="flex flex-row items-center gap-2 w-full ">
              <p className="whitespace-nowrap">Date Filter: </p>
              <DatePicker
                dateRange={dateRange}
                setModalTitle={setModalTitle}
                selectDateFilter={selectDateFilter}
                selectedFilter={selectedFilter}
                setRange={setRange}
              />
            </div>
            <Button
              onClick={() => setModalTitle("add delivery information")}
              value={
                <div className="flex items-center gap-1 px-1 w-fit">
                  <AiFillPlusCircle />
                  <span className="whitespace-nowrap">
                    Add Delivery Information
                  </span>
                </div>
              }
              className={
                "bg-main text-white p-1 px-2 rounded-full text-[1rem] transition-all hover:bg-tertiary hover:text-main"
              }
            />
          </div>
          <div className="w-full px-2">
            <EggsDeliveryMonitoringTable
              refresh={refresh}
              setModal={setModalTitle}
              setDelivery={setDeliveryInformation}
              filter={
                selectedFilter === "range" && dateRange.end_date != ""
                  ? dateRange
                  : selectedFilter
              }
            />
          </div>
        </div>
      </div>
      {modalTitle && (
        <Modal
          title={capitalize(modalTitle)}
          className="w-[95%] max-w-[750px] overflow-x-auto"
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
            ) : modalTitle === "add delivery information" ||
              modalTitle === "edit delivery information" ||
              modalTitle === "view delivery information" ? (
              <DeliveryForm
                handleClose={handleClose}
                handleRegistration={handleRegistration}
                handleUpdate={handleUpdate}
                setDeliveryInformation={setDeliveryInformation}
                deliveryInformation={deliveryInformation}
                modalTitle={modalTitle}
                setSelectedInvoices={setSelectedInvoices}
                selectedInvoices={selectedInvoices}
                salesInvoices={salesInvoices}
              />
            ) : modalTitle.includes("update delivery status") ? (
              <form
                onSubmit={handleUpdateDeliveryStatus}
                className="flex flex-col gap-2"
              >
                <span>Update the arrival date of the delivery below.</span>
                <div className="flex flex-col gap-2 p-2 items-start">
                  <TextInput
                    name="arrival_date"
                    type="date"
                    id="arrival_date"
                    withLabel="Arrival Date"
                    value={
                      deliveryInformation.actual_arrival
                        ? format(
                            new Date(deliveryInformation.actual_arrival),
                            "yyyy-MM-dd"
                          )
                        : format(new Date(), "yyyy-MM-dd")
                    }
                    onChange={(e) => {
                      setDeliveryInformation((current) => {
                        return {
                          ...current,
                          actual_arrival: e.target.value,
                        };
                      });
                    }}
                    classes="p-1 items-center justify-between w-full"
                    labelClasses="whitespace-nowrap w-1/2 text-start"
                    inputClasses="bg-default rounded px-2 w-1/2"
                  />
                  <div className="flex flex-row items-center gap-2">
                    <input type="checkbox" id="arrival_status" value="cancel" />
                    <label htmlFor="arrival_status" className="text-[.8rem]">
                      Cancel Delivery
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="submit"
                    value="Proceed"
                    className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                    disabled={disable}
                  />
                  <Button
                    value="Cancel"
                    onClick={() => handleClose()}
                    className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                  />
                </div>
              </form>
            ) : (
              <></>
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
