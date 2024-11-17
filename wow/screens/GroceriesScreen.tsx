import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, Alert, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRef } from 'react';

type GroceriesScreenProps = {
    name: string;
    navigation: any;
    setShowSideMenu: (show: boolean) => void;
};

const GroceriesScreen: React.FC<GroceriesScreenProps> = ({ name, navigation, setShowSideMenu }) => {
    const [newItem, setNewItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [items, setItems] = useState<{ name: string; quantity: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchItems();
    }, []);

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

    const fetchItems = async () => {
        try {
            console.log('Fetching items for user:', name);
            const response = await axios.get(`http://192.168.1.2:5000/api/groceries/${name}`);
            console.log('Fetch response:', response.data);
            
            const latestGroceryList = response.data[0];
            setItems(latestGroceryList ? latestGroceryList.items : []);
        } catch (error) {
            console.error('Failed to fetch items:', error.response?.data || error);
            // Show error to user (you might want to add some UI feedback here)
        }
    };

    const handleAddItem = async () => {
        if (newItem && quantity) {
            try {
                const numericQuantity = parseInt(quantity, 10);
                
                console.log('Sending request:', {
                    userId: name,
                    items: [{ name: newItem, quantity: numericQuantity }]
                });

                const response = await axios.post('http://192.168.1.2:5000/api/groceries', {
                    userId: name,
                    items: [{ name: newItem, quantity: numericQuantity }]
                });

                console.log('Response:', response.data);
                setItems(response.data.items);
                setNewItem('');
                setQuantity('');
                setModalVisible(false);
            } catch (error) {
                console.error('Failed to add item:', error.response?.data || error);
                Alert.alert('Error', 'Failed to add item');
            }
        } else {
            Alert.alert('Error', 'Item name and quantity are required');
        }
    };

    const handleLogout = () => {
        navigation.navigate('Login');
    };

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

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.hello}>Hello</Text>
                    <Text style={styles.name}>
                        {name}
                        <Text style={styles.wave}> 👋</Text>
                    </Text>
                    <Text style={styles.subtitle}>What to Buy on Grocery</Text>
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

            <Text style={styles.content}>Create your Shopping List</Text>

            <FlatList
                data={items}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle-outline" size={50} color="#B8860B" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Item</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Item Name"
                            value={newItem}
                            onChangeText={setNewItem}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity"
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddItem}>
                            <Text style={styles.saveButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
    content: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFD580',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
    },
    itemText: {
        fontSize: 16,
        color: '#000',
    },
    itemQuantity: {
        fontSize: 16,
        color: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#B8860B',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
    },
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

export default GroceriesScreen;