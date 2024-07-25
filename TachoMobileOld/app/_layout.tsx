import { createDrawerNavigator } from "@react-navigation/drawer";
import Settings from "./settings";
import Tachograph from "./tachograph";
import Index from "./index";
import { Colors } from "@/constants/Colors";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.navigationBar },
        drawerActiveBackgroundColor: "none",
        drawerActiveTintColor: Colors.navigationText,
      }}
    >
      <Drawer.Screen
        name="index"
        component={Index}
        options={{ drawerLabel: "Wybierz plik DDD", title: "Pliki" }}
      />
      <Drawer.Screen
        name="tachograph/index"
        component={Tachograph}
        options={{ drawerLabel: "Tachograf", title: "Tachograf" }}
      />
      <Drawer.Screen
        name="settings/index"
        component={Settings}
        options={{ drawerLabel: "Ustawienia", title: "Ustawienia" }}
      />
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  return (
    <>
      <DrawerNavigator />
    </>
  );
}
