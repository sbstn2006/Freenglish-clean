"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import MainNavigation from "@/components/MainNavigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const getUserRole = (email: string) => {
    const lower = email.toLowerCase();
    if (lower.includes('admin') || lower.includes('administrador')) return 'admin';
    if (lower.includes('docente') || lower.includes('teacher')) return 'docente';
    return 'estudiante';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loggedUser = await login(email, password);
      
      if (loggedUser) {
        // Login exitoso para usuarios activos
        if (loggedUser.rol === 'admin') {
          router.push('/admin');
        } else if (loggedUser.rol === 'docente') {
          router.push('/perfil/docente');
        } else {
          router.push('/perfil/estudiante');
        }
      } else {
        // Si el login retorna null, puede ser docente pendiente o credenciales incorrectas
        setError("");
        toast({
          title: "Cuenta pendiente de aprobación",
          description: "Tu cuenta de docente está pendiente de aprobación por el administrador. Recibirás un correo cuando sea aprobada o rechazada.",
        });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('pendiente')) {
        setError("");
        toast({
          title: "Cuenta pendiente de aprobación",
          description: "Tu cuenta de docente está pendiente de aprobación por el administrador. Recibirás un correo cuando sea aprobada o rechazada.",
        });
      } else {
        setError(errorMsg || "Error al iniciar sesión. Por favor, intenta de nuevo.");
      }
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
              <CardTitle className="text-2xl font-bold text-gray-900">Iniciar Sesión</CardTitle>
              <CardDescription>
                Accede a tu cuenta para continuar aprendiendo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
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
                  <label className="text-sm font-medium text-gray-700">Contraseña</label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Tu contraseña" 
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">¿No tienes cuenta?</h4>
                <p className="text-sm text-green-700 mb-3">
                  Regístrate gratis y obtén acceso completo a todos nuestros cursos de inglés.
                </p>
                <Link href="/register">
                  <Button variant="outline" size="sm" className="w-full bg-green-100 hover:bg-green-200 text-green-900 border-green-300">
                    Crear cuenta gratuita
                  </Button>
                </Link>
              </div>
              
              <p className="text-center text-sm text-gray-600 mt-6">
                ¿Olvidaste tu contraseña?{' '}
                <Link href="/register" className="text-green-600 hover:underline font-medium">
                  Contacta soporte
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 