import React, { useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: { userName: string } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    const [userName, setUserName] = useState<string>("");
    const [fontsLoaded] = useFonts({
        'PlusJakartaSans-Regular': require('./assets/fonts/PlusJakartaSans-Regular.ttf'),
        'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
        'PlusJakartaSans-ExtraBold': require('./assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen 
                        name="Login" 
                        options={{ headerShown: false }}
                    >
                        {(props) => <LoginScreen {...props} setUserName={setUserName} />}
                    </Stack.Screen>
                    <Stack.Screen 
                        name="Register" 
                        component={RegisterScreen} 
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen 
                        name="Home" 
                        options={{ headerShown: false }}
                    >
                        {(props) => <HomeScreen {...props} name={userName} />}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
};

export default App;