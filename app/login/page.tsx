"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <Link href="/" className="text-green-600 hover:underline text-sm">&larr; Volver al inicio</Link>
        <h1 className="text-2xl font-bold text-center text-gray-900">Iniciar Sesión</h1>
        <form className="space-y-4">
          <Input type="email" placeholder="Correo electrónico" required />
          <Input type="password" placeholder="Contraseña" required />
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Entrar</Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-green-600 hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
} 