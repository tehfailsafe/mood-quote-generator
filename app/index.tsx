import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY });

export default function Home() {
  const [feeling, setFeeling] = useState("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuote = async () => {
    setLoading(true);
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
    } catch (error) {
      console.error("Error generating quote:", error);
      setQuote(
        "Sorry, there was an error generating a quote. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-slate-900 flex-1">
      <View className="p-4 items-center justify-center h-full">
        <Text className="text-2xl font-bold text-blue-500 dark:text-blue-400 text-center mb-4">
          Let's generate some quotes!
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 rounded-md p-2 w-full mb-4"
          placeholder="How are you feeling today?"
          value={feeling}
          onChangeText={setFeeling}
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-md p-2 w-full mb-4"
          onPress={generateQuote}
          disabled={loading || !feeling}
        >
          <Text className="text-white text-center font-bold">
            {loading ? "Generating..." : "Generate Quote"}
          </Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#4299e1" />}
        {quote && (
          <Text className="text-gray-800 dark:text-gray-200 text-center mt-4">
            {quote}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
