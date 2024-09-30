import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY });

export default function Home() {
  const [feeling, setFeeling] = useState("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [quoteReady, setQuoteReady] = useState(false);
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const generateQuote = async () => {
    setLoading(true);
    setQuoteReady(false);
    Keyboard.dismiss();

    try {
      const systemPrompt =
        "You are a helpful assistant that generates inspirational quotes based on how someone is feeling.";
      const userPrompt = `I'm feeling ${feeling}. Can you give me an inspirational quote that relates to this feeling?`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      setQuote(response.choices[0].message?.content || "");
      setQuoteReady(true);
    } catch (error) {
      console.error("Error generating quote:", error);
      setQuote(
        "Sorry, there was an error generating a quote. Please try again."
      );
      setQuoteReady(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quoteReady) {
      slideAnim.setValue(50);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50, // Reduced from 400
          friction: 20, // Reduced from 40
          useNativeDriver: true,
        }),
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 50, // Reduced from 400
          friction: 20, // Reduced from 40
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [quoteReady]);

  return (
    <ImageBackground
      source={require("../assets/images/background-2.png")}
      style={{ flex: 1 }}
    >
      <BlurView intensity={20} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1 }}>
              <View className="flex-1 justify-center items-center p-6">
                {!loading && !quote && (
                  <Text className="text-white text-3xl font-bold mb-6">
                    How are you feeling?
                  </Text>
                )}
                {loading ? (
                  <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                  <Animated.View
                    className="rounded-xl p-4 w-full"
                    style={{
                      transform: [{ translateY: slideAnim }],
                      opacity: fadeAnim,
                    }}
                  >
                    <Text className="text-white text-center text-2xl italic">
                      {quote}
                    </Text>
                  </Animated.View>
                )}
              </View>

              <View className="p-4">
                <View className="flex-row items-center">
                  <View className="flex-1 bg-white/20 rounded-l-xl ">
                    <TextInput
                      className="bg-transparent text-white text-lg p-4 rounded-xl"
                      placeholder="Enter your feeling..."
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={feeling}
                      onChangeText={setFeeling}
                    />
                  </View>
                  <TouchableOpacity
                    className={`rounded-r-xl p-4 disabled:bg-white/20 ${
                      feeling ? "bg-white/20" : "bg-white/50"
                    }`}
                    onPress={generateQuote}
                    disabled={loading || !feeling}
                  >
                    <Feather name="send" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </BlurView>
    </ImageBackground>
  );
}
