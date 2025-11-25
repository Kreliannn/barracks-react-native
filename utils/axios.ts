import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const local = "http://192.168.1.6:5000"
const live = "https://barracks-test-code.onrender.com"

const axiosInstance = axios.create({
  baseURL:  live, 
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
