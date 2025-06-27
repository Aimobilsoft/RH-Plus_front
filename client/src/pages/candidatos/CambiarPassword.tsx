import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Shield, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const cambiarPasswordSchema = z.object({
  passwordActual: z.string().min(1, 'Contraseña actual requerida'),
  passwordNueva: z.string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmarPassword: z.string(),
}).refine((data) => data.passwordNueva === data.confirmarPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarPassword"],
});

type CambiarPasswordForm = z.infer<typeof cambiarPasswordSchema>;

export default function CambiarPassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CambiarPasswordForm>({
    resolver: zodResolver(cambiarPasswordSchema),
    defaultValues: {
      passwordActual: '',
      passwordNueva: '',
      confirmarPassword: '',
    },
  });

  const onSubmit = async (data: CambiarPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/candidato/cambiar-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwordActual: data.passwordActual,
          passwordNueva: data.passwordNueva,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Contraseña actualizada exitosamente');
        navigate('/candidato/perfil');
      } else {
        toast.error(result.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Cambio de Contraseña</h1>
          <p className="text-gray-600 mt-2">Portal de Candidatos</p>
        </div>

        <Card className="shadow-lg border-amber-200">
          <CardHeader className="space-y-1 bg-amber-50">
            <CardTitle className="text-2xl text-center text-amber-800">
              <AlertTriangle className="w-5 h-5 inline mr-2" />
              Cambio Obligatorio
            </CardTitle>
            <CardDescription className="text-center text-amber-700">
              Por seguridad, debe cambiar su contraseña inicial
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="passwordActual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña Actual</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Su contraseña actual (número de documento)"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passwordNueva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Mínimo 8 caracteres"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmarPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Repita la nueva contraseña"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800 font-medium mb-2">Requisitos de la contraseña:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Mínimo 8 caracteres</li>
                    <li>• Al menos una letra mayúscula</li>
                    <li>• Al menos una letra minúscula</li>
                    <li>• Al menos un número</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 font-medium mb-1">Importante:</p>
              <p className="text-sm text-amber-700">
                Una vez cambie su contraseña, tendrá acceso completo al portal de candidatos.
                Su contraseña actual es su número de documento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}