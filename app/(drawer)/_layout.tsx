import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="firstPage/index" options={{ title: "First Page" }} />
      <Drawer.Screen name="secondPage/index" options={{ title: "Second Page" }} />
    </Drawer>
  );
}
