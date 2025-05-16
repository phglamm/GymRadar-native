import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
    const [fullName, setFullName] = useState('Madison Smith');
    const [email, setEmail] = useState('madisons@example.com');
    const [mobileNumber, setMobileNumber] = useState('+123 567 89000');
    const [dob, setDob] = useState('01 / 04 / 199X');
    const [weight, setWeight] = useState('75 Kg');
    const [height, setHeight] = useState('1.65 CM');

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
            <View style={styles.gradientWrapper}>
                <LinearGradient
                    colors={["#FF914D", "#ED2A46"]}
                    style={styles.linearGradient}
                >
                    <View style={styles.profileCard}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                            style={styles.avatar}
                        />
                        <Text style={styles.name}>Madison Smith</Text>
                        <Text style={styles.email}>madisons@example.com</Text>
                        <Text style={styles.birthday}>
                            <Text style={{ fontWeight: 'bold' }}>Birthday: </Text>
                            April 1st
                        </Text>
                    </View>

                    <View style={styles.statsCard}>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>{weight}</Text>
                            <Text style={styles.infoLabel}>Weight</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>28</Text>
                            <Text style={styles.infoLabel}>Years Old</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>{height}</Text>
                            <Text style={styles.infoLabel}>Height</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Form */}
            <View style={styles.form}>
                <Text style={styles.label}>Full name</Text>
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Full name"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                    style={styles.input}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Date of birth</Text>
                <TextInput
                    style={styles.input}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="Date of birth"
                />

                <Text style={styles.label}>Weight</Text>
                <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Weight"
                />

                <Text style={styles.label}>Height</Text>
                <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    placeholder="Height"
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Cập nhật</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    gradientWrapper: {
        // marginHorizontal: 16,
        // marginTop: 16,
        // borderRadius: 10,
        overflow: 'visible', // để phần đè chồng hiện ra ngoài
        position: 'relative',
        // elevation shadow cho iOS:
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4, // Android shadow
    },
    linearGradient: {
        paddingTop: 40,
        paddingBottom: 60, // thêm padding dưới đủ để chứa card đè chồng
        // borderRadius: 10,
        width: '100%',
        position: 'relative',
    },
    profileCard: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        width: '100%',
        zIndex: 1,
    },
    avatar: {
        width: `120`,
        height: `120`,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 12,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff',
    },
    email: {
        fontSize: 15,
        color: '#fff',
        marginBottom: 4,
    },
    birthday: {
        fontSize: 15,
        color: '#fff',
        marginBottom: 16,
    },
    statsCard: {
        position: 'absolute',
        bottom: -40,  // đè lên dưới đáy profileCard
        left: 0,
        right: 0,
        marginHorizontal: 16,
        backgroundColor: '#ED2A46',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        zIndex: 2,
    },

    divider: {
        width: 1,
        backgroundColor: '#fff',
        marginVertical: 8,
    },

    infoBox: {
        alignItems: 'center',
    },
    infoValue: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
    },
    infoLabel: {
        fontSize: 12,
        color: '#fff',
    },
    form: {
        marginHorizontal: 16,
        marginTop: 50, // cách xa card đè chồng tránh bị đè lên form
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        elevation: 1,
        shadowColor: '#fff',
    },
    label: {
        fontSize: 13,
        color: '#ED2A46',
        marginBottom: 6,
        marginTop: 10,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#C8C8C8',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#000',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#FF914D',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 2,
            width: 200,        // Giảm chiều rộng nút lại
    alignSelf: 'center' // Căn giữa nút theo chiều ngang
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default ProfileScreen;
