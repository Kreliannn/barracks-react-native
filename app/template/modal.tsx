import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function ModalTEAST() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="px-4 py-2 bg-emerald-600 rounded-lg"
      >
        <Text className="text-white font-semibold">Open Popup</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-72 p-5 bg-white rounded-xl shadow-lg">
            <Text className="text-lg font-bold text-stone-800 mb-4">
              This is a popup
            </Text>

            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="px-4 py-2 bg-red-600 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
