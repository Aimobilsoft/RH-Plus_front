import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';

interface ExperienciaLaboral {
  id?: number;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  cargo: string;
  responsabilidades: string;
  salario: string | number;
  motivoRetiro?: string;
}

interface ExperienciaLaboralTabProps {
  experienciaLaboral: ExperienciaLaboral[];
  onChange: (experienciaLaboral: ExperienciaLaboral[]) => void;
}

export const ExperienciaLaboralTab: React.FC<ExperienciaLaboralTabProps> = ({ experienciaLaboral, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentExperiencia, setCurrentExperiencia] = useState<ExperienciaLaboral>({
    empresa: '',
    fechaInicio: '',
    fechaFin: '',
    cargo: '',
    responsabilidades: '',
    salario: '',
    motivoRetiro: '',
  });

  const handleAdd = () => {
    setCurrentExperiencia({
      empresa: '',
      fechaInicio: '',
      fechaFin: '',
      cargo: '',
      responsabilidades: '',
      salario: '',
      motivoRetiro: '',
    });
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleEdit = (index: number) => {
    setCurrentExperiencia({ ...experienciaLaboral[index] });
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleSave = () => {
    const newExperiencia = [...experienciaLaboral];
    
    if (editingIndex !== null) {
      // Editando existente
      newExperiencia[editingIndex] = currentExperiencia;
    } else {
      // Agregando nuevo
      newExperiencia.push({
        ...currentExperiencia,
        id: Date.now(), // Temporary ID for new items
      });
    }
    
    onChange(newExperiencia);
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const newExperiencia = experienciaLaboral.filter((_, i) => i !== index);
    onChange(newExperiencia);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setCurrentExperiencia({
      empresa: '',
      fechaInicio: '',
      fechaFin: '',
      cargo: '',
      responsabilidades: '',
      salario: '',
      motivoRetiro: '',
    });
  };

  const calcularDuracion = (fechaInicio: string, fechaFin: string) => {
    if (!fechaInicio) return '';
    
    const inicio = new Date(fechaInicio);
    const fin = fechaFin ? new Date(fechaFin) : new Date();
    
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0 && months > 0) {
      return `${years} año${years > 1 ? 's' : ''} y ${months} mes${months > 1 ? 'es' : ''}`;
    } else if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} mes${months > 1 ? 'es' : ''}`;
    } else {
      return 'Menos de 1 mes';
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            {editingIndex !== null ? 'Editar Experiencia Laboral' : 'Agregar Experiencia Laboral'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Empresa *</label>
              <Input
                value={currentExperiencia.empresa}
                onChange={(e) => setCurrentExperiencia(prev => ({ ...prev, empresa: e.target.value }))}
                placeholder="Nombre de la empresa"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo *</label>
              <Input
                value={currentExperiencia.cargo}
                onChange={(e) => setCurrentExperiencia(prev => ({ ...prev, cargo: e.target.value }))}
                placeholder="Cargo desempeñado"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Inicio *</label>
              <Input
                type="date"
                value={currentExperiencia.fechaInicio}
                onChange={(e) => setCurrentExperiencia(prev => ({ ...prev, fechaInicio: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Fin</label>
              <Input
                type="date"
                value={currentExperiencia.fechaFin}
                onChange={(e) => setCurrentExperiencia(prev => ({ ...prev, fechaFin: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Deje vacío si aún trabaja aquí</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Salario</label>
              <Input
                type="number"
                value={currentExperiencia.salario}
                onChange={(e) => setCurrentExperiencia(prev => ({ ...prev, salario: e.target.value }))}
                placeholder="Salario mensual"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo de Retiro</label>
              <Input
                value={currentExperiencia.motivoRetiro || ''}
                onChange={(e) => setCurrentExperiencia(prev => ({ ...prev, motivoRetiro: e.target.value }))}
                placeholder="Razón del retiro (opcional)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Responsabilidades *</label>
            <Textarea
              value={currentExperiencia.responsabilidades}
              onChange={(e) => setCurrentExperiencia(prev => ({ ...prev, responsabilidades: e.target.value }))}
              placeholder="Describa las principales responsabilidades y logros en este cargo"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleSave}
              disabled={!currentExperiencia.empresa || !currentExperiencia.cargo || !currentExperiencia.fechaInicio || !currentExperiencia.responsabilidades}
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
          <Briefcase className="mr-2 h-5 w-5" />
          Experiencia Laboral
        </h3>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Experiencia
        </Button>
      </div>

      {experienciaLaboral.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay registros de experiencia laboral</p>
            <p className="text-sm text-muted-foreground">Agregue la experiencia laboral del candidato</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Motivo Retiro</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experienciaLaboral.map((exp, index) => (
                  <TableRow key={exp.id || index}>
                    <TableCell className="font-medium">{exp.cargo}</TableCell>
                    <TableCell>{exp.empresa}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(exp.fechaInicio).toLocaleDateString()} - {exp.fechaFin ? new Date(exp.fechaFin).toLocaleDateString() : 'Actual'}
                    </TableCell>
                    <TableCell>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {calcularDuracion(exp.fechaInicio, exp.fechaFin)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {exp.motivoRetiro || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(index)} title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(index)} title="Eliminar">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};