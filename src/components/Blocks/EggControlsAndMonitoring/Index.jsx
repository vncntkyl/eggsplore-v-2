import Inventory from "./Inventory";
import Procurement from "./Procurement";
import Production from "./Production";

export default function EggsControlAndMonitoring() {
  return (
    <div className="flex flex-col gap-4 xl:px-32">
      <Production />
      <Procurement />
      <Inventory />
    </div>
  );
}
