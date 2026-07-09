"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { AuthProvider, useAuth } from "./src/context/AuthContext"

// Screens
import HomeScreen from "./src/screens/HomeScreen"
import CoursesScreen from "./src/screens/CoursesScreen"
import LevelsScreen from "./src/screens/LevelsScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import LessonScreen from "./src/screens/LessonScreen"
import CourseDetailScreen from "./src/screens/CourseDetailScreen"
import ProgressScreen from "./src/screens/ProgressScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#f8fafc" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline"
              break
            case "Courses":
              iconName = focused ? "book" : "book-outline"
              break
            case "Levels":
              iconName = focused ? "school" : "school-outline"
              break
            case "Profile":
              iconName = focused ? "person" : "person-outline"
              break
            default:
              iconName = "help-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="Courses" component={CoursesScreen} options={{ title: "Cursos" }} />
      <Tab.Screen name="Levels" component={LevelsScreen} options={{ title: "Niveles" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{
          title: "Detalles del Curso",
          headerStyle: { backgroundColor: "#16a34a" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={{
          title: "Lección",
          headerStyle: { backgroundColor: "#16a34a" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: "Mi Progreso",
          headerStyle: { backgroundColor: "#16a34a" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack.Navigator>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ display: 'none' }}></div> // Fallback invisible
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
