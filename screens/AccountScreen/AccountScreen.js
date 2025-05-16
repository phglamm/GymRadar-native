import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const AccountScreen = () => {
    const [fullName, setFullName] = useState('Madison Smith');
    const [nickname, setNickname] = useState('Madison');
    const [email, setEmail] = useState('madisons@example.com');
    const [mobileNumber, setMobileNumber] = useState('+123 567 89000');

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={{ paddingTop: 60 }}>
                <LinearGradient
                    colors={["#FF914D", "#ED2A46"]}
                    style={styles.linearGradient}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                            }}
                            style={styles.avatar}
                        />
                        {/* <TouchableOpacity style={styles.editIconContainer}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity> */}
                    </View>
                </LinearGradient>

                <View style={styles.form}>
                    <Text style={styles.label}>Full name</Text>
                    <TextInput
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.input}
                        placeholder="Full name"
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Nickname</Text>
                    <TextInput
                        value={nickname}
                        onChangeText={setNickname}
                        style={styles.input}
                        placeholder="Nickname"
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Mobile Number</Text>
                    <TextInput
                        value={mobileNumber}
                        onChangeText={setMobileNumber}
                        style={styles.input}
                        placeholder="Mobile Number"
                        keyboardType="phone-pad"
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity style={styles.updateButton}>
                        <Text style={styles.updateButtonText}>Cập nhật</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.changePasswordButton}>
                        <Icon name="key" size={18} color="#999" style={{ marginRight: 6 }} />
                        <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    avatarContainer: {
        backgroundColor: 'linear-gradient(180deg, #FF764B 0%, #ED2A46 100%)', // giả lập gradient background
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#fff',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 20,
        right: 150,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    editIcon: {
        fontSize: 18,
        color: '#555',
    },
    form: {
        paddingHorizontal: 15,
        marginTop: 25,
    },
    label: {
        color: '#ED2A46',
        marginBottom: 6,
        fontWeight: 'bold',
    },
    input: {
        height: 38,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: '#000',
    },
updateButton: {
    backgroundColor: '#FF7E34',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    width: 200,        // Giảm chiều rộng nút lại
    alignSelf: 'center' // Căn giữa nút theo chiều ngang
},

    updateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    changePasswordButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    changePasswordText: {
        color: '#999',
        fontSize: 14,
    },


});

export default AccountScreen;
