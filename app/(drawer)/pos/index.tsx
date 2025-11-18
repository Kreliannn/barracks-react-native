import AddCartButton from '@/components/pos/addCart';
import { CartComponent } from '@/components/pos/cart';
import TablesPage from '@/components/pos/tables';
import useTableStore from '@/store/table.store';
import { getMenuInterface } from '@/types/menu.type';
import axiosInstance from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';


const types = [ "All", "Ala carte", "Unli", "Sizzling", "Pulutan", "Beverage", "Others"]

export default function PosPage() {
 
  const { table, setTable } = useTableStore()

   const [menuData, setMenuData] = useState<getMenuInterface[]>([])
    const [menu, setMenu] = useState<getMenuInterface[]>([])

    const { data } = useQuery({
        queryKey: ["menu"],
        queryFn: () => axiosInstance.get("/menu")
    })

    useEffect(() => {
        if(data?.data)
        {
            setMenuData(data.data)
            setMenu(data.data)
        }
    }, [data])

    const filterHandler = (type : string) => {
        if(type == "All") return setMenu(menuData)
        setMenu(menuData.filter((item) => item.type == type))
    }

    const { width } = Dimensions.get("window");
    const cardWidth = width / 4 - 20; 




    if(!table) return <TablesPage  />


  return (
    <View className="flex-1 flex-row bg-stone-200">
      {/* LEFT SIDE - 2/3 */}
      <View className="w-2/3 h-full bg-stone-100">
        {/* Header */}
        <View className="h-[10%] bg-green-900 flex-row items-center px-4">
          <Text className="flex-1 text-center text-2xl font-bold text-white">
            {table}
          </Text>
          <TouchableOpacity
            className="bg-white px-3 py-1 rounded"
            onPress={() => setTable("")}
          >
            <Text className="text-green-900 font-semibold">Switch Table</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Grid */}
         <View className="h-[80%] px-3 ">
            <FlatList
                data={menu}
                numColumns={3}
                keyExtractor={(item) => item._id}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
                renderItem={({ item, index }) => (
                <View
                    style={{ width: cardWidth }}
                    className={`bg-white rounded-2xl shadow border border-gray-200 overflow-hidden ${(index < 3) && "mt-2"}`}
                >
                    {/* Image */}
                    <View className="h-28 bg-gray-100">
                    {item.img ? (
                        <Image
                        source={{ uri: item.img }}
                        className="w-full h-full"
                        resizeMode="cover"
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-400 text-2xl">📦</Text>
                        </View>
                    )}
                    </View>

                    {/* Content */}
                    <View className="p-3">
                    <Text
                        className="font-semibold text-base text-gray-900"
                        numberOfLines={1}
                    >
                        {item.name}
                    </Text>
                    <Text className="text-sm text-gray-500">₱ {item.variants[0].price}</Text>

                    <AddCartButton menu={item} />
                    
                    </View>
                </View>
                )}
                ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center py-10">
                    <Text className="text-lg font-semibold text-gray-500">No Menu Found</Text>
                    <Text className="text-sm text-gray-400">Add items to populate your food menu.</Text>
                </View>
                )}
            />
            </View>

        {/* Category Filter */}
        <View className="h-[10%] bg-green-900 flex-row flex-wrap justify-center items-center gap-2 px-2">
          {types.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => filterHandler(type)}
              className="bg-white px-3 py-2 rounded"
            >
              <Text className="text-stone-800 font-semibold">{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* RIGHT SIDE - 1/3 (Empty) */}
      <View className="w-1/3 h-full bg-stone-200" >
          <CartComponent table={table} /> 
      </View>
    </View>
  )
}
