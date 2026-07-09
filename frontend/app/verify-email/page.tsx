"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MainNavigation from "@/components/MainNavigation";

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Simular verificación de token
      setTimeout(() => {
        // Por ahora simulamos que siempre es exitoso
        setVerificationStatus('success');
        setMessage("¡Tu cuenta ha sido verificada exitosamente! Ya puedes iniciar sesión.");
      }, 2000);
    } else {
      setVerificationStatus('error');
      setMessage("Enlace de verificación inválido o expirado.");
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {verificationStatus === 'pending' && (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                )}
                {verificationStatus === 'success' && (
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                )}
                {verificationStatus === 'error' && (
                  <Mail className="h-12 w-12 text-red-600 mx-auto" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {verificationStatus === 'pending' && 'Verificando tu cuenta...'}
                {verificationStatus === 'success' && '¡Verificación Exitosa!'}
                {verificationStatus === 'error' && 'Error de Verificación'}
              </CardTitle>
              <CardDescription>
                {verificationStatus === 'pending' && 'Estamos verificando tu enlace de verificación'}
                {verificationStatus === 'success' && 'Tu cuenta ha sido activada correctamente'}
                {verificationStatus === 'error' && 'No se pudo verificar tu cuenta'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert className={`mb-6 ${verificationStatus === 'success' ? 'border-green-200 bg-green-50' : verificationStatus === 'error' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                {verificationStatus === 'success' && (
                  <div className="text-center space-y-4">
                    <p className="text-green-700">
                      ¡Bienvenido a Freenglish! Tu cuenta está lista para usar.
                    </p>
                    <Link href="/login">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Ir al Login
                      </Button>
                    </Link>
                  </div>
                )}
                
                {verificationStatus === 'error' && (
                  <div className="text-center space-y-4">
                    <p className="text-red-700">
                      El enlace de verificación no es válido o ha expirado. 
                      Por favor, solicita un nuevo enlace.
                    </p>
                    <div className="space-y-2">
                      <Link href="/register">
                        <Button variant="outline" className="w-full">
                          Registrarse de nuevo
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Ir al Login
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                
                {verificationStatus === 'pending' && (
                  <div className="text-center">
                    <p className="text-gray-600">
                      Por favor, espera mientras verificamos tu cuenta...
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/" className="text-green-600 hover:underline font-medium">
                  <ArrowLeft className="h-4 w-4 inline mr-1" />
                  Volver al inicio
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 