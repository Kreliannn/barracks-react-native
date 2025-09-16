import { useBluetooth } from "@/provider/bluetoothProvider";
import { getRequestInterface } from "@/types/request.type";
import axiosInstance from "@/utils/axios";
import PrintQr from "@/utils/print";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PrintQrComponent() {
  const [visible, setVisible] = useState(false);
  const [request, setRequest] = useState<getRequestInterface[]>([]);

  const {connectedDevice} = useBluetooth()

  const { data } = useQuery({
    queryKey: ["request"],
    queryFn: () => axiosInstance.get("/request/branch"),
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data?.data) {
      const res: getRequestInterface[] = data?.data;
      const filteredData = res.filter((item) => item.status == "to ship");
      filteredData.reverse()
      setRequest(filteredData);
    }
  }, [data]);

  const handlePrint = (data : getRequestInterface) => {
    PrintQr({id : data._id, branch : data.branch, manager : data.manager, date :data.date}) 
  }

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="px-4 py-2 bg-emerald-600 rounded-lg"
      >
        <Text className="text-white font-semibold">Print Qr Code</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[90%] max-h-[80%] p-5 bg-white rounded-xl shadow-lg">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="absolute top-3 right-3"
            >
              <Text className="text-lg font-bold text-gray-700">✕</Text>
            </TouchableOpacity>

            <Text className="text-lg font-bold mb-4 text-center">
              Requests to Ship
            </Text>

            <ScrollView>
              {request.map((item) => (
                <View
                  key={item._id}
                  className="flex-row items-center justify-between border-b border-gray-300 py-3 px-2"
                >
                  <View>
                    <Text className="font-semibold">
                      Branch: <Text className="font-normal">{item.branch}</Text>
                    </Text>
                    <Text>
                      Request by: <Text className="font-normal">{item.manager}</Text>
                    </Text>
                    <Text>Date: {item.date}</Text>
                  </View>

                  <TouchableOpacity
                    disabled={!connectedDevice}
                    onPress={() => handlePrint(item)}
                    className={`bg-emerald-600 px-4 py-2 rounded-lg ${!connectedDevice && "bg-gray-600"}`}
                  >
                    <Text className="text-white font-semibold">Print QR</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
