"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar Sesión", style: "destructive", onPress: logout },
    ])
  }

  const menuItems = [
    {
      icon: "person-outline",
      title: "Editar Perfil",
      subtitle: "Actualiza tu información personal",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "bar-chart-outline",
      title: "Mi Progreso",
      subtitle: "Ve tu progreso detallado",
      onPress: () => navigation.navigate("Progress"),
    },
    {
      icon: "trophy-outline",
      title: "Logros",
      subtitle: "Tus certificados y medallas",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "notifications-outline",
      title: "Notificaciones",
      subtitle: "Configura tus recordatorios",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "help-circle-outline",
      title: "Ayuda y Soporte",
      subtitle: "Obtén ayuda cuando la necesites",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "settings-outline",
      title: "Configuración",
      subtitle: "Personaliza tu experiencia",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
  ]

  if (!user) {
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient colors={["#16a34a", "#ea580c"]} style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Nivel {user.level}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user.coursesCompleted}</Text>
            <Text style={styles.statLabel}>Cursos Completados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user.totalLessons}</Text>
            <Text style={styles.statLabel}>Lecciones</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user.streak}</Text>
            <Text style={styles.statLabel}>Días de Racha</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={24} color="#16a34a" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Freenglish v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 Freenglish. Todos los derechos reservados.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 30,
    paddingTop: 20,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 15,
  },
  levelBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
  menuContainer: {
    margin: 20,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  logoutContainer: {
    margin: 20,
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    marginLeft: 8,
  },
  appInfo: {
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  appInfoText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
})
