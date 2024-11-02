import SearchTextInput from '@/components/SearchTextInput';
import { icons, images } from '@/constants';
import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useFetch } from '@/lib/fetch';


type ItemProps = {item: {id: string, name: string, image_url: string, cuisine_type: string, rating: number, price_range: number}};

const Item = ({item}: ItemProps) => (
  <Link href={`/(root)/restaurants/${item.id}`} asChild>
    <Pressable>
      <View className="border border-gray-300 my-2 rounded-3xl overflow-hidden">
        <Image src={item.image_url} className="w-full h-56" />
        <View className="px-4 py-4">
          <Text className="font-bold text-lg">{item.name}</Text>
          <Text className="font-medium text-gray-500">{item.cuisine_type} • ₹{item.price_range} for one </Text>
          <View className="h-[1px] w-full my-2 bg-gray-300" />
          <View className="flex flex-row items-center space-x-2">
            <Image source={icons.discountBadge} className="w-5 h-5" />
            <Text className="font-semibold text-gray-500">Flat ₹125 OFF + ₹25 cashback</Text>
          </View>
        </View>
      </View>
    </Pressable>
  </Link>
);

export default function DeliveryScreen() {
  const { user } = useUser()

  const {
    data: restaurants,
    loading,
    error,
  } = useFetch<any>(`/(api)/restaurants`);

  return (
    <SafeAreaView className="h-full flex items-center justify-center bg-white">
      <FlatList
        data={restaurants}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item, index) => item.id}
        className="px-3"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={icons.dineIn}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-[8px]">No restaurants found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#e23744" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-2 w-full">
              <View className="flex flex-row items-center space-x-2">
                <Image source={icons.locationPin} className="w-6 h-6" tintColor="#e23744" />
                <View>
                  <Text className="text-l8font-bold  ">
                    Home
                  </Text>
                  <Text className="text-m8font-medium text-gray-500">
                    Chirle, Belondkhar, India
                  </Text>
                  {/* <SignedIn>
                    <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                  </SignedIn>
                  <SignedOut>
                    <Link href="/sign-in">
                      <Text>Sign In</Text>
                    </Link>
                    <Link href="/sign-up">
                      <Text>Sign Up</Text>
                    </Link>
                  </SignedOut> */}
                </View>
              </View>
              <View
                className="flex justify-center items-center w-10 h-10 rounded-full bg-blue-100"
              >
                <Link href={`/(root)/profile`} className="text-b8e-600 text-lg font-semibold leading-none w-fit h-fit">
                  P
                </Link>
              </View>
            </View>

            <SearchTextInput
              containerStyle="bg-white"
              // handlePress={handleDestinationPress}
            />

            <>
              <View className="flex flex-row items-center justify-center mt-5 mb-2">
                <View className="h-[1px] flex-1 bg-gray-300" />
                <Text className="mx-4 text-gray-500 text-md tracking-widest">EXPLORE</Text>
                <View className="h-[1px] flex-1 bg-gray-300" />
              </View>
              <ScrollView horizontal className="flex flex-row flex-wrap space-x-2 my-2">
                <View className="col-span-1 flex flex-col items-center justify-center bg-transparent border border-gray-300 rounded-2xl h-24 w-20">
                  <Image source={images.discount} className="w-8 h-8" tintColor="#3b82f6" />
                  <Text className="font-bold text-[11px] mt-2">Offers</Text>
                  <Text className="text-[9px] font-semibold text-gray-500">Up to 60% OFF</Text>
                </View>
                <View className="col-span-1 flex flex-col items-center justify-center bg-transparent border border-gray-300 rounded-2xl h-24 w-20">
                  <Image source={images.party} className="w-8 h-8" />
                  <Text className="font-bold text-[11px] mt-2">Plan a party</Text>
                  <Text className="text-[9px] font-semibold text-gray-500">Diwali special</Text>
                </View>
                <View className="col-span-1 flex flex-col items-center justify-center bg-transparent border border-gray-300 rounded-2xl h-24 w-20">
                  <Image source={images.brand} className="w-8 h-8" />
                  <Text className="font-bold text-[11px] mt-2">Brand Pack</Text>
                  <Text className="text-[9px] font-semibold text-gray-500">Extra offers</Text>
                </View>
                <View className="col-span-1 flex flex-col items-center justify-center bg-transparent border border-gray-300 rounded-2xl h-24 w-20">
                  <Image source={images.train} className="w-8 h-8" />
                  <Text className="font-bold text-[11px] mt-2">Food on train</Text>
                  <Text className="text-[9px] font-semibold text-gray-500">Delivery at seat</Text>
                </View>
              </ScrollView>
            </>

            <>
              <View className="flex flex-row items-center justify-center mt-5 mb-2">
                <View className="h-[1px] flex-1 bg-gray-300" />
                <Text className="mx-4 text-gray-500 text-md tracking-widest uppercase">What's on your mind?</Text>
                <View className="h-[1px] flex-1 bg-gray-300" />
              </View>
              <ScrollView horizontal className="flex flex-row flex-wrap space-x-2 my-2">
                <View className="flex flex-col items-center space-y-2">
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.pizza} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Pizza</Text>
                  </View>
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.biryani} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Biryani</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.burger} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Burger</Text>
                  </View>
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.thali} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Thali</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.chicken} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Chicken</Text>
                  </View>
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.cake} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Cake</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.friedRice} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Fried Rice</Text>
                  </View>
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.northIndian} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">North Indian</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.rolls} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Rolls</Text>
                  </View>
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.dosa} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Dosa</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.sandwich} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Sandwich</Text>
                  </View>
                  <View className="col-span-1 flex flex-col items-center justify-center bg-transparent h-20 w-20">
                    <Image source={images.noodles} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Noodles</Text>
                  </View>
                </View>
              </ScrollView>
            </>

            <View className="flex flex-row items-center justify-center mt-5 mb-2">
              <View className="h-[1px] flex-1 bg-gray-300" />
              <Text className="mx-4 text-gray-500 text-md tracking-widest uppercase">All Restaurants</Text>
              <View className="h-[1px] flex-1 bg-gray-300" />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}
