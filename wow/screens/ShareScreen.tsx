import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ShareScreenProps = {
    name: string;
    navigation: any;
};

const ShareScreen: React.FC<ShareScreenProps> = ({ name, navigation }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showDropdown) {
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
        } else {
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
            ]).start();
        }
    }, [showDropdown]);

    const handleClose = () => {
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
            setShowDropdown(false);
        });
    };

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.hello}>Hello</Text>
                    <Text style={styles.name}>
                        {name}
                        <Text style={styles.wave}> 👋</Text>
                    </Text>
                    <Text style={styles.subtitle}>Share your Plan and Shopping List</Text>
                </View>
                
                <View style={styles.userSection}>
                    <TouchableOpacity 
                        style={styles.userIconContainer}
                        onPress={() => setShowDropdown(true)}
                    >
                        <Ionicons name="person-circle-outline" size={32} color="#B8860B" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.shareContainer}>
                <TouchableOpacity style={styles.shareButton}>
                    <Text style={styles.shareButtonText}>Share your Calendar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <Text style={styles.shareButtonText}>Share your List</Text>
                </TouchableOpacity>
            </View>

            {showDropdown && (
                <Modal
                    transparent={true}
                    visible={showDropdown}
                    animationType="none"
                    onRequestClose={handleClose}
                >
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
                                onPress={handleClose}
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
                                onPress={handleLogout}
                            >
                                <Ionicons name="log-out-outline" size={20} color="#000" />
                                <Text style={styles.menuText}>Logout</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    welcomeSection: {
        flex: 1,
    },
    userSection: {
        position: 'relative',
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
        zIndex: 1,
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
    },
    shareContainer: {
        backgroundColor: '#FFD580',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    shareButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    shareButtonText: {
        fontSize: 16,
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
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

export default ShareScreen; 