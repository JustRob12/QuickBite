import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, ScrollView, Dimensions, Animated } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CalendarStrip from 'react-native-calendar-strip';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenProps = {
    name: string;
    navigation: any;
    userId: string;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ name, navigation, userId }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showFullCalendar, setShowFullCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [meals, setMeals] = useState({ breakfast: '', lunch: '', dinner: '', snack: '' });
    const [markedDates, setMarkedDates] = useState({});
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

    useEffect(() => {
        if (selectedDate) {
            fetchMeals(selectedDate);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchMealDates();
    }, []);

    const fetchMeals = async (date: string) => {
        try {
            const response = await axios.get(
                `http://192.168.1.2:5000/api/meals/${date}?userId=${name}`
            );
            if (response.data) {
                setMeals(response.data.meals);
            } else {
                setMeals({ breakfast: '', lunch: '', dinner: '', snack: '' });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setMeals({ breakfast: '', lunch: '', dinner: '', snack: '' });
                return;
            }
            console.error('Error fetching meals:', error);
            setMeals({ breakfast: '', lunch: '', dinner: '', snack: '' });
        }
    };

    const fetchMealDates = async () => {
        try {
            const response = await axios.get(
                `http://192.168.1.2:5000/api/meals/dates?userId=${name}`
            );
            const dates = response.data;
            const marked = {};
            dates.forEach(date => {
                marked[date] = { 
                    marked: true, 
                    dotColor: '#B8860B',
                    selectedDotColor: '#B8860B'
                };
            });
            setMarkedDates(marked);
        } catch (error) {
            console.error('Error fetching meal dates:', error);
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

    const handleSaveMeals = async () => {
        try {
            await axios.post('http://192.168.1.2:5000/api/meals', {
                date: selectedDate,
                meals,
                userId: name
            });
            await fetchMealDates();
        } catch (error) {
            console.error('Error saving meals:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <View style={styles.welcomeSection}>
                        <Text style={styles.hello}>Hello</Text>
                        <Text style={styles.name}>
                            {name}
                            <Text style={styles.wave}> 👋</Text>
                        </Text>
                        <Text style={styles.subtitle}>What to Eat on this Day</Text>
                    </View>
                    
                    <View style={styles.userSection}>
                        <TouchableOpacity 
                            style={styles.userIconContainer}
                            onPress={() => setShowDropdown(!showDropdown)}
                        >
                            <Ionicons name="person-circle-outline" size={32} color="#B8860B" />
                        </TouchableOpacity>
                        
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
                </View>

                <View style={styles.calendarContainer}>
                    {showFullCalendar ? (
                        <Calendar
                            style={[styles.fullCalendar, { backgroundColor: 'transparent' }]}
                            theme={{
                                selectedDayBackgroundColor: '#B8860B',
                                todayTextColor: '#B8860B',
                                arrowColor: '#B8860B',
                                dotColor: '#B8860B',
                            }}
                            markedDates={{
                                ...markedDates,
                                [selectedDate]: {
                                    ...markedDates[selectedDate],
                                    selected: true,
                                    selectedColor: '#B8860B',
                                },
                            }}
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                            }}
                        />
                    ) : (
                        <CalendarStrip
                            style={[styles.calendar, { backgroundColor: 'transparent' }]}
                            calendarHeaderStyle={{ color: '#000' }}
                            dateNumberStyle={{ color: '#000' }}
                            dateNameStyle={{ color: '#000' }}
                            highlightDateNumberStyle={{ color: '#B8860B' }}
                            highlightDateNameStyle={{ color: '#B8860B' }}
                            markedDates={Object.keys(markedDates)}
                            markedDatesStyle={{ bottom: 4 }}
                            selectedDate={new Date()}
                            onDateSelected={(date) => {
                                setSelectedDate(date.format('YYYY-MM-DD'));
                            }}
                        />
                    )}
                    <TouchableOpacity
                        style={styles.calendarIcon}
                        onPress={() => setShowFullCalendar(!showFullCalendar)}
                    >
                        <Ionicons name="calendar-outline" size={24} color="#B8860B" />
                    </TouchableOpacity>
                </View>

                {selectedDate && (
                    <View style={styles.mealInputContainer}>
                        <View style={styles.inputWrapper}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="coffee" size={24} color="#000" />
                                <Text style={styles.inputLabel}>Breakfast</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={meals.breakfast}
                                onChangeText={(text) => setMeals({ ...meals, breakfast: text })}
                                placeholder="Add breakfast"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#000" />
                                <Text style={styles.inputLabel}>Lunch</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={meals.lunch}
                                onChangeText={(text) => setMeals({ ...meals, lunch: text })}
                                placeholder="Add lunch"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="food-turkey" size={24} color="#000" />
                                <Text style={styles.inputLabel}>Dinner</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={meals.dinner}
                                onChangeText={(text) => setMeals({ ...meals, dinner: text })}
                                placeholder="Add dinner"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="cookie" size={24} color="#000" />
                                <Text style={styles.inputLabel}>Snack</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={meals.snack}
                                onChangeText={(text) => setMeals({ ...meals, snack: text })}
                                placeholder="Add snack"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={handleSaveMeals}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    bottomPadding: {
        height: 80,
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
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 220,
        zIndex: 1,
    },
    dropdownHeader: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 8,
    },
    dropdownGreeting: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PlusJakartaSans-Regular',
    },
    dropdownName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'PlusJakartaSans-Bold',
        marginTop: 4,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
    },
    dropdownText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#000',
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
    calendarContainer: {
        marginTop: 0,
    },
    calendar: {
        height: 100,
        paddingTop: 10,
        paddingBottom: 10,
    },
    fullCalendar: {
        marginTop: 0,
    },
    calendarIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
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
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        fontFamily: 'PlusJakartaSans-Regular',
    },
    mealInputContainer: {
        marginTop: 20,
        paddingHorizontal: 0,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8DC',
        borderRadius: 15,
        marginBottom: 10,
        padding: 15,
        height: 60,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120,
    },
    inputLabel: {
        marginLeft: 12,
        fontSize: 16,
        color: '#000',
        fontFamily: 'PlusJakartaSans-Regular',
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#B8860B',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'PlusJakartaSans-Bold',
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

export default HomeScreen;