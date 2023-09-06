import { useState } from "react";
import { Button, TextInput } from "../../Forms";
import { AiFillPrinter } from "react-icons/ai";
import { format } from "date-fns";
// import CurrentDateTime from "../../Fragments/CurrentDateTime";
import Modal from "../../Containers/Modal";
import DashboardCards from "../../Fragments/DashboardCards";
import DashboardGraphs from "../../Fragments/DashboardGraphs";
import { useFunction } from "../../../context/FunctionContext";
import { CSVLink } from "react-csv";
import { useAuth } from "../../../context/authContext";
import GenerateReport from "../../Forms/GenerateReport";
export default function Dashboard() {
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const [reportData, setReportData] = useState(null);
  const [reportConfig, setReportConfig] = useState({
    filename: "",
    category: "",
    type: "",
  });
  const [additionalData, setAdditionalData] = useState([]);
  const [eggClassifications, setEggClassifications] = useState([]);
  const { capitalize, toTitle } = useFunction();
  const {
    getFeedsReport,
    getMedicineReport,
    getSegregatedEggs,
    getMaintenanceReport,
    retrieveEggSalesReport,
    retrieveSalesSummaryReport,
    retrieveEggProductionReport,
    retrieveSalesLocationReport,
  } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    setReportConfig({
      filename: "",
      category: "",
      type: "",
    });
    setReportData(null);
    setRange({ start_date: "", end_date: "" });
    setAdditionalData([]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(reportConfig, reportData);
  };

  const formatCurrency = (amount) => {
    const peso = Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
    return "PHP " + peso.substring(1);
  };

  const handleDataChange = async (e) => {
    setAdditionalData([]);
    switch (e.target.value) {
      case "egg production":
        {
          const productionResponse = await retrieveEggProductionReport(
            dateRange.start_date,
            dateRange.end_date
          );
          const segregationResponse = await getSegregatedEggs(
            dateRange.start_date,
            dateRange.end_date
          );
          setReportData([
            Object.keys(productionResponse[0]).map((key) => {
              return capitalize(toTitle(key));
            }),
            ...productionResponse.map(
              ({ building_no, produced_eggs, defect_eggs }) => [
                building_no,
                produced_eggs,
                defect_eggs,
              ]
            ),
          ]);

          let total = 0;
          Object.keys(segregationResponse).forEach((key) => {
            if (key !== "eggs") {
              total += parseInt(segregationResponse[key]) || 0;
            }
          });

          segregationResponse.unsegregated = parseInt(
            segregationResponse.eggs - total
          );
          setAdditionalData((current) => {
            return [
              ...current,
              {
                headers: ["Egg Type", "Quantity"],
                title: "Egg Trays Segregation",
                record: [
                  ["Unsorted Trays", segregationResponse.unsegregated],
                  ["No Weight", segregationResponse.no_weight],
                  ["Pewee", segregationResponse.pewee],
                  ["Pullet", segregationResponse.pullet],
                  ["Brown", segregationResponse.brown],
                  ["Small", segregationResponse.small],
                  ["Medium", segregationResponse.medium],
                  ["Large", segregationResponse.large],
                  ["Extra Large", segregationResponse.extra_large],
                  ["Jumbo", segregationResponse.jumbo],
                  ["Crack", segregationResponse.crack],
                  ["Soft Shell", segregationResponse.soft_shell],
                ],
              },
            ];
          });
        }
        break;
      case "maintenance cost":
        {
          const maintenanceResponse = await getMaintenanceReport(
            dateRange.start_date,
            dateRange.end_date
          );

          const medicineReport = await getMedicineReport(
            dateRange.start_date,
            dateRange.end_date
          );
          const feedsReport = await getFeedsReport(
            dateRange.start_date,
            dateRange.end_date
          );
          setAdditionalData(() => {
            return [
              {
                headers: ["Month", "Medicine Name", "Amount"],
                title: "Medicine Expenses Breakdown",
                record: medicineReport.map(
                  (
                    { month, medicine_name, medicine_expense },
                    index,
                    array
                  ) => {
                    const previousMonth =
                      index > 0
                        ? format(
                            new Date(`${array[index - 1].month}-01`),
                            "MMMM"
                          )
                        : null;
                    const currentMonth = format(
                      new Date(`${month}-01`),
                      "MMMM"
                    );

                    if (currentMonth === previousMonth) {
                      return [
                        "",
                        capitalize(medicine_name),
                        formatCurrency(medicine_expense),
                      ];
                    } else {
                      return [
                        currentMonth,
                        capitalize(medicine_name),
                        formatCurrency(medicine_expense),
                      ];
                    }
                  }
                ),
              },
              {
                headers: ["Month", "Feeds Name", "Amount"],
                title: "Feeds Expenses Breakdown",
                record: feedsReport.map(
                  ({ month, name, feeds_expense }, index, array) => {
                    const previousMonth =
                      index > 0
                        ? format(
                            new Date(`${array[index - 1].month}-01`),
                            "MMMM"
                          )
                        : null;
                    const currentMonth = format(
                      new Date(`${month}-01`),
                      "MMMM"
                    );

                    if (currentMonth === previousMonth) {
                      return [
                        "",
                        capitalize(name),
                        formatCurrency(feeds_expense),
                      ];
                    } else {
                      return [
                        currentMonth,
                        capitalize(name),
                        formatCurrency(feeds_expense),
                      ];
                    }
                  }
                ),
              },
            ];
          });
          const maintenanceReport = maintenanceResponse.map((data) => {
            return {
              month: format(new Date(data.month), "MMMM"),
              medicine_expense: formatCurrency(data.medicine_expense),
              feeds_expense: formatCurrency(data.feeds_expense),
            };
          });
          setReportData([
            Object.keys(maintenanceReport[0]).map((key) => {
              return capitalize(toTitle(key));
            }),
            ...maintenanceReport.map(
              ({ month, medicine_expense, feeds_expense }) => [
                month,
                medicine_expense,
                feeds_expense,
              ]
            ),
          ]);
        }
        break;
      case "egg sales performance":
        {
          const salesResponse = await retrieveSalesSummaryReport(
            dateRange.start_date,
            dateRange.end_date
          );
          const salesLocationReport = await retrieveSalesLocationReport(
            dateRange.start_date,
            dateRange.end_date
          );
          const eggSalesReport = await retrieveEggSalesReport(
            dateRange.start_date,
            dateRange.end_date
          );

          const salesReport = salesResponse.map((data) => {
            return {
              month: format(new Date(`${data.year}-${data.month}-01`), "MMMM"),
              revenue: formatCurrency(data.revenue),
            };
          });
          setAdditionalData(() => {
            return [
              {
                headers: ["Egg Category", "Quantity", "Amount"],
                title: "Egg Category Sales Breakdown",
                record: eggSalesReport.map(
                  ({ egg_type_name, total_quantity, total_amount }) => [
                    capitalize(toTitle(egg_type_name)),
                    total_quantity,
                    formatCurrency(total_amount),
                  ]
                ),
              },
              {
                headers: ["Location", "Amount"],
                title: "Regional Sales Breakdown",
                record: salesLocationReport.map(({ location, amount }) => [
                  capitalize(location),
                  formatCurrency(amount),
                ]),
              },
            ];
          });
          setReportData([
            Object.keys(salesReport[0]).map((key) => {
              return capitalize(key);
            }),
            ...salesReport.map(({ month, revenue }) => [month, revenue]),
          ]);
        }
        break;
    }
    setReportConfig((current) => {
      return {
        ...current,
        category: e.target.value,
      };
    });
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
      <DashboardGraphs
        setModal={setModalTitle}
        setEggClassifications={setEggClassifications}
      />
      {modalTitle && (
        <Modal
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          className={
            modalTitle === "egg classifications"
              ? "min-w-[300px]"
              : "min-w-[550px]"
          }
          content={
            modalTitle === "egg classifications" ? (
              <>
                <table className="w-full rounded-md overflow-hidden">
                  <thead>
                    <tr className=" bg-main p-2 text-white">
                      <th className="p-1">Type</th>
                      <th className="p-1">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eggClassifications.map((type, index) => {
                      return (
                        <tr key={index} className="odd:bg-default">
                          <td className="p-1 px-2">
                            {capitalize(type.egg_type_name)}
                          </td>
                          <td className="p-1 px-2">
                            {type.egg_type_total_count}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="pb-2">
                    <TextInput
                      id="name"
                      withLabel="Name (optional)"
                      value={reportConfig.filename}
                      onChange={(e) => {
                        setReportConfig((current) => {
                          return {
                            ...current,
                            filename: e.target.value,
                          };
                        });
                      }}
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
                            value={dateRange[label]}
                            classes="p-1 items-center justify-between"
                            labelClasses="whitespace-nowrap text-start"
                            inputClasses="bg-default rounded px-2"
                            onChange={(e) => {
                              setReportConfig((current) => {
                                return {
                                  ...current,
                                  category: "",
                                };
                              });
                              setRange((current) => {
                                return { ...current, [label]: e.target.value };
                              });
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex p-1 items-center justify-between gap-4">
                      <label htmlFor="category" className="text-start w-1/2">
                        Category
                      </label>
                      <select
                        id="category"
                        disabled={
                          Object.values(dateRange).filter((item) => item !== "")
                            .length !== 2
                        }
                        className="bg-default rounded p-1 px-2 w-full"
                        onChange={(e) => handleDataChange(e)}
                      >
                        <option
                          value=""
                          disabled
                          selected={reportConfig.category === ""}
                        >
                          select category
                        </option>
                        {[
                          "egg production",
                          "maintenance cost",
                          "egg sales performance",
                        ].map((opt, index) => {
                          return (
                            <option
                              key={index}
                              value={opt}
                              selected={reportConfig.category === opt}
                            >
                              {capitalize(opt)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex p-1 items-center justify-between gap-4">
                      <label htmlFor="type" className="text-start w-1/2">
                        Export as
                      </label>
                      <select
                        id="type"
                        className="bg-default rounded p-1 px-2 w-full"
                        onChange={(e) => {
                          setReportConfig((current) => {
                            return {
                              ...current,
                              type: e.target.value,
                            };
                          });
                        }}
                      >
                        <option
                          value=""
                          disabled
                          selected={reportConfig.type === ""}
                        >
                          select type
                        </option>
                        <option
                          value="csv"
                          selected={reportConfig.category === "csv"}
                        >
                          CSV
                        </option>
                        <option
                          value="pdf"
                          selected={reportConfig.category === "pdf"}
                        >
                          PDF
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {reportConfig.category !== "" &&
                    reportConfig.type === "csv" &&
                    reportData ? (
                      <CSVLink
                        filename={`${
                          reportConfig.filename !== ""
                            ? reportConfig.filename
                            : capitalize(reportConfig.category)
                        }.csv`}
                        data={reportData}
                        className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                      >
                        Export
                      </CSVLink>
                    ) : reportConfig.category !== "" &&
                      reportConfig.type === "pdf" &&
                      reportData ? (
                      <GenerateReport
                        closeModal={handleClose}
                        dateCoverage={dateRange}
                        additionalData={additionalData}
                        tableHeader={reportData[0]}
                        record={reportData.slice(1)}
                        fileTitle={capitalize(reportConfig.category)}
                        fileName={`${
                          reportConfig.filename !== ""
                            ? reportConfig.filename
                            : capitalize(toTitle(reportConfig.category))
                        }`}
                        title="Export"
                        className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                      />
                    ) : (
                      <Button
                        value="Export"
                        disabled
                        className="p-1 px-2 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                      />
                    )}
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
    </>
  );
}
