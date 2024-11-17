import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SideMenuProps = {
    name: string;
    isVisible: boolean;
    onClose: () => void;
    onLogout: () => void;
    slideAnim: Animated.Value;
    fadeAnim: Animated.Value;
};

const SideMenu = ({ name, isVisible, onClose, onLogout, slideAnim, fadeAnim }: SideMenuProps) => {
    if (!isVisible) return null;

    return (
        <View style={styles.modalOverlay}>
            <Animated.View 
                style={[
                    styles.modalBackground,
                    {
                        opacity: fadeAnim
                    }
                ]}
            >
                <TouchableOpacity 
                    style={styles.modalBackgroundTouch}
                    activeOpacity={1}
                    onPress={onClose}
                />
            </Animated.View>
            <Animated.View 
                style={[
                    styles.sideMenu,
                    {
                        transform: [{ translateX: slideAnim }]
                    }
                ]}
            >
                <View style={styles.menuHeader}>
                    <Text style={styles.menuGreeting}>Hello</Text>
                    <Text style={styles.menuName}>{name}</Text>
                </View>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="person-outline" size={20} color="#000" />
                    <Text style={styles.menuText}>Edit Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={20} color="#000" />
                    <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="notifications-outline" size={20} color="#000" />
                    <Text style={styles.menuText}>Notification Settings</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="color-palette-outline" size={20} color="#000" />
                    <Text style={styles.menuText}>Appearance</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="share-social-outline" size={20} color="#000" />
                    <Text style={styles.menuText}>Share App</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={onLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color="#000" />
                    <Text style={styles.menuText}>Logout</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    modalBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackgroundTouch: {
        flex: 1,
    },
    sideMenu: {
        width: Dimensions.get('window').width * 0.75,
        backgroundColor: 'white',
        paddingTop: 50,
        paddingHorizontal: 15,
        position: 'absolute',
        right: 0,
        height: '100%',
    },
    menuHeader: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
    menuGreeting: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PlusJakartaSans-Regular',
    },
    menuName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'PlusJakartaSans-Bold',
        marginTop: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
    },
    menuText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#000',
        fontFamily: 'PlusJakartaSans-Regular',
    },
});

export default SideMenu; 