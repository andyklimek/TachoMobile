import React from "react";
import TapNavigator from "@/components/TapNavigator";
import Overview from "./Overview";
import Job from "./Job";
import Rest from "./Rest";

const tachographRoutes = [
  {
    id: "1",
    name: "Overview",
    component: Overview,
    options: { title: "Przegląd" },
  },
  { id: "2", name: "Rest", component: Rest, options: { title: "Odpoczynek" } },
  { id: "3", name: "Job", component: Job, options: { title: "Praca" } },
];

export default function Tachograph() {
  return <TapNavigator routes={tachographRoutes} />;
}
