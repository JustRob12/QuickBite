import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    navigation: any;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const login = async () => {
        try {
            const response = await axios.post("http://192.168.1.8:5000/api/auth/login", { email, password });
            await AsyncStorage.setItem("token", response.data.token);
            Alert.alert("Login successful");
        } catch (error: any) {
            Alert.alert("Login failed", error.response?.data?.message || error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoQuick}>Quick</Text>
                <Text style={styles.logoBites}>Bites</Text>
            </View>
            <Text style={styles.logoSubtitle}>Because good things come to those who plan - morning, noon, and night.</Text>
            
            <Text style={styles.welcomeText}>Login</Text>
            <Text style={styles.welcomeSubtext}>Welcome! Please fill in the details to get started.</Text>
            
            <Text style={styles.label}>Email or Username</Text>
            <TextInput 
                style={styles.input}
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
            />
            
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput 
                    style={styles.passwordInput}
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry={!showPassword} 
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.loginButton} 
                onPress={login}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../assets/google-icon.png')} style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../assets/facebook-icon.png')} style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't you have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signupLink}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
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
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        fontSize: 14,
    },
    welcomeText: {
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 24,
        marginBottom: 8,
    },
    welcomeSubtext: {
        color: '#666',
        marginBottom: 24,
    },
    label: {
        marginBottom: 8,
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
        paddingRight: 12,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
    },
    loginButton: {
        backgroundColor: '#C17F12',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#666',
    },
    socialButton: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    socialButtonText: {
        color: '#000',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#666',
    },
    signupLink: {
        color: '#C17F12',
        fontWeight: '600',
    },
});

export default LoginScreen;
