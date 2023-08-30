/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useFunction } from "../../context/FunctionContext";
import { useAuth } from "../../context/authContext";
import { Button } from "../Forms";
import { AiOutlineEye } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";
import { format } from "date-fns";

export default function SalesInvoiceTable({
  setModal,
  refresh,
  filter = "all",
  setSalesInvoice,
  setSalesId,
}) {
  const [salesInvoiceLogs, setSalesInvoiceLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const { capitalize, toTitle } = useFunction();

  const { retrieveSalesInvoice } = useAuth();
  useEffect(() => {
    const setup = async () => {
      if (filter === "range") return;
      const response = await retrieveSalesInvoice(filter);
      setSalesInvoiceLogs(response);
      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, filter]);

  return !loading && salesInvoiceLogs.length > 0 ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {Object.keys(salesInvoiceLogs[0])
            .filter(
              (key) =>
                ![
                  "sales_id",
                  "log_date",
                  "update",
                  "egg_procurement_id",
                  "delivery_id",
                ].includes(key)
            )
            .map((header, key) => {
              return (
                <th key={key} className="p-2 bg-main text-white sticky top-0">
                  {capitalize(toTitle(header))}
                </th>
              );
            })}
          <th className="p-2 bg-main text-white sticky top-0">Actions</th>
        </tr>
      </thead>
      <tbody>
        {salesInvoiceLogs.map((logs, index) => {
          return (
            <tr key={index}>
              <td className="p-2" align="center">
                {format(new Date(logs.date), "MMM dd, yyyy")}
              </td>
              <td className="p-2" align="center">
                {logs.invoice_no}
              </td>
              <td className="p-2" align="center">
                {logs.customer}
              </td>
              <td className="p-2" align="center">
                {logs.location}
              </td>
              <td className="p-2" align="center">
                {Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(logs.amount)}
              </td>
              <td>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    onClick={() => {
                      setSalesInvoice(logs);
                      setSalesId(logs.sales_id);
                      setModal("view sales invoice");
                    }}
                    className="bg-yellow p-1 rounded"
                    value={<AiOutlineEye className="text-white" />}
                  />
                  <Button
                    onClick={() => {
                      setSalesInvoice(logs);
                      setSalesId(logs.sales_id);
                      setModal("edit sales invoice");
                    }}
                    className="bg-yellow p-1 rounded"
                    value={<HiPencilAlt className="text-white" />}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No procurement information found</>
  );
}
