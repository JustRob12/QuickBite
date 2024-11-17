import React, { useState, useCallback, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import BottomTabNavigator from './navigation/BottomTabNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { View, Animated, Dimensions } from 'react-native';
import SideMenu from './components/SideMenu';

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
    const [showSideMenu, setShowSideMenu] = useState(false);
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

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

    const handleCloseSideMenu = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: Dimensions.get('window').width,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setShowSideMenu(false);
        });
    };

    const handleLogout = () => {
        handleCloseSideMenu();
        setUserName("");
        // Navigate to Login screen
    };

    React.useEffect(() => {
        if (showSideMenu) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [showSideMenu]);

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
                        {(props) => (
                            <BottomTabNavigator 
                                {...props} 
                                userName={userName}
                                setShowSideMenu={setShowSideMenu} 
                            />
                        )}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>

            <SideMenu
                name={userName}
                isVisible={showSideMenu}
                onClose={handleCloseSideMenu}
                onLogout={handleLogout}
                slideAnim={slideAnim}
                fadeAnim={fadeAnim}
            />
        </View>
    );
};

export default App;