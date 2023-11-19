import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { AiFillInfoCircle } from "react-icons/ai";
import { MdOpenInNew } from "react-icons/md";
import { format, getYear } from "date-fns";

export default function DashboardGraphs({ setEggClassifications, setModal }) {
  const [eggData, setEggData] = useState([]);
  const [eggSales, setEggSales] = useState([]);
  const [chickenMaintenance, setMaintenance] = useState([]);
  const [eggDataSummary, setSummary] = useState([]);
  const [eggTypesTotal, setEggTypesTotal] = useState([]);
  const [bestSellingEggs, setBestSellingEggs] = useState([]);
  const [bestSellingLoc, setBestSellingLoc] = useState([]);

  const {
    retrieveEggPerformance,
    retrieveEggClasifications,
    retrieveSalesOverview,
    getFeedsAndMedicineSummary,
    retrieveBestSellingEgg,
    retrieveBestSellingLocation,
  } = useAuth();
  const { capitalize, toTitle, generateHexWithSameBrightness } = useFunction();

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveEggPerformance();
      const classifications = await retrieveEggClasifications();
      setEggClassifications(classifications);
      const sales = await retrieveSalesOverview();
      const maintenanceCost = await getFeedsAndMedicineSummary();
      const bestSellingEgg = await retrieveBestSellingEgg();
      const bestSellingLocation = await retrieveBestSellingLocation();
      setMaintenance(
        maintenanceCost.map((item) => {
          return {
            date: format(
              new Date(`${item.date}-1-${getYear(new Date())}`),
              "MMM"
            ),
            "Total Cost": parseFloat(item.cost),
          };
        })
      );
      setEggSales(
        sales
          .sort((a, b) => a.date - b.date)
          .map((item) => {
            return {
              date: format(
                new Date(`${item.date}-1-${getYear(new Date())}`),
                "MMM"
              ),
              profit: parseFloat(item.profit),
            };
          })
      );
      setEggData(
        response
          .sort((a, b) => a.date - b.date)
          .map((item) => {
            return {
              date: parseInt(item.date),
              "Eggs Produced": parseInt(item.produced),
              "Eggs Sold": parseInt(item.sold),
            };
          })
      );
      setSummary(
        response.reduce(
          (sum, record) => {
            sum.produced += parseInt(record.produced);
            sum.sold += parseInt(record.sold);
            return sum;
          },
          { produced: 0, sold: 0 }
        )
      );
      setEggTypesTotal(
        classifications.reduce(
          (sum, value) => sum + parseInt(value.egg_type_total_count),
          0
        )
      );

      setBestSellingEggs(
        bestSellingEgg.map((type) => {
          return {
            name: capitalize(toTitle(type.item_name)),
            value: type.quantity,
            color: generateHexWithSameBrightness(255,0,0),
          };
        })
      );

      setBestSellingLoc(
        bestSellingLocation.map((location) => {
          return {
            name: location.location,
            "Times Bought": location.times_bought,
          };
        })
      );
    };
    setup();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 justify-between w-full">
        <div className=" bg-white p-2 w-full lg:w-1/2 flex flex-col gap-2 rounded shadow-md">
          <h1 className="font-semibold">Eggs Inventory Overview</h1>
          <div className="flex flex-row gap-2 overflow-auto">
            {Object.keys(eggDataSummary).map((key, index) => {
              return (
                <div
                  key={index}
                  className="border-b flex flex-col p-1 px-2 relative group"
                >
                  <span className="whitespace-nowrap">{`Egg Trays ${capitalize(
                    key
                  )}`}</span>
                  <span className="text-[2rem] font-semibold">
                    {eggDataSummary[key]}
                  </span>
                  <a
                    href={
                      key === "produced"
                        ? "/eggs_control_and_monitoring"
                        : "/sales/egg_sales"
                    }
                    className="absolute bottom-0 right-0 hidden group-hover:block animate-fade"
                  >
                    <MdOpenInNew />
                  </a>
                </div>
              );
            })}
            <div className="border-b flex flex-col p-1 px-2 relative group/link">
              <p className="flex flex-row gap-1 items-center relative group whitespace-nowrap">
                Egg Trays Available
                <span>
                  <AiFillInfoCircle />
                </span>
                <div className="absolute hidden animate-fade group-hover:block top-0 left-full bg-[#00000080] p-1 px-2 rounded text-white">
                  Number of segregated egg trays available for purchase
                </div>
              </p>
              <span className="text-[2rem] font-semibold">
                {eggTypesTotal}
                {/* {eggDataSummary.produced - eggDataSummary.sold} */}
              </span>
              <button
                onClick={() => {
                  setModal("egg classifications");
                }}
                className="absolute  bottom-0 right-0 hidden group-hover/link:block animate-fade"
              >
                <MdOpenInNew />
              </button>
            </div>
          </div>
          <ResponsiveContainer
            width={"100%"}
            height={350}
            className="overflow-auto"
          >
            <LineChart data={eggData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, "dataMax"]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Eggs Produced"
                stroke="#B95446"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="Eggs Sold"
                stroke="#306088"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col w-full lg:w-1/2 gap-2">
          <div className=" bg-white p-2 w-full flex flex-col gap-2 rounded shadow-md">
            <h1 className="font-semibold">Sales Performance</h1>
            <ResponsiveContainer width={"100%"} height={195}>
              <LineChart data={eggSales}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, "dataMax"]} />
                <Tooltip />
                <Legend />
                <Line dataKey="profit" stroke="#d43953" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className=" bg-white p-2 w-full flex flex-col gap-2 rounded shadow-md">
            <h1 className="font-semibold">Maintenance Cost</h1>
            <ResponsiveContainer width={"100%"} height={195}>
              <BarChart data={chickenMaintenance}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total Cost" fill="#f93446" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 justify-between w-full">
        <div className=" bg-white p-2 w-full lg:w-1/2 flex flex-col gap-2 rounded shadow-md">
          <h1 className="font-semibold">Best Selling Type of Egg</h1>
          <ResponsiveContainer width={"100%"} height={300}>
            <PieChart>
              <Pie
                data={bestSellingEggs}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                fill="#B95446"
              >
                {bestSellingEggs.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="top" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className=" bg-white p-2 w-full lg:w-1/2 flex flex-col gap-2 rounded shadow-md">
          <h1 className="font-semibold">Top-Selling Location</h1>
          <ResponsiveContainer width={"100%"} height={300}>
            <BarChart data={bestSellingLoc}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Times Bought" fill="#f93446" />
            </BarChart>
          </ResponsiveContainer>
          {console.log(bestSellingLoc)}
        </div>
      </div>
    </>
  );
}
