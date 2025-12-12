import PrimaryButton from "@/components/primary-button";
import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyOtpScreen() {
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (seconds > 0) return;
    setCode(Array(OTP_LENGTH).fill(""));
    setSeconds(RESEND_SECONDS);
    inputsRef.current[0]?.focus();
    // TODO: trigger resend API call
  };

  const handleSubmit = () => {
    const otp = code.join("");
    if (otp.length !== OTP_LENGTH) {
      inputsRef.current[code.findIndex((digit) => !digit)]?.focus();
      return;
    }
    console.log("Submitted OTP:", otp);
    router.push("/auth/reset-password");
  };

  const isComplete = code.every((digit) => digit);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1 bg-white p-8 gap-4 justify-between">
        <View>
          <Text className="text-3xl font-bold">Enter OTP Code</Text>
          <Text className="text-base font-light py-2 text-justify">
            Check your email for the one-time passcode (OTP) we sent to reset
            your password and enter it below.
          </Text>

          <View className="flex-row justify-between py-6">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputsRef.current[index] = ref;
                }}
                className="w-12 h-14 rounded-xl border border-gray-300 text-center text-xl font-semibold text-gray-900"
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                autoFocus={index === 0}
                textContentType="oneTimeCode"
                importantForAutofill="yes"
                placeholder="•"
                placeholderTextColor="#d1d5db"
              />
            ))}
          </View>

          <View className="items-center gap-2">
            <Text>
              {seconds > 0
                ? `You can resend the OTP code in ${seconds} seconds.`
                : "You can resend the OTP code now."}
            </Text>

            <Pressable
              onPress={handleResend}
              disabled={seconds > 0}
              className={seconds > 0 ? "opacity-50" : "opacity-100"}
            >
              <Text className="text-lg font-bold text-primary">
                Resend Code
              </Text>
            </Pressable>
          </View>
        </View>

        <View>
          <PrimaryButton title="Verify Code" onPress={handleSubmit} />
        </View>
      </View>
    </>
  );
}
