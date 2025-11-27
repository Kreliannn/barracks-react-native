import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function TableTimer({ time }: { time: string }) {
  const [remaining, setRemaining] = useState("0 mins");

  useEffect(() => {
    const now = new Date();
    const start = new Date(now);
    const [hour, minutePart] = time.split(":");
    const [minute, period] = minutePart.split(" ");
    let hours = parseInt(hour);
    const minutes = parseInt(minute);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    start.setHours(hours, minutes, 0, 0);

    // End time = +3 mins (change to 10 * 60 * 1000 for 10 mins)
    const end = new Date(start.getTime() + 120 * 60 * 1000);

    const interval = setInterval(() => {
      const diff = end.getTime() - new Date().getTime();

      if (diff <= 0) {
        setRemaining("Time out");
        clearInterval(interval);
      } else {
        const mins = Math.ceil(diff / 60000);
        setRemaining(`${mins} min${mins !== 1 ? "s" : ""} left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <View className={`bg-green-500  rounded  px-1 py-1 ${remaining == "Time out" && "bg-red-500"}`}>
        <Text className="text-xs font-semibold text-white">
            <Text>{remaining}</Text>
        </Text>
   </View>
  );
}
