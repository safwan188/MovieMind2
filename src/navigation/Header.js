import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { UserContext } from "../context/UserContext"; // Import UserContext
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const Header = ({ title, icon }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout } = useContext(UserContext); // Access logout function from UserContext
  const navigation = useNavigation(); // Get navigation object

  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from UserContext
      Alert.alert("Logged out", "You have been logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleDeleteAccount = () => {
    navigation.navigate("DeleteAccount"); // Navigate to DeleteAccount screen
  };

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Icon name={icon || "film"} size={24} color="#60a5fa" />
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name="user" size={24} color="#60a5fa" />
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Icon name="log-out" size={18} color="#60a5fa" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount} style={styles.menuItem}>
              <Icon name="trash" size={18} color="#ff5252" style={styles.menuIcon} />
              <Text style={[styles.menuItemText, { color: "#ff5252" }]}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "System",
  },
  headerIcons: {
    flexDirection: "row",
    position: 'relative',
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
    minWidth: 120,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#60a5fa",
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "System",
    fontWeight: "bold",
  },
});

export default Header;
