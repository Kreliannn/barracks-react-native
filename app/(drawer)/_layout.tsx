import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: "green",
        drawerInactiveTintColor: "gray", 
        drawerActiveBackgroundColor: "#e6ffe6", 
      }}
    >
      <Drawer.Screen name="dashboard/index" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="pos/index" options={{ title: "Order" }} />
      <Drawer.Screen name="orders/index" options={{ title: "Active Orders" }}  />
      <Drawer.Screen name="pending/index" options={{ title: "Pending Orders" }} />
      <Drawer.Screen name="transaction/index" options={{ title: "History" }} />
      <Drawer.Screen name="bluetooth/index" options={{ title: "Bluetooth" }} />
    </Drawer>
  );
}
