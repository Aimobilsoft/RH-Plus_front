import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Edit, Trash2, Check } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Orden } from '@/services/ordenesService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrdenesListProps {
  ordenes: Orden[];
  onEdit: (orden: Orden) => void;
  onDelete: (id: number) => void;
  onView: (orden: Orden) => void;
  onApprove: (id: number) => void;
}

const OrdenesList = ({ ordenes, onEdit, onDelete, onView, onApprove }: OrdenesListProps) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getEstadoBadgeClass = (estado: string | undefined) => {
    switch (estado?.toLowerCase()) {
      case 'aprobado':
      case 'aprobada':
        return 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold';
      case 'rechazado':
      case 'anulada':
      case 'anulado':
        return 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold';
      default:
        return 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold';
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (id) {
      setSelectedOrderId(id);
      setConfirmDeleteOpen(true);
    }
  };

  const handleApproveClick = (id: number | undefined) => {
    if (id) {
      setSelectedOrderId(id);
      setConfirmApproveOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedOrderId) {
      onDelete(selectedOrderId);
      setConfirmDeleteOpen(false);
      setSelectedOrderId(null);
    }
  };

  const handleConfirmApprove = () => {
    if (selectedOrderId) {
      onApprove(selectedOrderId);
      setConfirmApproveOpen(false);
      setSelectedOrderId(null);
    }
  };

  const isOrderDisabled = (estado?: string) => {
    return estado?.toLowerCase() === 'aprobada' || estado?.toLowerCase() === 'anulada';
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[80px] font-semibold">N° Orden</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Prestador</TableHead>
            <TableHead className="font-semibold">Aspirante</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenes.length > 0 ? (
            ordenes.map((orden) => (
              <TableRow key={orden.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{orden.id || 'N/A'}</TableCell>
                <TableCell>{formatDate(orden.fechaCreacion)}</TableCell>
                <TableCell>{orden.empresa_name || 'N/A'}</TableCell>
                <TableCell>
                  {orden.aspirante_name || 'N/A'}
                </TableCell>
                <TableCell>
                  <span className={getEstadoBadgeClass(orden.estado)}>
                    {orden.estado || 'Pendiente'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(orden)}
                      title="Ver PDF"
                      className="h-8 w-8 p-0 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(orden)}
                      title="Editar"
                      disabled={isOrderDisabled(orden.estado)}
                      className="h-8 w-8 p-0 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApproveClick(orden.id)}
                      title="Aprobar"
                      disabled={isOrderDisabled(orden.estado)}
                      className="h-8 w-8 p-0 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(orden.id)}
                      title="Anular"
                      disabled={isOrderDisabled(orden.estado)}
                      className="h-8 w-8 p-0 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No hay órdenes registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent className="bg-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">¿Está seguro de anular esta orden?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta acción cambiará el estado de la orden a ANULADA y no podrá ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel className="rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
            >
              Anular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={confirmApproveOpen} onOpenChange={setConfirmApproveOpen}>
        <AlertDialogContent className="bg-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">¿Está seguro de aprobar esta orden?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta acción cambiará el estado de la orden a APROBADA y no podrá ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel className="rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmApprove}
              className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
            >
              Aprobar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrdenesList;
