import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FAQScreen() {
    const questions = [
        "[Cảnh báo lừa đảo] Làm sao để tránh các phòng Gym 'chéo kéo'?",
        "[Tạo tài khoản] Tại sao tôi không thể tạo tài khoản GymRadar bằng số điện thoại của mình?",
        "[Đổi PT] Làm sao để thay đổi huấn luyện viên PT sau khi đã kết nối qua AI?",
        "[Thanh toán] Làm sao để thanh toán gói GymRadar Premium?",
        "[Hủy dịch vụ] Làm sao để huỷ gói dịch vụ đã đặt trên GymRadar?",
        "[PT AI] AI của GymRadar sẽ giúc tôi như thế nào trong việc chọn những ai đáng để luyện tập?",
        "[Cập nhật thông tin] Làm sao để cập nhật thông tin như mục tiêu luyện tập trên GymRadar?",
        "[Hỗ trợ kỹ thuật] Tôi gặp vấn đề khi sử dụng Ứng dụng, làm sao để liên hệ với bộ phận hỗ trợ?",
        "[Gọi lịch] Làm sao để đặt lịch sớ gặp gỏ PT?",
        "[Lỗi tài khoản] Tôi không thể đăng nhập vào tài khoản, làm sao để khắc phục?",
    ];

    const renderQuestionText = (text) => {
        const match = text.match(/(\[.*?\])/);
        if (match) {
            const redPart = match[0];
            const restPart = text.replace(redPart, "").trim();
            return (
                <Text style={styles.questionText}>
                    <Text style={styles.redText}>{redPart} </Text>
                    <Text style={styles.blackText}>{restPart}</Text>
                </Text>
            );
        }
        return <Text style={styles.questionText}>{text}</Text>;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back" size={24} color="#ED2A46" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Câu hỏi thường gặp</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Search box */}
            <View style={styles.searchBox}>
                <Ionicons
                    name="search"
                    size={18}
                    color="#999"
                    style={{ marginHorizontal: 8 }}
                />
                <TextInput
                    placeholder="Tìm kiếm"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />
            </View>

            <ScrollView style={{ paddingHorizontal: 0 }}>
                <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>
                    Câu hỏi thường gặp
                </Text>

                {/* Khung chung cho danh sách câu hỏi - tràn viền */}
                <View style={styles.questionGroup}>
                    {questions.map((q, index) => (
                        <TouchableOpacity key={index} style={styles.questionItem}>
                            {renderQuestionText(q)}
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={{ alignItems: "center", marginVertical: 10 }}>
                        <Text style={{ color: "#ED2A46", fontWeight: "500" }}>Xem thêm</Text>
                    </TouchableOpacity>
                </View>

                {/* Liên hệ trợ giúp text */}
                <Text style={styles.contactHelpTitle}>Liên hệ trợ giúp</Text>

                {/* Khung hỗ trợ với gạch ngang nằm ngang giữa */}
                <View style={styles.supportBox}>
                    <TouchableOpacity style={styles.supportItem}>
                        <Ionicons
                            name="call"
                            size={18}
                            color="#ED2A46"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.supportText}>Gọi tổng đài GymRadar</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.supportItem}>
                        <Ionicons
                            name="chatbubble-ellipses"
                            size={18}
                            color="#ED2A46"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.supportText}>Nhắn tin cho CSKH GymRadar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5" },
    header: {
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#ED2A46" },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#D6EFF2",
        margin: 16,
        borderRadius: 12,
        paddingHorizontal: 8,
        height: 36,
    },
    searchInput: { flex: 1, fontSize: 14, color: "#000" },
    sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 10, color: "#444" },
    questionGroup: {
        backgroundColor: "#fff",
        // borderRadius: 12,
        paddingVertical: 8,
        marginHorizontal: 0,   // Tràn sát 2 bên
        marginBottom: 12,
        // Bỏ paddingHorizontal để tràn sát viền
        // paddingHorizontal: 0,
    },
    questionItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    questionText: {
        fontSize: 14,
        flex: 1,
    },
    redText: {
        color: "#ED2A46",
        fontWeight: "bold",
    },
    blackText: {
        color: "#000",
    },
    contactHelpTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
        paddingHorizontal: 24,
        marginBottom: 8,
    },
supportBox: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,  // giảm padding bên trong
    marginHorizontal: 16,   // tạo khoảng cách viền ngoài
    marginBottom: 30,
},

    supportItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    supportText: { fontSize: 14, color: "#444" },
    separator: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 8,
    },
});
