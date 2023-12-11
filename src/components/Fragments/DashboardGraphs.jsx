/* eslint-disable react/prop-types */
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
  const [mortalityRate, setMortalityRate] = useState([]);
  const [mortality, setMortality] = useState([]);
  const [disposed, setDisposed] = useState([]);
  const [eggRatio, setEggRatio] = useState([]);
  const [mortalityView, setMortalityView] = useState("building");
  const {
    retrieveEggPerformance,
    retrieveEggClasifications,
    retrieveSalesOverview,
    getFeedsAndMedicineSummary,
    retrieveBestSellingEgg,
    retrieveBestSellingLocation,
    retrieveChickenMonthlyMortality,
    retrieveChickenMortality,
    retrieveFeedsDisposed,
    getMedicineDisposed,
    getBuilding,
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
      const feedsDisposed = await retrieveFeedsDisposed();
      const medicineDisposed = await getMedicineDisposed();
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
            color: generateHexWithSameBrightness(255, 0, 0),
          };
        })
      );
      setDisposed(
        feedsDisposed.map((item, index) => {
          const medicine = medicineDisposed[index];
          return {
            feeds:
              item.consumed > 0
                ? ((item.disposed / item.consumed) * 100).toFixed(2)
                : 0,
            medicine:
              medicine.intake > 0
                ? ((medicine.disposed / medicine.intake) * 100).toFixed(2)
                : 0,
            month: format(new Date(item.month), "MMM"),
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

      const eggSum = classifications.reduce((sum, egg) => {
        return (sum += parseInt(egg.egg_type_total_count));
      }, 0);
      setEggRatio(
        classifications
          .sort((a, b) => {
            return b.egg_type_total_count - a.egg_type_total_count;
          })
          .map((egg) => ({
            name: capitalize(toTitle(egg.egg_type_name)),
            percentage: parseFloat(
              parseFloat((egg.egg_type_total_count / eggSum) * 100).toFixed(2)
            ),
          }))
      );
    };
    setup();
  }, []);

  useEffect(() => {
    const setup = async () => {
      const mortalityResponse = await retrieveChickenMortality();
      const monthlyMortality = await retrieveChickenMonthlyMortality();

      const buildings = await getBuilding();
      const sum = mortalityResponse.reduce((total, item) => {
        return total + parseFloat(item.mortality_rate);
      }, 0);
      setMortality(sum / mortalityResponse.length);
      if (mortalityView === "building") {
        setMortalityRate(
          buildings.map((bldg) => {
            return {
              building_no: bldg.number,
              Count: mortalityResponse.find(
                (rate) => rate.number == bldg.number
              )
                ? mortalityResponse.find((rate) => rate.number == bldg.number)
                    .average_mortality_count
                : 0,
            };
          })
        );
      } else {
        setMortalityRate(
          monthlyMortality.map((month) => {
            return {
              count: month.mortality_count,
              month: format(new Date(month.month), "MMM"),
            };
          })
        );
      }
    };
    setup();
  }, [mortalityView]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="bg-white p-4 border">
          <p className="label">{`${label}`}</p>
          <p
            className="percentage"
            style={{ color: payload[0].fill }}
          >{`Percentage: ${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }

    return null;
  };
  const CustomDisposedTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="bg-white p-4 border">
          <p className="label">{`${label}`}</p>
          <p
            className="percentage"
            style={{ color: payload[0].fill }}
          >{`Feeds: ${payload[0].value}%`}</p>
          <p
            className="percentage"
            style={{ color: payload[1].fill }}
          >{`Medicine: ${payload[1].value}%`}</p>
        </div>
      );
    }

    return null;
  };
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
          <h1 className="font-semibold">
            Feeds and Medicine Disposal Analytics
          </h1>
          <ResponsiveContainer width={"100%"} height={400}>
            <BarChart data={disposed}>
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomDisposedTooltip />} />
              <Legend />
              <Bar dataKey="feeds" fill="#19d137" />
              <Bar dataKey="medicine" fill="#d9a81f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className=" bg-white p-2 w-full lg:w-1/2 flex flex-col gap-2 rounded shadow-md">
          <h1 className="font-semibold">Chicken Mortality Analysis</h1>
          <div className="border-b">
            <p className="flex flex-row gap-1 items-center relative group whitespace-nowrap">
              Mortality Rate
            </p>
            <span className="text-[2rem] font-semibold">
              {mortality.toString().substring(0, 7)}%
            </span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <label htmlFor="mortality">Show: </label>
            <select
              name=""
              id="mortality"
              onChange={(e) => setMortalityView(e.target.value)}
              className="outline-none border px-2 p-1 shadow"
            >
              <option value="building" selected={mortalityView === "building"}>
                Mortality Rate per Building
              </option>
              <option value="monthly" selected={mortalityView === "monthly"}>
                Monthly Mortality Rate
              </option>
            </select>
          </div>
          {mortalityView === "building" ? (
            <ResponsiveContainer width={"100%"} height={300}>
              <BarChart data={mortalityRate}>
                <XAxis dataKey="building_no" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Count" fill="#a22735" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width={"100%"} height={300}>
              <BarChart data={mortalityRate}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#a22735" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 justify-between w-full">
        <div className=" bg-white p-2 w-full lg:w-1/2 flex flex-col gap-2 rounded shadow-md">
          <h1 className="font-semibold">Egg Sizes</h1>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={eggRatio} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="percentage" fill="#29d8a7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className=" bg-white p-2 w-full lg:w-1/2 flex flex-col gap-2 rounded shadow-md">
          <h1 className="font-semibold">Best Selling Type of Egg</h1>
          <ResponsiveContainer width={"100%"} height={350}>
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
      </div>
      <div className=" bg-white p-2 w-full lg:w-full flex flex-col gap-2 rounded shadow-md">
        <h1 className="font-semibold">Top-Selling Location</h1>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={bestSellingLoc}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Times Bought" fill="#fa3446" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
