import { CompaniesTable } from "@/components/companies/CompaniesTable";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Company } from "@/types/company";

export default function RegistroEmpresas() {
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  return (
    <div className="container mx-auto py-8">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Registro de Empresas Afiliadas</h2>
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          </div>
          <CompaniesTable onEdit={handleEdit} entityType="empresa" />
        </>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editingCompany ? "Editar Empresa Afiliada" : "Registrar Nueva Empresa Afiliada"}
            </h2>
            <Button variant="outline" onClick={handleBack}>
              Volver al Listado
            </Button>
          </div>
          <CompanyForm 
            initialData={editingCompany} 
            onSaved={handleSaved}
            entityType="afiliada"
          />
        </div>
      )}
    </div>
  );
}