import React from "react";

import {
  ChickenManagement,
  EggProduction,
  EggSegregation,
  FeedsManagement,
  MedicineManagement,
} from "./StaffForms";

export default function StaffRoutes({ panel, building }) {
  switch (panel) {
    case "Egg Production":
      return <EggProduction building={building} />;
    case "Chicken Management":
      return <ChickenManagement building={building} />;
    case "Medicine Management":
      return <MedicineManagement building={building} />;
    case "Feeds Management":
      return <FeedsManagement building={building} />;
    case "Egg Segregation":
      return <EggSegregation />;
  }
}
