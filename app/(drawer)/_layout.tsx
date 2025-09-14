import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
      
      
        drawerActiveTintColor: "green", // active item color
        drawerInactiveTintColor: "gray", // inactive item color
        drawerActiveBackgroundColor: "#e6ffe6", // highlight background
      }}
    >
      <Drawer.Screen name="dashboard/index" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="pos/index" options={{ title: "Order" }} />
      <Drawer.Screen name="orders/index" options={{ title: "Active Orders" }} />
      <Drawer.Screen name="transaction/index" options={{ title: "History" }} />
      <Drawer.Screen name="bluetooth/index" options={{ title: "Bluetooth" }} />
    </Drawer>
  );
}
