import PrintQrComponent from "@/components/dashboard/printQr";
import useUserStore from "@/store/user.store";
import { changeInterface, getChangeInterface } from "@/types/change.type";
import { errorAlert, successAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { getDate } from "@/utils/customFunction";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Index() {
  const { user, clearUser } = useUserStore();

  const [change, setChange] = useState(0)
  const [shift, setShift] = useState<getChangeInterface | null>(null)

  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

 

  const { data : changeData, refetch } = useQuery({
    queryKey: ["change"],
    queryFn: () => axiosInstance.get("/branch/change/" + getDate(time)),
  });

  useEffect(() => {
    if (changeData?.data){
      if(changeData?.data == "no change"){
        successAlert("enter change to start shift")
      } else {
        setChange(changeData?.data.change);
        setShift(changeData?.data)
      } 
    } 
  }, [changeData]);



  const mutation = useMutation({
    mutationFn: (data: changeInterface) =>
      axiosInstance.post("/branch/change", data),
    onSuccess: (response) => {
      successAlert("set change")
      refetch()
    },
    onError: () => errorAlert("Error"),
  });

  const mutationEndShift = useMutation({
    mutationFn: (data: {id : string, end : string}) =>
      axiosInstance.patch("/branch/endShift", data),
    onSuccess: (response) => {
      successAlert("shift ended")
    },
    onError: () => errorAlert("Error"),
  });



  const changeHandler = () => {
    if(change == 0 || !user) return errorAlert("empty value")
    mutation.mutate({
      date : getDate(time),
      change : change,
      branch : user.branch,
      start : `${new Date().toLocaleDateString('en-CA')} (${time})`,
      end  : "ongoing"
    })
  }

  const endShiftHandler = () => {
    if(!shift) return  errorAlert("shift not found")
    mutationEndShift.mutate({
      id : shift._id,
      end : `${new Date().toLocaleDateString('en-CA')} (${time})`
    })
  }



  const router = useRouter()

  const [dashboardData, setDashboardData] = useState({
    activeTatble: 0,
    salesToday: 0,
  });

  const { data } = useQuery({
    queryKey: ["cashier"],
    queryFn: () => axiosInstance.get("/branch/cashier/" +  getDate(time)),
  });

  useEffect(() => {
    if (data?.data) setDashboardData(data?.data);
  }, [data]);

  const logout = () => {
    router.push("/"); 
  }


  return (
<View className="flex-1 bg-gradient-to-r from-green-900 to-emerald-900 flex-row">
  {/* Left Side: Banner */}
  <View className="w-1/3" >
    <Image
      source={require("@/assets/logo.jpg")}
      className="w-full h-full"
      resizeMode="cover"
      
    />
  </View>

  {/* Right Side: Dashboard */}
  <View className="w-2/3 px-6 py-6">

  


    {/* Cashier Info */}
    <View className="flex-row items-center justify-between mb-3">
     <View className="bg-white/10 rounded-xl ">
      <Text className="text-green-800 text-xl font-semibold">
        cashier: {user?.fullname || "Not Found"}
      </Text>
      <Text className="text-stone-700 text-lg mt-1">
        Branch:  {user?.branch || "Not Found"}
      </Text>
    </View>

      {user!.branch == "Main Branch" && (
        <PrintQrComponent />
      )}
      
     <TouchableOpacity
        onPress={logout}
        className="px-4 py-2 bg-red-500 rounded-lg"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>



    <View className="flex-row justify-between items-start gap-5 mb-4">
      {/* Cashier Change Section */}
      <View className="flex-1">
        <Text className="text-green-800 text-lg font-bold mb-2">
          Cashier Change :
        </Text>
        <View className="flex-row items-center gap-3">
          <View
            className={`flex-1 rounded-xl px-3 py-2 ${
              change === 0 ? "bg-red-100 border border-red-500" : "bg-white"
            }`}
          >
            <TextInput
              value={change.toString()}
              onChangeText={(val) => setChange(Number(val))}
              placeholder="Enter initial change"
              keyboardType="numeric"
              className={`text-base ${
                change === 0 ? "text-red-600" : "text-green-900"
              }`}
            />
          </View>

          <TouchableOpacity
            onPress={changeHandler}
            className="bg-green-600 px-4 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* End Shift Section */}
      {(shift != null) && (
        <View className="items-end p-2">
          <Text className="text-red-800 text-lg font-bold mb-2 ">End Shift :</Text>
          <TouchableOpacity className="bg-red-600 px-10 py-3 rounded-xl" onPress={endShiftHandler} >
            <Text className="text-white font-semibold">End</Text>
          </TouchableOpacity>
        </View>
      )}
   

    </View>


    

    

    {/* Stats Boxes */}
    <View className="flex-row gap-4">
      {/* Today Sales */}
      <View className="flex-1 bg-white rounded-2xl py-6 px-4 items-center shadow-lg">
        <Text className="text-green-700 text-lg font-semibold mb-1">
          Today Sales
        </Text>
        <Text className="text-green-900 text-4xl font-extrabold">
          ₱{dashboardData.salesToday.toLocaleString()}
        </Text>
      </View>

      {/* Active Tables */}
      <View className="flex-1 bg-white rounded-2xl py-6 px-4 items-center shadow-lg">
        <Text className="text-green-700 text-lg font-semibold mb-1">
          Active orders
        </Text>
        <Text className="text-green-900 text-4xl font-extrabold">
          {dashboardData.activeTatble}
        </Text>
      </View>
    </View>
  </View>
</View>

  );
}
