import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface Props extends TextInputProps {
  label: string;
  placeholder?: string;
}

const CustomInput = ({
  label,
  placeholder,
  secureTextEntry,
  ...rest
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry === true;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, isFocused && styles.inputFocused]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: "100%" },
  label: {
    fontSize: 14, // ទំហំ Label ប៉ុនគ្នាគ្រប់កន្លែង
    color: "#444",
    marginBottom: 8,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
  },
  inputFocused: {
    borderColor: "#00529B",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 13,
    fontSize: 15,
    color: "#222",
  },
  eyeBtn: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomInput;
