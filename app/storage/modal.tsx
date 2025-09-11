import { useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";

export default function ModalComponent() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button title="Open Popup" onPress={() => setVisible(true)} />

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Custom Popup</Text>
            <Text>You can put any content here 🎉</Text>
             <Text>You can put any content here 🎉</Text>
              <Text>You can put any content here 🎉</Text>
               <Text>You can put any content here 🎉</Text>
                <Text>You can put any content here 🎉</Text>
                 <Text>You can put any content here 🎉</Text>
                  <Text>You can put any content here 🎉</Text>
                   <Text>You can put any content here 🎉</Text>
                    <Text>You can put any content here 🎉</Text>
                     <Text>You can put any content here 🎉</Text>
                      <Text>You can put any content here 🎉</Text>
            <Button title="Close" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
   </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  dialog: { width: 300, padding: 20, backgroundColor: "white", borderRadius: 10 }
});
