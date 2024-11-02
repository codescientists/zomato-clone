
import { router, useLocalSearchParams } from 'expo-router';
import { icons, images } from '@/constants';
import { Link } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFetch } from '@/lib/fetch';
import Modal from "react-native-modal";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import CustomButton from '@/components/CustomButton';


type ItemProps = {item: {id: string, name: string, image_url: string, category: string, rating: number, price: number, is_veg: boolean}};

const Item = ({ item, handleFoodItemPress }: any) => (
  <TouchableOpacity onPress={() => handleFoodItemPress(item.id)}>
    <View className="flex flex-row items-center p-4 border-b border-gray-300 border-dashed py-10 overflow-hidden">
        <View className="w-1/2 space-y-1">
            <View className="flex flex-row space-x-2 items-center">
                <Image source={icons.nonVeg} className="w-6 h-6" tintColor={`${item.is_veg ? "#16a34a" : "#e23744"}`} />
                <Text className="bg-yellow-500 rounded-md px-2 text-gray-50 text-xs py-1">Bestseller</Text>
            </View>
            <Text className="font-bold text-lg">{item.name}</Text>
            <Text className="font-medium text-gray-500">{item.total_reviews} ratings</Text>
            <Text className="text-lg font-bold my-1">₹{item.price}</Text>
            <Text className="text-gray-500 line-clamp-2">{item.description}</Text>
            
            <View className="flex flex-row items-center justify-center space-x-2 border border-gray-100 rounded-full w-fit p-2 mt-2">
                <Feather name="bookmark" size={18} color="#e23744" />
                <Text className="text-xs font-semibold text-gray-500">Add to collection</Text>
            </View>
        </View>
        <View className="relative flex items-center justify-center w-1/2">
            <Image src={item.image_url} className="w-36 h-36 object-cover rounded-3xl" />
            <TouchableOpacity className="absolute -bottom-4 bg-red-100 border border-red-500 rounded-lg w-24 h-10 flex items-center justify-center">
                <Text className="font-bold text-red-700">ADD</Text>
            </TouchableOpacity>
        </View>
    </View>
  </TouchableOpacity>
);


export default function Page() {
  const { restaurantId } = useLocalSearchParams();
  const { user } = useUser()

  const [activeOrder, setActiveOrder] = useState(null)
  
  const {
    data: restaurant,
    loading,
    error,
  } = useFetch<any>(`/(api)/restaurant/${restaurantId}`);

  const [modalActiveItem, setModalActiveItem] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false)
  const [orderModalVisible, setOrderModalVisible] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleFoodItemPress = async (id: any) => {
    const activeItem = await restaurant?.food_items.find((item: any) => item.id == id);
    setModalActiveItem(activeItem)
    setModalOpen(true)
  }

  const fetchActiveOrder = async (userEmail: any, restaurantId: any) => {
      const response = await fetch(`/(api)/order/active?userEmail=${encodeURIComponent(userEmail)}&restaurantId=${encodeURIComponent(restaurantId)}`);
  
      if (response.ok) {
          const activeOrder = await response.json();
          if(!(activeOrder.length === 0)){
            setActiveOrder(activeOrder);
          }

          console.log('Active Order:', activeOrder);
          return activeOrder;
      } else {
          console.error('Error fetching active order:', await response.json());
    }
  };

  useEffect(() => {
    fetchActiveOrder(user?.emailAddresses[0].emailAddress, restaurantId);
  }, [loading])
  

  const createOrder = async () => {
    const response = await fetch('/(api)/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            restaurantId: restaurantId,
            userName: user?.firstName,
            userEmail: user?.emailAddresses[0].emailAddress
        })
    });

    const data = await response.json();
    if (response.ok) {
        console.log('Order created:', data);
        // Alert.alert("Success", "Order placed! Track your order in profile.");
        return data.orderId; // Return the new order ID
    } else {
        console.error('Error creating order:', data.error);
    }
  };

  const addItemToOrder = async (itemId:any, quantity:any, price:any) => {
    let orderId;

    if(!activeOrder){
      orderId = await createOrder();
    }else{
      orderId = activeOrder.order.order_id;
    }
    
    console.log({
      orderId,
            itemId,
            quantity,
            price
    })
    
    const response = await fetch('/(api)/order/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            orderId,
            itemId,
            quantity,
            price
        })
    });

    if (response.ok) {
        console.log('Item added to order');
        fetchActiveOrder(user?.emailAddresses[0].emailAddress, restaurantId)
    } else {
        console.error('Error adding item to order:', await response.json());
    }
  };

  const placeOrder = async (orderId:any) => {
    
    const response = await fetch('/(api)/order/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId,
          userEmail: user?.emailAddresses[0].emailAddress,
          restaurantId: restaurantId,
          orderStatus: "Completed",
          })
    });

    if (response.ok) {
        console.log('Item added to order');
        fetchActiveOrder(user?.emailAddresses[0].emailAddress, restaurantId);
        setShowSuccessModal(true)
    } else {
        console.error('Error placing the order:', await response.json());
    }
  };


  return <SafeAreaView className="bg-white">
    <FlatList
        data={restaurant?.food_items}
        renderItem={({ item }) => <Item item={item} handleFoodItemPress={handleFoodItemPress} />}
        keyExtractor={(item, index) => item.id}
        className="px-3"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center py-10">
            {!loading ? (
              <>
                <Image
                  source={icons.dineIn}
                  className="w-36 h-36"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-xl">No food items available.</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#e23744" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <View className="relative">
            <View className="flex flex-row items-center justify-between my-2 w-full">
              <Link href={`/(root)/(tabs)/delivery`} asChild>
                <Pressable>
                    <View className="flex flex-row items-center space-x-2">
                        <AntDesign name="left" size={24} color="black" />
                    </View>
                </Pressable>
              </Link>
              <View className="flex flex-row items-center space-x-2">
                <Feather name="bookmark" size={24} color="black" />
                <Entypo name="dots-three-vertical" size={20} color="black" />
               </View>
            </View>

            <View className="mt-6 space-y-2">
                <View className="flex flex-row items-center justify-between">
                    <Text className="text-2xl font-bold">{restaurant?.restaurant_name}</Text>
                    <Text className="bg-green-600 text-white p-1 rounded-md">{restaurant?.restaurant_rating} ✮</Text>
                </View>
                <View className="flex flex-row items-center justify-start space-x-2">
                    <Ionicons name="timer-outline" size={20} color="black" />
                    <Text>37 mins • 6.5 km • {restaurant?.city}</Text>
                </View>
                <View className="flex flex-row items-center justify-start space-x-2">
                    <MaterialCommunityIcons name="calendar-clock-outline" size={20} color="black" />
                    <Text>Schedule for later</Text>
                </View>
                <View className="h-[1px] w-full my-1 bg-gray-300" />
                <View className="flex flex-row items-center space-x-2">
                    <Image source={icons.discountBadge} className="w-5 h-5" />
                    <Text className="font-semibold text-gray-500">Flat ₹125 OFF + ₹25 cashback</Text>
                </View>
            </View>

            <View className="flex flex-row items-center justify-center mt-8">
              <Text className="mx-4 font-bold text-lg tracking-widest uppercase">Our MENU</Text>
            </View>

            <View className="absolute bottom-0 left-0 bg-red-400 w-full">
              <Modal className="m-0" animationIn="slideInUp" isVisible={orderModalVisible} onBackButtonPress={() => setOrderModalVisible(false)} onBackdropPress={() => setOrderModalVisible(false)}>
                <View className="bg-gray-50 h-[90%] mt-auto w-full rounded-2xl p-4">

                <ScrollView>
                  {/* Gold Membership */}
                  <View className="flex-row justify-between items-center bg-yellow-50 p-4 rounded-lg mb-4 gap-2">
                    <View className="w-[70%]">
                      <Text className="text-base font-semibold">Get Gold for 3 months</Text>
                      <Text className="text-sm text-gray-500">Unlimited free deliveries & more benefits</Text>
                      <Pressable>
                        <Text className="text-sm text-red-500">Learn more</Text>
                      </Pressable>
                    </View>
                    <View className="flex-col items-center">
                      <Pressable className="border border-red-600 px-2 py-1 rounded-md">
                        <Text className="text-red-600 font-semibold">ADD</Text>
                      </Pressable>
                      <Text className="text-sm font-semibold ml-4">₹30</Text>
                    </View>
                  </View>

                  {/* Food Item */}
                  <View className="bg-white p-4 rounded-lg mb-4">
                    {
                      activeOrder?.order?.items?.map((item: any) => (
                        <View key={item.id} className="border-b border-gray-300 border-dashed pb-4 pt-2">
                          <View className="flex-row justify-between">
                            <Text className="text-base font-semibold">{item.item_name}</Text>
                            <View className="flex-row items-center border border-[#e23744] bg-red-50 p-1 rounded-lg">
                              <Pressable>
                                <Feather name="minus" size={16} color="#e23744" />
                              </Pressable>
                              <Text className="mx-3">1</Text>
                              <Pressable>
                                <Feather name="plus" size={16} color="#e23744" />
                              </Pressable>
                            </View>
                          </View>
                          <View className="flex-row justify-between items-center mt-2">
                            
                            <Text className="text-base text-gray-500">₹{item.price}</Text>

                            <View className="flex-row justify-between items-center gap-2">
                              <Text className="text-base text-gray-500 line-through">₹{item.price}</Text>
                              <Text className="text-base text-green-600 font-bold">₹{(item.price - (item.price * (10 / 100))).toFixed(2)}</Text>
                            </View>
                          </View>
                          <Text className="text-gray-500 mt-2 text-xs">NOT ELIGIBLE FOR COUPONS</Text>
                        </View>
                      ))
                    }
                  </View>

                  {/* Note for restaurant */}
                  <Pressable className="border border-gray-300 p-4 rounded-lg mb-4">
                    <Text className="text-base font-semibold">Add a note for the restaurant</Text>
                  </Pressable>

                  {/* Discount Section */}
                  <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-4">
                    <View className="flex-row items-center">
                      <Text className="text-base font-semibold">Items starting @ ₹99 only applied!</Text>
                      <Text className="text-green-500 ml-2">- ₹1.00</Text>
                    </View>
                  </View>

                  {/* Coupons */}
                  <Pressable className="bg-white p-4 rounded-lg mb-4">
                    <Text className="text-base text-red-500">View all coupons</Text>
                  </Pressable>

                  {/* Delivery Time */}
                  <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-4">
                    <Text className="text-base font-semibold">Delivery in</Text>
                    <Text className="text-xs text-gray-600">38 mins</Text>
                  </View>
                  <View className="flex-col justify-between items-start bg-white p-4 rounded-lg mb-4">
                    <Text className="text-base font-semibold">Deliver at Home</Text>
                    <Text className="text-base text-gray-500">Chirle, Belondakhar, India</Text>
                  </View>

                  {/* Payment */}
                  <Pressable className="bg-white p-4 rounded-lg mb-4 flex-row justify-between items-center">
                    <View>
                      <Text className="text-base font-semibold">Zomato Money</Text>
                      <Text className="text-sm text-gray-500">Single tap payments. Zero failures</Text>
                    </View>
                    <Text className="text-red-500">NEW</Text>
                  </Pressable>

         
                </ScrollView>

                  <View className="mt-auto">
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-lg font-semibold">₹{activeOrder?.order?.order_total} TOTAL</Text>
                      <TouchableOpacity onPress={() => placeOrder(activeOrder?.order?.order_id)} className="bg-[#e23744] p-4 rounded-md w-[50%] flex items-center justify-center">
                        <Text className="text-white font-semibold">Place Order</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            <View>
              <Modal className="m-0" animationIn="slideInUp" isVisible={modalOpen} onBackButtonPress={() => setModalOpen(false)} onBackdropPress={() => setModalOpen(false)}>
                <View className="bg-white h-[80%] mt-auto w-full rounded-2xl">
                  <View className="flex flex-col items-center p-4 py-5 overflow-hidden">

                      <View className="relative flex items-center justify-center w-full">
                        <Image src={modalActiveItem?.image_url} className="w-full h-52 object-cover rounded-xl" />
                      </View>
                      
                      <View className="space-y-1 mt-4">
                          <View className="flex flex-row space-x-2 items-center">
                              <Image source={icons.nonVeg} className="w-6 h-6" tintColor={`${modalActiveItem?.is_veg ? "#16a34a" : "#e23744"}`} />
                              <Text className="bg-yellow-600 rounded-md px-2 text-gray-50 text-xs py-1">Bestseller</Text>
                          </View>
                          <Text className="font-bold text-lg tracking-wide">{modalActiveItem?.name}</Text>
                          <Text className="font-medium text-gray-500">{modalActiveItem?.total_reviews} ratings</Text>
                          <Text className="text-lg font-bold my-1">₹{modalActiveItem?.price}</Text>
                          <Text className="text-gray-500 text-[15px]">{modalActiveItem?.description}</Text>
                          
                          <View className="flex flex-row items-center justify-center space-x-2 border border-gray-100 rounded-full w-fit p-2 mt-2">
                              <Feather name="bookmark" size={18} color="#e23744" />
                              <Text className="text-xs font-semibold text-gray-500">Add to collection</Text>
                          </View>
                      </View>
                      
                  </View>
                  <View className="mt-auto">
                    <TouchableOpacity onPress={() => addItemToOrder(modalActiveItem?.id, 1, modalActiveItem?.price)} className="m-4 bg-red-500 flex items-center justify-center py-3 rounded-xl">
                      <Text className="text-white text-md">Add item</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>

            <Modal animationIn="slideInUp" isVisible={showSuccessModal} onBackdropPress={() => setShowSuccessModal(false)}>
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Image
                  source={images.check}
                  className="w-[110px] h-[110px] mx-auto my-5"
                />
                <Text className="text-3xl font-JakartaBold text-center">
                  Order Placed!
                </Text>
                <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                  We will deliver your order ASAP.
                </Text>
                <CustomButton
                  title="Track Order"
                  onPress={() => router.push(`/(root)/profile/orders`)}
                  className="mt-5"
                />
              </View>
            </Modal>
          </View>
        }
      />

      <View className="bg-[#e23744] flex items-center justify-center absolute bottom-0 w-full h-20">
        <TouchableOpacity className="flex flex-row items-center py-5 px-8" onPress={() => setOrderModalVisible(true)}>
          <Text className="text-white text-lg">{activeOrder?.order?.items?.length} items added </Text> 
          <View className="bg-white rounded-full ml-2"><Text className="text-[#e23744] p-[2px]"><Feather name='arrow-right' size={16} /></Text></View>
        </TouchableOpacity>
      </View>
  </SafeAreaView>;
}
