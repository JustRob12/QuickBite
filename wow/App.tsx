import React, { useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import { useFonts } from 'expo-font';
import { View } from 'react-native';



type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    const [fontsLoaded] = useFonts({
        'PlusJakartaSans-Regular': require('./assets/fonts/PlusJakartaSans-Regular.ttf'),
        'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
        'PlusJakartaSans-ExtraBold': require('./assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
         
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
};

export default App;
