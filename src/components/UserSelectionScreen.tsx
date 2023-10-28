/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
// UserSelectionScreen.tsx:
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, FlatList, SafeAreaView } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';


type UserSelectionScreenRoutePorp = RouteProp<RootStackParamList, 'UserSelectionScreen'>;
type UserSelectionScreenNavigationProp = NavigationProp<RootStackParamList, 'UserSelectionScreen'>;

type Props = {
    route: UserSelectionScreenRoutePorp;
    navigation: UserSelectionScreenNavigationProp;
}

const UserSelectionScreen: React.FC<Props> = ({ route, navigation }) => {

    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const usersSnapshot = await firestore().collection('users').get();
            const userEmails = usersSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().email }));
            setUsers(userEmails);
        };

        fetchData();
    }, []);

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const onSelectedUsersChange = (selectedItems: string[]) => {
        console.log('Selected items:', selectedItems);
        setSelectedUsers(selectedItems);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={() => null} // jostain syystä tämä vaaditaan
                ListHeaderComponent={
                    <View>
                        <Text style={styles.title}>           Valitse työntekijät</Text>
                        <View style={styles.multiSelectContainer}>
                            <MultiSelect
                                items={users}
                                selectText="Valitse"
                                selectedText="Valittu"
                                uniqueKey="id"
                                onSelectedItemsChange={onSelectedUsersChange}
                                selectedItems={selectedUsers}
                            />
                        </View>
                    </View>
                }
                ListFooterComponent={
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            console.log('users:', selectedUsers);
                            navigation.navigate('ReportScreen', {
                                selectedUsers: selectedUsers,
                            });
                        }}>
                        <Text style={styles.buttonText}>Siirry valitsemaan aikaväli</Text>
                    </TouchableOpacity>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#40E0D0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    multiSelectContainer: {
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#888',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        height: 50,
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
        paddingHorizontal: 20,
    },
});

export default UserSelectionScreen;
