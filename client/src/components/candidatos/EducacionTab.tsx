import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react';

interface Educacion {
  id?: number;
  nivelEducativo: string;
  institucion: string;
  titulo: string;
  fechaGraduacion: string;
}

interface EducacionTabProps {
  educacion: Educacion[];
  onChange: (educacion: Educacion[]) => void;
}

export const EducacionTab: React.FC<EducacionTabProps> = ({ educacion, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentEducacion, setCurrentEducacion] = useState<Educacion>({
    nivelEducativo: '',
    institucion: '',
    titulo: '',
    fechaGraduacion: '',
  });

  const handleAdd = () => {
    setCurrentEducacion({
      nivelEducativo: '',
      institucion: '',
      titulo: '',
      fechaGraduacion: '',
    });
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleEdit = (index: number) => {
    setCurrentEducacion({ ...educacion[index] });
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleSave = () => {
    const newEducacion = [...educacion];
    
    if (editingIndex !== null) {
      // Editando existente
      newEducacion[editingIndex] = currentEducacion;
    } else {
      // Agregando nuevo
      newEducacion.push({
        ...currentEducacion,
        id: Date.now(), // Temporary ID for new items
      });
    }
    
    onChange(newEducacion);
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const newEducacion = educacion.filter((_, i) => i !== index);
    onChange(newEducacion);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setCurrentEducacion({
      nivelEducativo: '',
      institucion: '',
      titulo: '',
      fechaGraduacion: '',
    });
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            {editingIndex !== null ? 'Editar Educación' : 'Agregar Educación'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nivel Educativo *</label>
              <Select
                value={currentEducacion.nivelEducativo}
                onValueChange={(value) => setCurrentEducacion(prev => ({ ...prev, nivelEducativo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primaria">Primaria</SelectItem>
                  <SelectItem value="Bachillerato">Bachillerato</SelectItem>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                  <SelectItem value="Tecnólogo">Tecnólogo</SelectItem>
                  <SelectItem value="Profesional">Profesional</SelectItem>
                  <SelectItem value="Especialización">Especialización</SelectItem>
                  <SelectItem value="Maestría">Maestría</SelectItem>
                  <SelectItem value="Doctorado">Doctorado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Institución *</label>
              <Input
                value={currentEducacion.institucion}
                onChange={(e) => setCurrentEducacion(prev => ({ ...prev, institucion: e.target.value }))}
                placeholder="Nombre de la institución"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Título Obtenido *</label>
              <Input
                value={currentEducacion.titulo}
                onChange={(e) => setCurrentEducacion(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Título o certificación obtenida"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Graduación</label>
              <Input
                type="date"
                value={currentEducacion.fechaGraduacion}
                onChange={(e) => setCurrentEducacion(prev => ({ ...prev, fechaGraduacion: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleSave}
              disabled={!currentEducacion.nivelEducativo || !currentEducacion.institucion || !currentEducacion.titulo}
            >
              {editingIndex !== null ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center">
          <GraduationCap className="mr-2 h-5 w-5" />
          Educación
        </h3>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Educación
        </Button>
      </div>

      {educacion.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay registros de educación</p>
            <p className="text-sm text-muted-foreground">Agregue la información educativa del candidato</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {educacion.map((edu, index) => (
            <Card key={edu.id || index}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{edu.titulo}</h4>
                    <p className="text-muted-foreground">{edu.institucion}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {edu.nivelEducativo}
                      </span>
                      {edu.fechaGraduacion && (
                        <span>Graduado: {new Date(edu.fechaGraduacion).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};