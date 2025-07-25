import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import logo from '../../public/logo2.svg';

export default function LoginUnificado() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Por favor ingresa tu usuario y contraseña');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      await login({ username, password });

    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.location.href = '/forgot-password';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lime/10 to-brand-turquoise/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-in">
        {/* Header */}
        <div className="text-center mb-8">

          <div className="logo-login"
            style={{
              backgroundImage: `url(${logo})`
            }}
          ></div>
          <p className="text-gray-600 animate-slide-in mt-[-15px] mb-[-15px] pt-[-14px] pb-[-14px]">Sistema de Gestión de Contratación</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario o email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="h-12 login-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-12 pr-10 login-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm forgot-password-link hover:underline transition-colors"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}