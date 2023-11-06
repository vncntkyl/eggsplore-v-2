/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import classNames from "classnames";
import { useFunction } from "../../../context/FunctionContext";
import { getYear } from "date-fns";
export default function MonthlyIncomeStatement() {
  const { retrieveIncome } = useAuth();
  const [income, setIncome] = useState(null);
  const { capitalize, toTitle } = useFunction();

  const Header = ({ title, className }) => {
    return (
      <span className={classNames(className, "font-semibold text-start")}>
        {title}
      </span>
    );
  };

  const IncomeData = ({ title, number, indent = false, className }) => {
    return (
      <div
        className={classNames(
          "flex flex-row justify-between",
          indent && "px-8",
          className
        )}
      >
        <Header title={title} />
        {formatCurrency(number)}
      </div>
    );
  };

  const formatCurrency = (number) => {
    return Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(number);
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveIncome();
      setIncome(response);
    };
    setup();
   
  }, []);
  return (
    income && (
      <>
        <p className="font-semibold pb-2">
          <span>
            {Intl.DateTimeFormat("en-PH", {
              month: "long",
            }).format(new Date())}
            {" " + getYear(new Date())}
          </span>{" "}
          <span>Summary</span>
        </p>
        <hr />
        <div className="py-2 pb-1 px-4 flex flex-col gap-3">
          <Header title={"Revenue"} />
          <IncomeData
            title={"Egg Sales"}
            indent
            number={income.total_egg_sales}
          />
          <hr />
          <Header title={"Cost of Goods Sold"} />
          <div className="flex flex-col gap-2">
            {[
              "feeds_and_medicine",
              "labor",
              "other_direct_cost",
              "total_cost_of_goods_sold",
            ].map((label, index) => {
              return label.includes("total") ? (
                <>
                  <hr />
                  <IncomeData
                    key={index}
                    indent
                    title={capitalize(toTitle(label))}
                    number={income[label]}
                  />
                </>
              ) : (
                <IncomeData
                  key={index}
                  indent
                  title={capitalize(toTitle(label))}
                  number={
                    label.includes("total")
                      ? income[label]
                      : income[`total_${label}`]
                  }
                />
              );
            })}
          </div>
          <hr />
          <IncomeData
            title={"Gross Profit"}
            number={income.total_gross_profit}
            className="pr-8"
          />
          <hr />
          <Header title={"Operating Expenses"} />
          <div className="flex flex-col gap-2">
            {[
              "transport_and_logistics",
              "rent_and_utilities",
              "insurance",
              "repairs_and_maintenance",
              "salaries_and_wages",
              "other_operating_expenses",
              "total_operating_cost",
            ].map((label, index) => {
              return label.includes("total") ? (
                <>
                  <hr />
                  <IncomeData
                    key={index}
                    indent
                    title={capitalize(toTitle(label))}
                    number={income[label]}
                  />
                </>
              ) : (
                <IncomeData
                  key={index}
                  indent
                  title={capitalize(toTitle(label))}
                  number={
                    label.includes("total")
                      ? income[label]
                      : income[`total_${label}`]
                  }
                />
              );
            })}
          </div>
          <hr />
          {["net_income_before_tax", "taxes", "net_income"].map(
            (label, index) => {
              return (
                <IncomeData
                  key={index}
                  title={capitalize(toTitle(label))}
                  indent
                  number={income[`total_${label}`]}
                  className={"pr-8"}
                />
              );
            }
          )}
        </div>
      </>
    )
  );
}
