/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { format } from "date-fns";
import { Button } from "../Forms";
import { HiPencilAlt } from "react-icons/hi";
import { AiOutlineEye } from "react-icons/ai";

export default function MedicineInventoryTable({
  refresh,
  filter = "all",
  setModal,
  setMedicine,
}) {
  const { getCurrentUser, getMedicine, getMedicineInventory } = useAuth();
  const { capitalize, toTitle } = useFunction();
  const [medicineInventory, setMedicineInventory] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      const user = JSON.parse(getCurrentUser());
      setCurrentUser(user);
      const response = await getMedicineInventory(filter);
      setMedicineInventory(
        response.map((item) => ({
          id: item.id,
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          amount: item.amount,
          supplier: item.supplier,
          date_received: item.date_received,
          expiration_date: item.expiration_date,
          log_date: item.log_date,
        }))
      );
      const medicineList = await getMedicine();
      setMedicineList(medicineList);
      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 5000);
    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, filter]);

  return !loading && medicineInventory.length > 0 ? (
    <table className="w-full rounded-md shadow-md overflow-hidden bg-white">
      <thead>
        <tr className="bg-main text-white">
          {Object.keys(medicineInventory[0])
            .filter((k) => k !== "id" && k !== "user_id")
            .map((item, index) => {
              return (
                item !== "log_date" && (
                  <th key={index} className="whitespace-nowrap p-2">
                    {item === "medicine_id"
                      ? "Medicine"
                      : capitalize(toTitle(item))}
                  </th>
                )
              );
            })}
          {currentUser.user_type === "admin" && (
            <th className="whitespace-nowrap p-2">Action</th>
          )}
        </tr>
      </thead>
      <tbody>
        {medicineInventory.map((item, index) => {
          return (
            <tr key={index} align="center" className="hover:bg-default">
              <td className="p-2 whitespace-nowrap">
                {
                  medicineList.find(
                    (medicine) => medicine.medicine_id == item.medicine_id
                  ).medicine_name
                }
              </td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "PHP",
                }).format(item.amount)}
              </td>
              <td className="p-2">{item.supplier}</td>
              <td className="p-2">
                {format(new Date(item.date_received), "MMM d, yyyy")}
              </td>
              <td className="p-2">
                {format(new Date(item.expiration_date), "MMM d, yyyy")}
              </td>
              <td align="center" className="p-2">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    onClick={() => {
                      setMedicine({
                        id: item.id,
                        medicine: item.medicine_id,
                        quantity: item.quantity,
                        amount: item.amount,
                        supplier: item.supplier,
                        date_received: item.date_received,
                        expiration_date: item.expiration_date,
                      });
                      setModal("view medicine information");
                    }}
                    className="bg-yellow p-1 rounded"
                    value={<AiOutlineEye className="text-white" />}
                  />
                  <Button
                    onClick={() => {
                      setMedicine({
                        id: item.id,
                        medicine: item.medicine_id,
                        quantity: item.quantity,
                        amount: item.amount,
                        supplier: item.supplier,
                        date_received: item.date_received,
                        expiration_date: item.expiration_date,
                        update: true,
                      });
                      setModal("edit medicine information");
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
    <>No medicine inventory found.</>
  );
}
