import { Image, SafeAreaView, StyleSheet } from "react-native";
import * as React from "react";
import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useLinkTo } from "@react-navigation/native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export const RegisterPage = () => {
    const { onLogin, loading, error } = useAuth();
    const linkTo = useLinkTo();
    const [userNameInput, setUserNameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [repeatPasswordInput, setRepeatPasswordInput] = useState("");

    const theme = useTheme();

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={require("../images/logo.png")} />
            <TextInput
                onChangeText={(input: string) => setUserNameInput(input)}
                error={error}
                mode="outlined"
                style={{ ...styles.textInput, marginTop: 16 }}
                label="Username"
                textContentType="name"
            />
            <TextInput
                error={error}
                onChangeText={(input: string) => setPasswordInput(input)}
                mode="outlined"
                style={{ ...styles.textInput }}
                label="Password"
                textContentType="password"
                secureTextEntry
            />
            <TextInput
                error={error}
                onChangeText={(input: string) => setRepeatPasswordInput(input)}
                mode="outlined"
                style={{ ...styles.textInput }}
                label="Repeat password"
                textContentType="password"
                secureTextEntry
            />
            {error && (
                <Text style={{ ...styles.errorText, color: theme.colors.error }}>
                    {error.toString()}
                </Text>
            )}
            <Button
                style={styles.loginButton}
                mode="contained"
                loading={loading}
                onPress={() =>
                    onLogin({
                        username: userNameInput || "michalolsav",
                        password: passwordInput || "123456",
                    })
                }
            >
                REGISTER
            </Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    errorText: {
        // marginBottom: 16,
    },
    container: {
        marginTop: 80,
        alignItems: "center",
    },
    logo: {
        width: 300,
        height: 150,
    },
    header: {
        margin: 16,
    },
    textInput: {
        borderRadius: 50,
        marginBottom: 8,
        width: "70%",
    },
    loginButton: {
        marginTop: 8,
        width: "50%",
    },
});
