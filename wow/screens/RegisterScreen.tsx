import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { useFonts } from 'expo-font';

interface Props {
    navigation: any;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [fontsLoaded] = useFonts({
        'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
        'PlusJakartaSans-ExtraBold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    });

  

    if (!fontsLoaded) {
        return <Text>Loading...</Text>; // Show something while loading
    }

    const register = async () => {
        try {
            const response = await axios.post("http://192.168.1.2:5000/api/auth/register", { name, email, password });

            // Check if registration was successful
            if (response.status === 201) {
                Alert.alert("Registration successful");
                navigation.navigate("Login");
            }
        } catch (error: any) {
            Alert.alert("Registration failed", error.response?.data?.message || error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoQuick}>Quick</Text>
                <Text style={styles.logoBites}>Bites</Text>
            </View>
            <Text style={styles.logoSubtitle}>Because good things come to those who plan - morning, noon, and night.</Text>
            
            <Text style={styles.welcomeText}>Sign Up</Text>
            <Text style={styles.welcomeSubtext}>Welcome! Please fill in the details to get started.</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput 
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />

            <Text style={styles.label}>Email or Username</Text>
            <TextInput 
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter your email or username"
            />
            
            <Text style={styles.label}>Password</Text>
            <TextInput 
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput 
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.registerButton} onPress={register}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

    },
    logoQuick: {
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 48,
        color: '#C17F12',
    },
    logoBites: {
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 48,
        color: '#000000',
    },
    logoSubtitle: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 30,
    },
    welcomeText: {
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 24,
        color: '#000000',
        marginTop: 0,
        marginBottom: 8,
    },
    welcomeSubtext: {
        fontFamily: 'PlusJakartaSans-Regular',

        color: '#666666',
        marginBottom: 24,
    },
    label: {
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontFamily: 'PlusJakartaSans-Regular',
    },
    registerButton: {
        backgroundColor: '#C17F12',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        color: '#666',
    },
    loginLink: {
        color: '#C17F12',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
