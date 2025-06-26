"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import MainNavigation from "@/components/MainNavigation";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register, login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!rol) {
      setError("Por favor, selecciona un rol (estudiante o docente).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, verifica que ambas sean iguales.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(name, email, password, rol);
      
      if (success) {
        // Registro exitoso
        if (rol === 'docente') {
          try {
            toast({
              title: "Registro exitoso",
              description: "Tu cuenta está pendiente de aprobación por el administrador. Recibirás una notificación por email cuando sea aprobada.",
            });
          } catch (toastError) {
            console.error('Error al mostrar toast:', toastError);
          }
          // Mostrar mensaje de éxito en lugar de redirigir
          setRegistrationSuccess(true);
        } else {
          // Login automático para estudiantes
          try {
            const loginSuccess = await login(email, password);
            if (loginSuccess) {
              router.push('/perfil/estudiante');
            } else {
              setError("Error al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.");
              router.push('/login');
            }
          } catch (loginError) {
            setError("Error al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.");
            router.push('/login');
          }
        }
      } else {
        setError("Error al crear la cuenta. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError("Error al crear la cuenta. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {registrationSuccess ? "¡Registro Exitoso!" : "Crear Cuenta"}
              </CardTitle>
              <CardDescription>
                {registrationSuccess 
                  ? "Tu cuenta está pendiente de aprobación"
                  : "Únete a Freenglish y comienza tu viaje de aprendizaje"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {registrationSuccess ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      ¡Bienvenido a Freenglish!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tu cuenta de docente está pendiente de aprobación por el administrador. 
                      Recibirás una notificación por email cuando sea aprobada o rechazada.
                    </p>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => router.push('/login')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Ir al Login
                      </Button>
                      <Button 
                        onClick={() => {
                          setRegistrationSuccess(false);
                          setName("");
                          setEmail("");
                          setPassword("");
                          setConfirmPassword("");
                          setRol("");
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Registrar otra cuenta
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                    <Input 
                      type="text" 
                      placeholder="Tu nombre completo" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                    <Input 
                      type="email" 
                      placeholder="tu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Rol</label>
                    <Select value={rol} onValueChange={setRol} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estudiante">Estudiante</SelectItem>
                        <SelectItem value="docente">Docente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Mínimo 6 caracteres" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Repite tu contraseña" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              )}
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">¡Registro 100% Gratuito!</h4>
                    <p className="text-sm text-green-700">
                      Al registrarte obtienes acceso completo a todos los cursos, docentes y certificados sin costo alguno.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-sm text-gray-600 mt-6">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-green-600 hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 