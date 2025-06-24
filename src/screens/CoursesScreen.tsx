"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

interface Course {
  id: string
  title: string
  description: string
  level: "principiante" | "intermedio" | "avanzado"
  lessons: number
  duration: string
  image: string
  progress: number
  rating: number
  students: number
  instructor: string
}

export default function CoursesScreen({ navigation }: any) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("todos")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCourses([])
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "principiante":
        return "#16a34a"
      case "intermedio":
        return "#ea580c"
      case "avanzado":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  const getLevelGradient = (level: string) => {
    switch (level) {
      case "principiante":
        return ["#16a34a", "#15803d"]
      case "intermedio":
        return ["#ea580c", "#dc2626"]
      case "avanzado":
        return ["#dc2626", "#b91c1c"]
      default:
        return ["#6b7280", "#4b5563"]
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === "todos" || course.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  const levels = [
    { key: "todos", label: "Todos" },
    { key: "principiante", label: "Principiante" },
    { key: "intermedio", label: "Intermedio" },
    { key: "avanzado", label: "Avanzado" },
  ]

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Cargando cursos...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Cursos Disponibles</Text>
        <Text style={styles.subtitle}>Encuentra el curso perfecto para ti</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Level Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[styles.filterButton, selectedLevel === level.key && styles.filterButtonActive]}
              onPress={() => setSelectedLevel(level.key)}
            >
              <Text style={[styles.filterText, selectedLevel === level.key && styles.filterTextActive]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Courses List */}
      <ScrollView style={styles.coursesContainer} showsVerticalScrollIndicator={false}>
        {filteredCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => navigation.navigate("CourseDetail", { course })}
          >
            <Image source={{ uri: course.image }} style={styles.courseImage} />

            {course.progress > 0 && (
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{course.progress}%</Text>
              </View>
            )}

            <View style={styles.courseContent}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {course.title}
                </Text>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) }]}>
                  <Text style={styles.levelText}>{course.level}</Text>
                </View>
              </View>

              <Text style={styles.courseDescription} numberOfLines={2}>
                {course.description}
              </Text>

              <View style={styles.courseInfo}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="person-outline" size={14} color="#6b7280" />
                    <Text style={styles.infoText}>{course.instructor}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <Text style={styles.infoText}>{course.rating}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="book-outline" size={14} color="#6b7280" />
                    <Text style={styles.infoText}>{course.lessons} lecciones</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={14} color="#6b7280" />
                    <Text style={styles.infoText}>{course.duration}</Text>
                  </View>
                </View>
              </View>

              {course.progress > 0 ? (
                <TouchableOpacity style={styles.continueButton}>
                  <LinearGradient colors={getLevelGradient(course.level)} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Continuar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.startButton}>
                  <LinearGradient colors={getLevelGradient(course.level)} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Comenzar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#1f2937",
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: "#16a34a",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  filterTextActive: {
    color: "white",
  },
  coursesContainer: {
    flex: 1,
    padding: 20,
  },
  courseCard: {
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
  courseImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  progressBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  courseContent: {
    padding: 20,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    marginRight: 10,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  courseDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 15,
    lineHeight: 20,
  },
  courseInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  continueButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  startButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
})
