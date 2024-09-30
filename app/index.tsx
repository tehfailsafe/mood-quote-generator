import { Text, View, useColorScheme, SafeAreaView } from "react-native";

export default function Home() {
  return (
    <SafeAreaView className="bg-white dark:bg-slate-900">
      <View className="p-4 items-center justify-center h-full">
        <Text className="text-2xl font-bold text-blue-500 dark:text-blue-400 text-center mb-4">
          Welcome to NativeWind with Expo Router!
        </Text>
        <Text className="text-gray-800 dark:text-gray-300 text-center">
          Start editing to see some magic happen!
        </Text>
      </View>
    </SafeAreaView>
  );
}
