import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react';

interface Educacion {
  id?: number;
  titulo: string;
  institucion: string;
  fechaInicio: string;
  fechaFin: string;
  ciudad: string;
  nivelEducativo: string;
}

interface EducacionTabProps {
  educacion: Educacion[];
  onChange: (educacion: Educacion[]) => void;
}

export function EducacionTab({ educacion, onChange }: EducacionTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducacion, setCurrentEducacion] = useState<Educacion>({
    titulo: '',
    institucion: '',
    fechaInicio: '',
    fechaFin: '',
    ciudad: '',
    nivelEducativo: ''
  });

  const nivelesEducativos = [
    'Primaria',
    'Secundaria',
    'Técnico',
    'Tecnológico',
    'Universitario',
    'Especialización',
    'Maestría',
    'Doctorado'
  ];

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentEducacion({
      titulo: '',
      institucion: '',
      fechaInicio: '',
      fechaFin: '',
      ciudad: '',
      nivelEducativo: ''
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Educacion) => {
    setIsEditing(true);
    setCurrentEducacion(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number | undefined) => {
    if (id !== undefined) {
      onChange(educacion.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    if (isEditing) {
      onChange(educacion.map(item => 
        item.id === currentEducacion.id ? currentEducacion : item
      ));
    } else {
      const newEducacion = {
        ...currentEducacion,
        id: Date.now() // Temporary ID
      };
      onChange([...educacion, newEducacion]);
    }
    setIsDialogOpen(false);
  };

  const isFormValid = currentEducacion.titulo && 
                     currentEducacion.institucion && 
                     currentEducacion.fechaInicio && 
                     currentEducacion.fechaFin && 
                     currentEducacion.ciudad && 
                     currentEducacion.nivelEducativo;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Educación</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Educación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Editar Educación' : 'Agregar Nueva Educación'}
              </DialogTitle>
              <DialogDescription>
                Complete la información de su formación académica
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título/Programa</Label>
                  <Input
                    id="titulo"
                    value={currentEducacion.titulo}
                    onChange={(e) => setCurrentEducacion({
                      ...currentEducacion,
                      titulo: e.target.value
                    })}
                    placeholder="Ej: Ingeniería de Sistemas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institucion">Institución Educativa</Label>
                  <Input
                    id="institucion"
                    value={currentEducacion.institucion}
                    onChange={(e) => setCurrentEducacion({
                      ...currentEducacion,
                      institucion: e.target.value
                    })}
                    placeholder="Ej: Universidad Nacional"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={currentEducacion.fechaInicio}
                    onChange={(e) => setCurrentEducacion({
                      ...currentEducacion,
                      fechaInicio: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha de Finalización</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={currentEducacion.fechaFin}
                    onChange={(e) => setCurrentEducacion({
                      ...currentEducacion,
                      fechaFin: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={currentEducacion.ciudad}
                    onChange={(e) => setCurrentEducacion({
                      ...currentEducacion,
                      ciudad: e.target.value
                    })}
                    placeholder="Ej: Bogotá"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
                  <Select
                    value={currentEducacion.nivelEducativo}
                    onValueChange={(value) => setCurrentEducacion({
                      ...currentEducacion,
                      nivelEducativo: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {nivelesEducativos.map((nivel) => (
                        <SelectItem key={nivel} value={nivel}>
                          {nivel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!isFormValid}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isEditing ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {educacion.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No hay información educativa registrada
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega tu formación académica para mejorar tu perfil profesional
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formación Académica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-700">Título/Programa</th>
                    <th className="text-left p-3 font-medium text-gray-700">Institución</th>
                    <th className="text-left p-3 font-medium text-gray-700">Período</th>
                    <th className="text-left p-3 font-medium text-gray-700">Ciudad</th>
                    <th className="text-left p-3 font-medium text-gray-700">Nivel</th>
                    <th className="text-left p-3 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {educacion.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">{item.titulo}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-gray-600">{item.institucion}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600">
                          {new Date(item.fechaInicio).toLocaleDateString('es-CO')} - {' '}
                          {new Date(item.fechaFin).toLocaleDateString('es-CO')}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-gray-600">{item.ciudad}</div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.nivelEducativo}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}