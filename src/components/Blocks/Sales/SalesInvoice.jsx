import { useEffect, useState } from "react";
import DatePicker from "../../Fragments/DatePicker";
import { Alert, Modal } from "../../Containers";
import { FaFileInvoice } from "react-icons/fa";
import { Button, TextInput } from "../../Forms";
import { format } from "date-fns";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import SalesItemsTable from "../../Tables/SalesItemsTable";
import classNames from "classnames";
import SalesInvoiceTable from "../../Tables/SalesInvoiceTable";

export default function SalesInvoice() {
  const [refresh, doRefresh] = useState(0);
  const [selectedFilter, selectDateFilter] = useState("all");
  const [modalTitle, setModalTitle] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const [salesInvoice, setSalesInvoice] = useState({
    date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    invoice_no: "",
    customer: "",
    location: "",
    amount: 0,
  });
  const [salesId, setSalesId] = useState(null);
  const [items, setItems] = useState([
    { item: "", quantity: 1, price: 0, total: 0 },
  ]);
  const [eggs, setEggs] = useState([]);
  const [selectedEggs, setSelectedEggs] = useState([]);
  const [selectedInvoice, setInvoice] = useState(null);
  const [salesItems, setSalesItems] = useState(null);
  const [locations, setLocations] = useState([]);
  const { capitalize, toTitle } = useFunction();
  const {
    retrieveLatestInvoice,
    retrieveEggClasifications,
    insertSalesInvoice,
    retrieveItems,
    getLocation,
  } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    setInvoice(null);
    setSalesItems(null);
    selectDateFilter("all");
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setSalesInvoice({
      date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      invoice_no: "",
      customer: "",
      location: "",
      amount: 0,
    });
    setItems([{ item: "", quantity: 1, price: 0, total: 0 }]);
    setSelectedEggs([]);
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
    const data = { ...salesInvoice, items: items };
    data.date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await insertSalesInvoice(data);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Invoice Creation Success",
        message: "Successfully created new invoice.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Invoice Creation Error",
        message:
          "There has been an error on creating new invoice. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
  };

  const handleItemChange = (e, key, max = null) => {
    const value = e.target.value;
    const id = e.target.id;
    const updatedItems = [...items];
    switch (id) {
      case "item":
        updatedItems[key][id] = value;
        break;
      case "quantity":
        updatedItems[key][id] = parseInt(value);
        break;
      case "price":
      case "total":
        updatedItems[key][id] = parseFloat(value);
        break;
    }
    if (id === "price" || id === "quantity") {
      if (isNaN(updatedItems[key].price) || isNaN(updatedItems[key].quantity))
        return;
      const product = parseFloat(
        updatedItems[key].price * updatedItems[key].quantity
      );
      updatedItems[key].total = product;
      const totalSum = items.reduce((sum, item) => sum + item.total, 0);
      setSalesInvoice((current) => {
        return {
          ...current,
          amount: totalSum,
        };
      });
    }
    if (updatedItems[key].quantity <= max) {
      setItems(updatedItems);
    }
  };
  const deleteItem = (key, eggType) => {
    const eggs = [...selectedEggs];
    eggs.splice(eggs.indexOf(eggType), 1);
    setSelectedEggs(eggs);
    const updatedItems = [...items];
    updatedItems.splice(key, 1);
    setItems(updatedItems);
  };

  useEffect(() => {
    const setup = async () => {
      const eggtypes = await retrieveEggClasifications();
      setEggs(eggtypes);
      const locations = await getLocation();
      setLocations(locations);
      const itemsData = await retrieveItems(salesId);
      setSalesItems(itemsData);
      const response = await retrieveLatestInvoice();
      let newInvoice = "";
      const currentInvoice = response.invoice_no;
      if (currentInvoice) {
        const invoice = currentInvoice.split("-");
        if (format(new Date(), "yyMMdd") !== invoice[0].substring(3)) {
          console.log("creating new id...");
          newInvoice = "INV" + format(new Date(), "yyMMdd") + "-01";
        } else {
          let invoice_count = parseInt(invoice[1]);
          invoice_count += 1;
          newInvoice = [
            invoice[0],
            invoice_count.toString().padStart(2, 0),
          ].join("-");
        }
      } else {
        newInvoice = "INV" + format(new Date(), "yyMMdd") + "-01";
      }
      setSalesInvoice((current) => ({ ...current, invoice_no: newInvoice }));
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, salesId]);
  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-start p-2 gap-2">
          <p className="whitespace-nowrap">Date Filter: </p>
          <DatePicker
            dateRange={dateRange}
            setModalTitle={setModalTitle}
            selectDateFilter={selectDateFilter}
            selectedFilter={selectedFilter}
            setRange={setRange}
            rangeAndMonthOnly
          />
          <Button
            onClick={() => setModalTitle("create sales invoice")}
            value={
              <div className="flex items-center gap-1 px-1">
                <FaFileInvoice />
                <span className="whitespace-nowrap">Create Sales Invoice</span>
              </div>
            }
            className={
              "bg-main text-white p-1 px-2 rounded-full text-[1rem] transition-all hover:bg-tertiary hover:text-main"
            }
          />
        </div>
        <div className="w-full px-1">
          <div className="max-h-[300px] overflow-hidden rounded-md overflow-y-auto shadow-md">
            <SalesInvoiceTable
              setModal={setModalTitle}
              refresh={refresh}
              setSalesInvoice={setInvoice}
              setSalesId={setSalesId}
              filter={
                selectedFilter === "range" && dateRange.end_date !== ""
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
          onClose={() => handleClose()}
          content={
            modalTitle === "date range picker" ? (
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
            ) : modalTitle === "view sales invoice" ? (
              <div>
                <div>
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    <p className="font-semibold text-start whitespace-nowrap flex gap-2">
                      Invoice Date:
                      <span className="font-normal">
                        {format(
                          new Date(selectedInvoice.date),
                          "MMMM dd, yyyy"
                        )}
                      </span>
                    </p>
                    <p className="font-semibold text-start whitespace-nowrap flex gap-2">
                      Invoice No.:
                      <span className="font-normal">
                        {selectedInvoice.invoice_no}
                      </span>
                    </p>
                    <p className="font-semibold text-start whitespace-nowrap flex gap-2">
                      Customer Name:
                      <span className="font-normal">
                        {selectedInvoice.customer}
                      </span>
                    </p>
                    <p className="font-semibold text-start whitespace-nowrap flex gap-2">
                      Location:
                      <span className="font-normal">
                        {selectedInvoice.location}
                      </span>
                    </p>
                  </div>
                </div>
                <hr />
                <div className="pt-2">
                  {salesItems && (
                    <SalesItemsTable
                      items={salesItems}
                      eggList={eggs}
                      itemLength={salesItems.length}
                      selectedEggs={selectedEggs}
                      viewOnly
                    />
                  )}
                </div>
                <hr />
                <div className="flex gap-2 justify-end pr-11 pt-2">
                  <p className="font-semibold">Total Amount:</p>
                  <span>
                    {Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(selectedInvoice.amount)}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <form
                  onSubmit={
                    modalTitle === "create sales invoice"
                      ? handleSubmit
                      : handleUpdate
                  }
                  className="flex flex-col gap-2 min-w-[400px]"
                >
                  <div>
                    {Object.keys(salesInvoice)
                      .filter((key) => key !== "amount")
                      .map((label, index) => {
                        return label === "location" ? (
                          <div
                            key={index}
                            className="p-1 flex gap-2 items-center justify-between"
                          >
                            <label
                              htmlFor={label}
                              className="whitespace-nowrap text-start w-1/2"
                            >
                              Location
                            </label>
                            <input
                              type="text"
                              list="locations"
                              id={label}
                              value={salesInvoice[label]}
                              onChange={(e) => {
                                setSalesInvoice((current) => {
                                  return {
                                    ...current,
                                    [label]: e.target.value,
                                  };
                                });
                              }}
                              className="outline-none border-none p-1 bg-default rounded px-2 w-full disabled:text-gray-500"
                            />
                            <datalist id="locations">
                              {locations.map((location, index) => {
                                return (
                                  <option
                                    value={location.location_name}
                                    key={index}
                                  />
                                );
                              })}
                            </datalist>
                          </div>
                        ) : (
                          <TextInput
                            key={index}
                            name={label}
                            type={label === "date" ? "date" : "text"}
                            id={label}
                            disabled={["invoice_no", "date"].includes(label)}
                            withLabel={capitalize(toTitle(label))}
                            classes="p-1 items-center justify-between"
                            labelClasses="whitespace-nowrap text-start w-1/2"
                            inputClasses="bg-default rounded px-2 w-1/2 disabled:text-gray-500"
                            onChange={(e) => {
                              setSalesInvoice((current) => {
                                return {
                                  ...current,
                                  [label]: e.target.value,
                                };
                              });
                            }}
                            value={
                              label === "date"
                                ? format(
                                    new Date(salesInvoice[label]),
                                    "yyyy-MM-dd"
                                  )
                                : salesInvoice[label]
                            }
                          />
                        );
                      })}
                  </div>
                  <hr />
                  <div>
                    <SalesItemsTable
                      items={items}
                      handleItemChange={handleItemChange}
                      eggList={eggs}
                      deleteItem={deleteItem}
                      itemLength={items.length}
                      selectedEggs={selectedEggs}
                      setSelectedEggs={setSelectedEggs}
                    />
                  </div>
                  <hr />
                  <div className="grid grid-cols-[repeat(5,1fr)] items-center px-1 pr-5 gap-1">
                    {items.length < eggs.length && (
                      <Button
                        value="Add Item"
                        onClick={() =>
                          setItems((current) => {
                            return [
                              ...current,
                              { item: "", quantity: 1, price: 0, total: 0 },
                            ];
                          })
                        }
                        className="bg-tertiary p-1 px-2 rounded-md flex justify-center"
                      />
                    )}
                    <p className="col-[4] text-end font-semibold">
                      Total Amount:
                    </p>
                    <span className={classNames("col-[5] text-end")}>
                      {Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(salesInvoice.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value={
                        modalTitle === "create sales invoice"
                          ? "Submit"
                          : "Update"
                      }
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
