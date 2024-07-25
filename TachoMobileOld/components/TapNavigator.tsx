import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

interface TapNavigatorProps {
  routes: {
    id: string;
    name: string;
    component: React.ComponentType<any>;
    options?: any;
  }[];
}

export default function TapNavigator(props: TapNavigatorProps) {
  return (
    <Tab.Navigator>
      {props.routes.map((route) => (
        <Tab.Screen
          key={route.id}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Tab.Navigator>
  );
}
