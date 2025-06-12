"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

const { width } = Dimensions.get("window")

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  color: string
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <View style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  )
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth()

  const features = [
    {
      icon: "book-outline" as keyof typeof Ionicons.glyphMap,
      title: "Lecciones Interactivas",
      description: "Aprende con lecciones dinámicas que se adaptan a tu ritmo",
      color: "#16a34a",
    },
    {
      icon: "headset-outline" as keyof typeof Ionicons.glyphMap,
      title: "Práctica de Pronunciación",
      description: "Mejora tu pronunciación con ejercicios de audio",
      color: "#ea580c",
    },
    {
      icon: "trophy-outline" as keyof typeof Ionicons.glyphMap,
      title: "Certificados Gratuitos",
      description: "Obtén certificados oficiales al completar niveles",
      color: "#dc2626",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={["#16a34a", "#ea580c"]} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>¡Hola{user ? `, ${user.name}` : ""}! 👋</Text>
            <Text style={styles.headerTitle}>Bienvenido a Freenglish</Text>
            <Text style={styles.headerSubtitle}>Aprende inglés gratis con la mejor plataforma educativa</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Estudiantes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1K+</Text>
            <Text style={styles.statLabel}>Lecciones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Acceso</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Courses")}>
              <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.actionGradient}>
                <Ionicons name="play" size={24} color="white" />
                <Text style={styles.actionText}>Continuar Aprendiendo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Levels")}>
              <LinearGradient colors={["#ea580c", "#dc2626"]} style={styles.actionGradient}>
                <Ionicons name="school" size={24} color="white" />
                <Text style={styles.actionText}>Explorar Niveles</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Por qué elegir Freenglish?</Text>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </View>

        {/* Progress */}
        {user && (
          <View style={styles.section}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>Tu Progreso</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Progress")}>
                <Text style={styles.viewAllText}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLevel}>Nivel: {user.level}</Text>
                <Text style={styles.progressStats}>
                  {user.coursesCompleted} cursos completados • {user.totalLessons} lecciones
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "65%" }]} />
              </View>
              <View style={styles.progressFooter}>
                <Text style={styles.progressText}>65% completado</Text>
                <View style={styles.streakContainer}>
                  <Ionicons name="flame" size={16} color="#ea580c" />
                  <Text style={styles.streakText}>{user.streak} días</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Daily Challenge */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desafío Diario</Text>
          <TouchableOpacity style={styles.challengeCard}>
            <View style={styles.challengeIcon}>
              <Ionicons name="flash" size={24} color="#fbbf24" />
            </View>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>Vocabulario del Día</Text>
              <Text style={styles.challengeDescription}>Aprende 5 palabras nuevas en inglés</Text>
              <Text style={styles.challengeReward}>+50 puntos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
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
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    color: "white",
    marginBottom: 8,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  quickActions: {
    gap: 15,
  },
  actionButton: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 12,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    color: "#16a34a",
    fontSize: 14,
    fontWeight: "600",
  },
  progressCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressInfo: {
    marginBottom: 15,
  },
  progressLevel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  progressStats: {
    fontSize: 14,
    color: "#6b7280",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#16a34a",
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    color: "#6b7280",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    color: "#ea580c",
    fontWeight: "600",
  },
  challengeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  challengeReward: {
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "600",
  },
})
