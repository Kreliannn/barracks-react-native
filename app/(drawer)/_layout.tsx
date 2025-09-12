import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="dashboard/index" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="transaction/index" options={{ title: "History" }} />
      <Drawer.Screen name="orders/index" options={{ title: "Active Orders" }} />
    </Drawer>
  );
}
