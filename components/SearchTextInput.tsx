import { View, Image, TextInput } from "react-native";

import { icons } from "@/constants";


const SearchTextInput = ({
  containerStyle,
  handlePress,
}: any) => {
  return (
    <View
      className={`flex flex-row items-center justify-between px-3 relative border border-gray-100 shadow-2xl h-12 z-50 rounded-xl ${containerStyle}`}
    >
      <Image source={icons.search} className="w-5 h-5" tintColor="#e23744" />

      <TextInput
        // onChangeText={onChangeNumber}
        // value={number}
        placeholder={`Search "chai samosa"`}
        className="w-[80%] h-full text-md font-semibold"
        selectionColor={'#e23740'}
      />

      <Image source={icons.mic} className="w-5 h-5" tintColor="#e23744" />
    </View>
  );
};

export default SearchTextInput;