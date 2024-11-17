import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import GroceriesScreen from '../screens/GroceriesScreen';
import ShareScreen from '../screens/ShareScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ route, navigation }) => {
    const { name } = route.params; // Get the userName from route params

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'AddFood') {
                        iconName = 'silverware-fork-knife';
                    } else if (route.name === 'Groceries') {
                        iconName = 'cart-outline';
                    } else if (route.name === 'Share') {
                        iconName = 'share-outline';
                    }

                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#B8860B',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="AddFood">
                {() => <HomeScreen name={name} navigation={navigation} />}
            </Tab.Screen>
            <Tab.Screen name="Groceries">
                {() => <GroceriesScreen name={name} navigation={navigation} />}
            </Tab.Screen>
            <Tab.Screen name="Share">
                {() => <ShareScreen name={name} navigation={navigation} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default BottomTabNavigator; 