import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

type HomeScreenProps = {
    name: string;
    navigation: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ name, navigation }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        // Add your logout logic here
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.userIconContainer}
                    onPress={() => setShowDropdown(!showDropdown)}
                >
                    <Ionicons name="person-circle-outline" size={32} color="#B8860B" />
                </TouchableOpacity>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity 
                            style={styles.dropdownItem}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#000" />
                            <Text style={styles.dropdownText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Text style={styles.hello}>Hello</Text>
            <Text style={styles.name}>
                {name}
                <Text style={styles.wave}> 👋</Text>
            </Text>
            <Text style={styles.subtitle}>What to Eat on this Day</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    userIconContainer: {
        padding: 5,
    },
    dropdown: {
        position: 'absolute',
        top: 45,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 120,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    dropdownText: {
        marginLeft: 8,
        fontSize: 16,
        fontFamily: 'PlusJakartaSans-Regular',
    },
    hello: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans-Bold',
        marginTop: 40,
    },
    name: {
        fontSize: 30,
        fontFamily: 'PlusJakartaSans-ExtraBold',
        color: '#B8860B',
        marginVertical: 0,
    },
    wave: {
        fontSize: 25,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans-Regular',
        marginTop: 0,
    }
});

export default HomeScreen;