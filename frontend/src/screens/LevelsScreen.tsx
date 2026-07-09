"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

interface Level {
  id: string
  code: string
  title: string
  description: string
  features: string[]
  courses: number
  duration: string
  color: string[]
  isUnlocked: boolean
  progress: number
}

const levels: Level[] = [
  {
    id: "1",
    code: "A1-A2",
    title: "Principiante",
    description: "Perfecto para quienes empiezan desde cero con el inglés",
    features: [
      "Vocabulario básico (500+ palabras)",
      "Gramática fundamental",
      "Conversaciones simples",
      "Pronunciación básica",
      "Saludos y presentaciones",
    ],
    courses: 8,
    duration: "2-3 meses",
    color: ["#16a34a", "#15803d"],
    isUnlocked: true,
    progress: 85,
  },
  {
    id: "2",
    code: "B1-B2",
    title: "Intermedio",
    description: "Para estudiantes con conocimientos básicos que quieren avanzar",
    features: [
      "Vocabulario ampliado (2000+ palabras)",
      "Gramática intermedia",
      "Conversaciones fluidas",
      "Comprensión auditiva",
      "Escritura estructurada",
    ],
    courses: 12,
    duration: "4-6 meses",
    color: ["#ea580c", "#dc2626"],
    isUnlocked: true,
    progress: 45,
  },
  {
    id: "3",
    code: "C1-C2",
    title: "Avanzado",
    description: "Para alcanzar la fluidez completa y dominio del idioma",
    features: [
      "Vocabulario profesional (5000+ palabras)",
      "Gramática avanzada",
      "Inglés de negocios",
      "Preparación para exámenes",
      "Expresión nativa",
    ],
    courses: 15,
    duration: "6-8 meses",
    color: ["#7c3aed", "#6d28d9"],
    isUnlocked: false,
    progress: 0,
  },
]

export default function LevelsScreen({ navigation }: any) {
  const { user } = useAuth()

  const handleLevelPress = (level: Level) => {
    if (!level.isUnlocked) {
      return
    }
    navigation.navigate("Courses", { level: level.code.toLowerCase() })
  }

  const getCurrentUserLevel = () => {
    if (!user) return levels[0]
    return levels.find((level) => level.title.toLowerCase() === user.level.toLowerCase())
  }

  const currentLevel = getCurrentUserLevel()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Niveles de Aprendizaje</Text>
          <Text style={styles.subtitle}>Progresa paso a paso desde principiante hasta experto</Text>

          {currentLevel && (
            <View style={styles.currentLevelCard}>
              <LinearGradient colors={currentLevel.color} style={styles.currentLevelGradient}>
                <View style={styles.currentLevelContent}>
                  <Text style={styles.currentLevelLabel}>Tu nivel actual</Text>
                  <Text style={styles.currentLevelTitle}>
                    {currentLevel.code} - {currentLevel.title}
                  </Text>
                  <View style={styles.currentLevelProgress}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${currentLevel.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{currentLevel.progress}% completado</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Levels List */}
        <View style={styles.levelsContainer}>
          {levels.map((level, index) => (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelCard, !level.isUnlocked && styles.levelCardLocked]}
              onPress={() => handleLevelPress(level)}
              disabled={!level.isUnlocked}
            >
              <LinearGradient
                colors={level.isUnlocked ? level.color : ["#9ca3af", "#6b7280"]}
                style={styles.levelHeader}
              >
                <View style={styles.levelHeaderContent}>
                  <View style={styles.levelTitleContainer}>
                    <Text style={styles.levelCode}>{level.code}</Text>
                    <Text style={styles.levelTitle}>{level.title}</Text>
                  </View>
                  <View style={styles.levelStatus}>
                    {level.isUnlocked ? (
                      level.progress > 0 ? (
                        <View style={styles.progressIndicator}>
                          <Text style={styles.progressPercentage}>{level.progress}%</Text>
                        </View>
                      ) : (
                        <Ionicons name="play-circle" size={24} color="white" />
                      )
                    ) : (
                      <Ionicons name="lock-closed" size={24} color="white" />
                    )}
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.levelContent}>
                <Text style={styles.levelDescription}>{level.description}</Text>

                <View style={styles.levelInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="book-outline" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>{level.courses} cursos</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>{level.duration}</Text>
                  </View>
                </View>

                <Text style={styles.featuresTitle}>Lo que aprenderás:</Text>
                <View style={styles.featuresList}>
                  {level.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={level.isUnlocked ? level.color[0] : "#9ca3af"}
                      />
                      <Text style={[styles.featureText, !level.isUnlocked && styles.featureTextLocked]}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {level.progress > 0 && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarSmall}>
                      <View
                        style={[
                          styles.progressFillSmall,
                          {
                            width: `${level.progress}%`,
                            backgroundColor: level.color[0],
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.levelButton, !level.isUnlocked && styles.levelButtonLocked]}
                  onPress={() => handleLevelPress(level)}
                  disabled={!level.isUnlocked}
                >
                  <LinearGradient
                    colors={level.isUnlocked ? level.color : ["#e5e7eb", "#d1d5db"]}
                    style={styles.buttonGradient}
                  >
                    <Text style={[styles.buttonText, !level.isUnlocked && styles.buttonTextLocked]}>
                      {!level.isUnlocked ? "Bloqueado" : level.progress > 0 ? "Continuar" : "Comenzar"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Consejos para tu aprendizaje</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={20} color="#ea580c" />
            <Text style={styles.tipText}>
              Completa al menos una lección diaria para mantener tu racha de aprendizaje
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="people-outline" size={20} color="#16a34a" />
            <Text style={styles.tipText}>Practica con otros estudiantes en nuestra comunidad online</Text>
          </View>
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
    backgroundColor: "white",
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 22,
    marginBottom: 20,
  },
  currentLevelCard: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
  },
  currentLevelGradient: {
    padding: 20,
  },
  currentLevelContent: {
    alignItems: "center",
  },
  currentLevelLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginBottom: 5,
  },
  currentLevelTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  currentLevelProgress: {
    width: "100%",
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 3,
  },
  progressText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  levelsContainer: {
    padding: 20,
  },
  levelCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  levelCardLocked: {
    opacity: 0.7,
  },
  levelHeader: {
    padding: 20,
  },
  levelHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelTitleContainer: {
    flex: 1,
  },
  levelCode: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  levelTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  levelStatus: {
    alignItems: "center",
  },
  progressIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressPercentage: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  levelContent: {
    padding: 20,
  },
  levelDescription: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 15,
  },
  levelInfo: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 10,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  featureTextLocked: {
    color: "#9ca3af",
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBarSmall: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
  },
  progressFillSmall: {
    height: "100%",
    borderRadius: 2,
  },
  levelButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  levelButtonLocked: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextLocked: {
    color: "#6b7280",
  },
  tipsSection: {
    padding: 20,
    paddingTop: 0,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
})
