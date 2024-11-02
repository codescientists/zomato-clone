import { useState, useEffect } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import dayjs from 'dayjs';

const groupOrdersByDate = (orders) => {
  return orders.reduce((grouped, order) => {
    const date = dayjs(order.order_date).format('YYYY-MM-DD'); // Group by formatted date
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(order);
    return grouped;
  }, {});
};

const MyOrders = () => {
  const { user, isLoaded } = useUser(); 
  const [orders, setOrders] = useState({}); // Initialize as empty object
  const [loading, setLoading] = useState(true); // Loading state

  const fetchOrders = async (userEmail) => {
    try {
      const response = await fetch(`/(api)/order/myOrders?userEmail=${encodeURIComponent(userEmail)}`);


      if (response.ok) {
        const res = await response.json();        
        const groupedOrders = groupOrdersByDate(res);
        
        setOrders(groupedOrders);
        console.log('Orders:', res);
      } else {
        console.error('Error fetching orders:', await response.json());
        Alert.alert("Error", "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false); // Stop loading once the fetch is complete
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (!Object.keys(orders).length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No orders found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold mb-4">My Orders</Text>

      {Object.keys(orders).map((date) => (
        <View key={date}>
          <Text className="text-lg font-semibold mb-2">{dayjs(date).format('MMMM DD, YYYY')}</Text>
          
          {orders[date].map((order) => (
            <View key={order.id} className="mb-4 bg-white p-4 rounded-lg shadow">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold">Order #{order.order_number}</Text>
                <Text className={`font-bold ${order.order_status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {order.order_status}
                </Text>
              </View>
              <Text className="text-gray-500 mt-1">Placed on: {dayjs(order.order_date).format('MMMM DD, YYYY')}</Text>
              <Text className="mt-1">Total: ₹{order.order_total}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default MyOrders;
