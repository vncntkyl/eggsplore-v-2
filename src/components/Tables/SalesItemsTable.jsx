/* eslint-disable react/prop-types */
import { FaMinusSquare } from "react-icons/fa";
import { useFunction } from "../../context/FunctionContext";
import { Button, TextInput } from "../Forms";

export default function SalesItemsTable({
  items = [],
  handleItemChange,
  eggList = [],
  deleteItem,
  itemLength = 1,
  selectedEggs,
  setSelectedEggs,
}) {
  const { capitalize, toTitle } = useFunction();
  return (
    <table className="w-full">
      <thead>
        <tr>
          {["item", "price", "quantity", "total"].map((header, index) => {
            return <th key={index}>{capitalize(toTitle(header))}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {items.map((label, key) => {
          return (
            <tr key={key}>
              <td align="center">
                <div className="flex flex-col gap-2 w-[150px]">
                  <select
                    id="item"
                    className="bg-default rounded p-1 px-2 w-full disabled:text-gray-500"
                    onChange={(e) => {
                      if (selectedEggs.includes(label.item)) {
                        const eggs = [...selectedEggs];
                        eggs.splice(eggs.indexOf(label.item),1);
                        eggs.push(e.target.value);
                        setSelectedEggs(eggs);
                      } else {
                        setSelectedEggs((current) => {
                          return [...current, e.target.value];
                        });
                      }
                      handleItemChange(e, key);
                    }}
                  >
                    <option value="" selected={!label.item} disabled>
                      Select Egg Type
                    </option>
                    {eggList.map((type, index) => {
                      return (
                        <option
                          key={index}
                          value={type.egg_type_name}
                          disabled={selectedEggs.includes(type.egg_type_name)}
                          selected={type.egg_type_name === label.item}
                        >
                          {capitalize(type.egg_type_name)}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </td>
              <td align="center">
                <TextInput
                  name="price"
                  type="number"
                  id="price"
                  step={0.25}
                  classes="p-1 items-center justify-center"
                  inputClasses="bg-default rounded px-2 w-[100px] text-end"
                  value={label.price}
                  onChange={(e) => handleItemChange(e, key)}
                />
              </td>
              <td align="center">
                <TextInput
                  name="quantity"
                  type="number"
                  id="quantity"
                  classes="p-1 items-center justify-center"
                  inputClasses="bg-default rounded px-2 w-[100px]"
                  value={label.quantity}
                  onChange={(e) => handleItemChange(e, key)}
                />
              </td>
              <td align="center">
                <TextInput
                  name="total"
                  type="number"
                  id="total"
                  step={0.25}
                  disabled
                  classes="p-1 items-center justify-center"
                  inputClasses="bg-default rounded px-2 w-[100px] text-end disabled:text-gray-500"
                  value={label.total}
                  onChange={(e) => handleItemChange(e, key)}
                />
              </td>
              {itemLength > 1 && (
                <td align="center">
                  <Button
                    className="bg-red-light p-1 rounded"
                    value={<FaMinusSquare className="text-white" />}
                    onClick={() => deleteItem(key,label.item)}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
