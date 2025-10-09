import useUserStore from "@/store/user.store";
import { errorAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [username, setUsername] = useState("krel");
  const [password, setPassword] = useState("123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  

 
const { setUser } = useUserStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      axiosInstance.post("/login", data),
    onSuccess: async (res) => {
      const { fullname, role, branch, token } = res.data;

      if(role != "cashier"){
        setIsLoading(false)
        errorAlert("cashier account only")
        return 
      } 

      await AsyncStorage.setItem("token", token);
      setUser({ fullname, role, branch });

      setTimeout(() => {
        setIsLoading(false);    
        setPassword("")
      }, 3000)

      router.push("/(drawer)/dashboard" as any); 
    },
    onError: () => {
      errorAlert("User not found");
      setIsLoading(false);
    },
  });

  const handleLogin = () => {
    mutation.mutate({ username, password });
    setIsLoading(true);
  };
 

 

  return (
    <View className="flex-1 bg-stone-50 justify-center items-center px-6">
      

      {/* Form */}
      <View className="w-full max-w-md">
        
        {/* Username */}
        <Text className="text-xs font-medium text-green-800 uppercase mb-2">Username</Text>
        <View className="flex-row items-center border-b border-gray-200 mb-4">

       
              
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            className="flex-1 py-2 text-sm"
          />
        </View>

        {/* Password */}
        <Text className="text-xs font-medium text-green-800 uppercase mb-2">Password</Text>
        <View className="flex-row items-center border-b border-gray-200 mb-6">
         
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Enter password"
            className="flex-1 py-2 text-sm"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
           
          </TouchableOpacity>
        </View>

        {/* Button */}
        <TouchableOpacity
          className={`w-full py-3 rounded-lg ${isLoading ? "bg-green-700/60" : "bg-green-800"}`}
          disabled={isLoading}
          onPress={handleLogin}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-medium text-sm">Sign in</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View className="mt-6 items-center">
          <View className="h-px bg-gray-200 w-full mb-4" />
          <Text className="text-xs text-gray-400">Secure login powered by your credentials</Text>
        </View>
      </View>
    </View>
  );
}
