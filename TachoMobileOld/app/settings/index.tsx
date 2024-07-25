import React from "react";
import TapNavigator from "@/components/TapNavigator";
import Notifications from "./Notifications";
import GeneralSettings from "./GeneralSettings";

const settingsRoutes = [
  {
    id: "1",
    name: "GeneralSettings",
    component: GeneralSettings,
    options: { title: "Ogólne" },
  },
  {
    id: "2",
    name: "Notifications",
    component: Notifications,
    options: { title: "Powiadomienia" },
  },
];

export default function Settings() {
  return <TapNavigator routes={settingsRoutes} />;
}
