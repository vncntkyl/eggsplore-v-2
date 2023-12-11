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
  viewOnly = false,
  edit = false,
}) {
  const { capitalize, toTitle } = useFunction();
  return (
    items && (
      <table className="w-full">
        <thead>
          <tr>
            {["item", "price", "quantity", "total"].map((header, index) => {
              return (
                <th key={index} align="justify">
                  {capitalize(toTitle(header))}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((label, key) => {
            return (
              <tr key={key}>
                {viewOnly ? (
                  <>
                    <td align="justify" className="p-1">
                      {capitalize(label.item_name)}
                    </td>
                    <td align="justify" className="p-1">
                      {Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(label.price)}
                    </td>
                    <td align="justify" className="p-1">
                      {label.quantity}
                    </td>
                    <td align="justify" className="p-1">
                      {Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(label.total_amount)}
                    </td>
                  </>
                ) : (
                  <>
                    <td align="center">
                      <div className="flex flex-col gap-2 w-[150px]">
                        <select
                          id="item"
                          className="bg-default rounded p-1 px-2 w-full disabled:text-gray-500"
                          onChange={(e) => {
                            const egg = label.item || label.item_name;
                            if (selectedEggs.includes(egg)) {
                              const eggs = [...selectedEggs];
                              eggs.splice(eggs.indexOf(egg), 1);
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
                          <option
                            value=""
                            selected={edit ? !label.item_name : !label.item}
                            disabled
                          >
                            Select Egg Type
                          </option>
                          {eggList.map((type, index) => {
                            return (
                              <option
                                key={index}
                                value={type.egg_type_name}
                                disabled={selectedEggs.includes(
                                  type.egg_type_name
                                )}
                                selected={
                                  edit
                                    ? type.egg_type_name === label.item_name
                                    : type.egg_type_name === label.item
                                }
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
                        step={0.01}
                        disabled={edit ? !label.item_name : !label.item}
                        classes="p-1 items-center justify-center w-[100px]"
                        inputClasses="bg-default rounded px-2  text-end disabled:text-gray-500"
                        value={label.price}
                        onChange={(e) => handleItemChange(e, key)}
                      />
                    </td>
                    <td align="center">
                      <TextInput
                        name="quantity"
                        type="number"
                        id="quantity"
                        disabled={edit ? !label.item_name : !label.item}
                        max={
                          edit
                            ? label.item_name &&
                              eggList.find(
                                (egg) => egg.egg_type_name === label.item_name
                              ).egg_type_total_count
                            : label.item &&
                              eggList.find(
                                (egg) => egg.egg_type_name === label.item
                              ).egg_type_total_count
                        }
                        classes="p-1 items-center justify-center w-[100px]"
                        inputClasses="bg-default rounded px-2 text-end  disabled:text-gray-500"
                        value={label.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            e,
                            key,
                            edit
                              ? label.item_name &&
                                  eggList.find(
                                    (egg) =>
                                      egg.egg_type_name === label.item_name
                                  ).egg_type_total_count
                              : label.item_name &&
                                  eggList.find(
                                    (egg) => egg.egg_type_name === label.item
                                  ).egg_type_total_count
                          )
                        }
                      />
                    </td>
                    <td align="center">
                      <TextInput
                        name="total"
                        type="number"
                        id="total"
                        step={0.01}
                        disabled
                        classes="p-1 items-center justify-center w-[100px]"
                        inputClasses="bg-default rounded px-2 text-end disabled:text-gray-500"
                        value={edit ? label.total_amount : label.total}
                        onChange={(e) => handleItemChange(e, key)}
                      />
                    </td>
                    {itemLength > 1 && (
                      <td align="center">
                        <Button
                          className="bg-red-light p-1 rounded"
                          value={<FaMinusSquare className="text-white" />}
                          onClick={() => {
                            if (edit) {
                              deleteItem(key, label.item_name);
                            } else {
                              deleteItem(key, label.item);
                            }
                          }}
                        />
                      </td>
                    )}
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    )
  );
}
