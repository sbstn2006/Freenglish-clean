"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un email válido")
      return
    }

    setLoading(true)
    const success = await login(email, password)
    setLoading(false)

    if (!success) {
      Alert.alert(
        "Error de Autenticación",
        "Credenciales incorrectas. Usa:\nEmail: demo@freenglish.com\nContraseña: demo123",
      )
    }
  }

  const handleDemoLogin = () => {
    setEmail("demo@freenglish.com")
    setPassword("demo123")
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <LinearGradient colors={["#16a34a", "#ea580c"]} style={styles.gradient}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>🌍</Text>
                <Text style={styles.logoText}>Freenglish</Text>
              </View>
              <Text style={styles.tagline}>Aprende inglés gratis</Text>
              <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Iniciar Sesión</Text>

              {/* Demo Account Info */}
              <TouchableOpacity style={styles.demoCard} onPress={handleDemoLogin}>
                <View style={styles.demoIcon}>
                  <Ionicons name="information-circle" size={20} color="#16a34a" />
                </View>
                <View style={styles.demoContent}>
                  <Text style={styles.demoTitle}>Cuenta Demo</Text>
                  <Text style={styles.demoText}>Toca aquí para usar credenciales de prueba</Text>
                </View>
              </TouchableOpacity>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.buttonGradient}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.buttonText}>Iniciando...</Text>
                    </View>
                  ) : (
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color="#ea4335" />
                <Text style={styles.socialButtonText}>Continuar con Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={20} color="#1877f2" />
                <Text style={styles.socialButtonText}>Continuar con Facebook</Text>
              </TouchableOpacity>

              {/* Register Link */}
              <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerText}>
                  ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate gratis</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16a34a",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    fontSize: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 25,
  },
  demoCard: {
    flexDirection: "row",
    backgroundColor: "#f0fdf4",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  demoIcon: {
    marginRight: 12,
  },
  demoContent: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16a34a",
    marginBottom: 2,
  },
  demoText: {
    fontSize: 12,
    color: "#15803d",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f9fafb",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#1f2937",
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#16a34a",
    fontWeight: "500",
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: "#6b7280",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "white",
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  registerTextBold: {
    fontWeight: "600",
    color: "#16a34a",
  },
})
