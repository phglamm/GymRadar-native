import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const PTProfileScreen = () => {
  const ratings = [
    {
      id: 1,
      username: 'nhật linh',
      rating: 5,
      comment: 'đẹp trai',
      time: '12-3-2024 17:01',
    },
    {
      id: 2,
      username: 'dương gia hân',
      rating: 5,
      comment: 'đẹp trai',
      time: '12-3-2024 17:30',
    },
    {
      id: 3,
      username: 'thảo vi',
      rating: 5,
      comment: 'đẹp trai',
      time: '12-3-2024 17:20',
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 20, paddingHorizontal: 0, backgroundColor: '#fff' }}>
      <LinearGradient colors={['#FF914D', '#ED2A46']} style={styles.gradientContainer}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://i.pinimg.com/736x/9c/fc/84/9cfc843ef54e07f9a19b95f4b264db3e.jpg',
            }}
            style={styles.avatar}
          />
        </View>

        {/* Name */}
        <Text style={styles.name}>Harry Potter</Text>

        {/* Info row */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="gender-male" size={20} color="#fff" />
          <Text style={styles.infoText}>Nam - 24 Tuổi</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="weight-lifter" size={20} color="#fff" />
          <Text style={styles.infoText}>Tăng Cân Tăng Cơ</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="timer-sand" size={20} color="#fff" />
          <Text style={styles.infoText}>4 Năm Kinh Nghiệm</Text>
        </View>
      </LinearGradient>

      {/* Introduction */}
      <View style={styles.introContainer}>
        <Text style={styles.introTitle}>Giới thiệu</Text>
        <Text style={styles.introText}>
          Tôi là huấn luyện viên với hơn 4 năm kinh nghiệm chuyên về phát triển sức mạnh và cơ bắp. Tôi đã giúp
          hơn 100 khách hàng đạt được mục tiêu thể hình của họ thông qua các chương trình tập luyện có nhân hóa và
          chế độ dinh dưỡng hợp lý.
        </Text>
      </View>

      {/* Ratings */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Đánh giá ({ratings.length})</Text>
        {ratings.map((item) => (
          <View key={item.id} style={styles.ratingItem}>
            <Text style={styles.username}>{item.username}</Text>
            <View style={styles.starRow}>
              {Array.from({ length: 5 }).map((_, index) => (
                <MaterialCommunityIcons
                  key={index}
                  name={index < item.rating ? 'star' : 'star-outline'}
                  size={18}
                  color="#FF914D"
                />
              ))}
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        ))}
      </View>

      {/* Price & Button */}
      <View style={styles.bottomBar}>
        <Text style={styles.price}>300.000đ / giờ</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Đặt lịch với Harry Potter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    width: '100%',           // Kéo full chiều ngang tràn viền
    paddingVertical: 50,     // Tăng chiều cao phần LinearGradient
    paddingHorizontal: 20,   // Padding trong, nếu cần
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  introContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  introTitle: {
    fontWeight: '700',
    color: '#ED2A46',
    fontSize: 18,
    marginBottom: 10,
  },
  introText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 22,
  },
  ratingContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
  },
  ratingTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 15,
    color: '#ED2A46',
  },
  ratingItem: {
    marginBottom: 20,
  },
  username: {
    fontWeight: '700',
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  comment: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
  },
  time: {
    fontSize: 12,
    color: '#bbb',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginHorizontal: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ED2A46',
  },
  bookButton: {
    backgroundColor: '#ED2A46',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default PTProfileScreen;
