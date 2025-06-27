import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyBasicInfo } from "./form/CompanyBasicInfo";
import { CompanyContactInfo } from "./form/CompanyContactInfo";
import { CompanyBusinessInfo } from "./form/CompanyBusinessInfo";
import { CompanyVisibleFields } from "./form/CompanyVisibleFields";
import { Company } from "@/types/company";
import { CreateEmpresaDTO, createEmpresaSchema } from "@/types/empresa";
import { useEffect, useState } from "react";

interface CompanyFormProps {
  initialData?: Company;
  onSaved?: () => void;
  entityType?: 'afiliada' | 'prestador';
}

export function CompanyForm({ initialData, onSaved, entityType = 'afiliada' }: CompanyFormProps) {
  const { toast } = useToast();
  const [existingDocuments, setExistingDocuments] = useState<[]>([]);
  
  const form = useForm<CreateEmpresaDTO>({
    resolver: zodResolver(createEmpresaSchema),
    defaultValues: {
      razon_social: "",
      nit: "",
      nit_base: "",
      nit_verification: "",
      tipo_documento: "nit",
      regimen_tributario: "responsable_iva",
      direccion: "",
      ciudad: "",
      telefono: "",
      email: "",
      representante_legal: "",
      actividad_economica: "",
      numero_empleados: 1,
      activo: true,
      tipo_empresa: entityType,
      campos_visibles: {
        cargo: true,
        salario: true,
        celular: true,
        correo: true,
        fecha_ingreso: true,
        direccion: true,
        jornada_laboral: true
      },
      documentos: []
    },
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      if (initialData?.id) {
        /*const { data: docs, error } = await supabase
          .from('documentos_empresa')
          .select('*')
          .eq('empresa_id', parseInt(initialData.id));
        
        if (!error && docs) {
          setExistingDocuments(docs);
        }*/
      }
    };

    fetchDocuments();
  }, [initialData?.id]);

  useEffect(() => {
    if (initialData) {
      // Extract base NIT and verification digit if NIT contains a hyphen
      let nitBase = initialData.nit;
      let nitVerification = "";
      
      if (initialData.nit && initialData.nit.includes('-')) {
        [nitBase, nitVerification] = initialData.nit.split('-');
      }

      form.reset({
        razon_social: initialData.name,
        nit: initialData.nit,
        nit_base: nitBase,
        nit_verification: nitVerification,
        tipo_documento: initialData.tipo_documento || "nit",
        regimen_tributario: initialData.regimen_tributario || "responsable_iva",
        direccion: initialData.address,
        ciudad: initialData.city,
        telefono: initialData.phone,
        email: initialData.email,
        representante_legal: initialData.contactPerson,
        actividad_economica: initialData.sector,
        numero_empleados: initialData.employeeCount,
        activo: initialData.active,
        campos_visibles: {
          cargo: true,
          salario: true,
          celular: true,
          correo: true,
          fecha_ingreso: true,
          direccion: true,
          jornada_laboral: true
        }
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: CreateEmpresaDTO) => {
    try {
      let empresaId: number | undefined;
      
      const empresaData = {
        razon_social: data.razon_social,
        nit: data.nit,
        nit_base: data.nit_base,
        nit_verification: data.nit_verification,
        tipo_documento: data.tipo_documento,
        regimen_tributario: data.regimen_tributario,
        direccion: data.direccion,
        ciudad: data.ciudad,
        telefono: data.telefono,
        email: data.email,
        representante_legal: data.representante_legal,
        actividad_economica: data.actividad_economica,
        numero_empleados: data.numero_empleados,
        activo: data.activo,
        tipo_empresa: entityType,
        campos_visibles: data.campos_visibles
      };
      
      if (initialData?.id) {
        /*const { error } = await supabase
          .from("empresas")
          .update(empresaData)
          .eq("id", parseInt(initialData.id));

        if (error) throw error;
        empresaId = parseInt(initialData.id);*/
      } else {
       /* const { data: newEmpresa, error } = await supabase
          .from("empresas")
          .insert(empresaData)
          .select()
          .single();

        if (error) throw error;
        empresaId = newEmpresa.id;*/
      }

      // Luego subimos los documentos si hay alguno
      if (data.documentos && data.documentos.length > 0 && empresaId) {
        for (const doc of data.documentos) {
          const fileExt = doc.archivo.name.split('.').pop();
          const fileName = `${empresaId}/${doc.tipo}_${Date.now()}.${fileExt}`;

          // Check if a document of this type already exists
        /*  const { data: existingDocs } = await supabase
            .from('documentos_empresa')
            .select('*')
            .eq('empresa_id', empresaId)
            .eq('tipo', doc.tipo);

          // Upload the new file
          const { error: uploadError } = await supabase.storage
            .from('documentos-empresas')
            .upload(fileName, doc.archivo);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('documentos-empresas')
            .getPublicUrl(fileName);

          if (existingDocs && existingDocs.length > 0) {
            // Update existing document
            const { error: docError } = await supabase
              .from('documentos_empresa')
              .update({
                nombre_archivo: doc.nombre,
                url_archivo: urlData.publicUrl
              })
              .eq('empresa_id', empresaId)
              .eq('tipo', doc.tipo);

            if (docError) throw docError;
          } else {
            // Insert new document
            const { error: docError } = await supabase
              .from('documentos_empresa')
              .insert({
                empresa_id: empresaId,
                tipo: doc.tipo,
                nombre_archivo: doc.nombre,
                url_archivo: urlData.publicUrl
              });

            if (docError) throw docError;
          }*/
        }
      }

      toast({
        title: initialData 
          ? `${entityType === 'prestador' ? 'Prestador' : 'Empresa'} actualizada` 
          : `${entityType === 'prestador' ? 'Prestador' : 'Empresa'} registrada`,
        description: initialData 
          ? `La información del ${entityType === 'prestador' ? 'prestador' : 'la empresa'} ha sido actualizada exitosamente.`
          : `${entityType === 'prestador' ? 'El prestador' : 'La empresa'} ha sido registrada exitosamente.`,
      });

      if (!initialData) {
        form.reset();
      }

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al procesar la solicitud. Por favor, intente nuevamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <CompanyBasicInfo form={form} />
              <CompanyContactInfo form={form} />
              <CompanyBusinessInfo form={form} existingDocuments={existingDocuments} />
              {entityType === 'afiliada' && <CompanyVisibleFields form={form} />}
              <div className="flex justify-end">
                <Button type="submit">
                  {initialData ? "Actualizar Empresa" : "Registrar Empresa"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
