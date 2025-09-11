import Toast from "react-native-toast-message";

export const successAlert = (message : string) => {
    Toast.show({
      type: "success",
      text1: message,
      text2: "Successful!"
    });
}


export const errorAlert = (message : string) => {
    Toast.show({
      type: "error",
      text1: message,
      text2: "Error accour!"
    });
}