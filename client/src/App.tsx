
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import Index from "./pages/Index";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

// Páginas para cada sección
import EmpresasPage from "./pages/registros/EmpresasPage";
import CandidatosPage from "./pages/registros/CandidatosPage";
import PrestadoresPage from "./pages/registros/PrestadoresPage";
import ExpedicionOrdenPage from "./pages/ordenes/ExpedicionOrdenPage";
import AgendaMedicaPage from "./pages/clinica/AgendaMedicaPage";
import HistoriaMedicaPage from "./pages/clinica/HistoriaMedicaPage";
import HistoriaLaboralPage from "./pages/clinica/HistoriaLaboralPage";
import ConsultoriosPage from "./pages/clinica/ConsultoriosPage";
import EspecialidadesPage from "./pages/clinica/EspecialidadesPage";
import EspecialistasPage from "./pages/clinica/EspecialistasPage";
import CitasProgramadasPage from "./pages/clinica/CitasProgramadasPage";
import ExpedicionCertificadosPage from "./pages/certificados/ExpedicionCertificadosPage";
import UsuariosPage from "./pages/seguridad/UsuariosPage";
import PerfilesPage from "./pages/seguridad/PerfilesPage";
import MenuPage from "./pages/seguridad/MenuPage";

// Candidate portal pages
import LoginCandidato from "./pages/candidatos/LoginCandidato";
import RegistroCandidato from "./pages/candidatos/RegistroCandidato";
import PerfilCandidato from "./pages/candidatos/PerfilCandidato";

// Admin login
import LoginAdmin from "./pages/LoginAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Login - First View */}
          <Route path="/" element={<LoginAdmin />} />
          
          {/* Candidate Portal Routes - No Layout */}
          <Route path="/candidato/login" element={<LoginCandidato />} />
          <Route path="/candidato/registro" element={<RegistroCandidato />} />
          <Route path="/candidato/perfil" element={<PerfilCandidato />} />
          
          {/* Admin Portal Routes - With Layout (Protected) */}
          <Route element={<SidebarProvider><Layout /></SidebarProvider>}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<Index />} />
            
            {/* Registros */}
            <Route path="/registros/empresas" element={<EmpresasPage />} />
            <Route path="/registros/candidatos" element={<CandidatosPage />} />
            <Route path="/registros/prestadores" element={<PrestadoresPage />} />
            
            {/* Ordenes */}
            <Route path="/ordenes/expedicion" element={<ExpedicionOrdenPage />} />
            
            {/* Clinica */}
            <Route path="/clinica/agenda" element={<AgendaMedicaPage />} />
            <Route path="/clinica/historia-medica" element={<HistoriaMedicaPage />} />
            <Route path="/clinica/historia-laboral" element={<HistoriaLaboralPage />} />
            <Route path="/clinica/consultorios" element={<ConsultoriosPage />} />
            <Route path="/clinica/especialidades" element={<EspecialidadesPage />} />
            <Route path="/clinica/especialistas" element={<EspecialistasPage />} />
            <Route path="/clinica/citas" element={<CitasProgramadasPage />} />
            
            {/* Certificados */}
            <Route path="/certificados/expedicion" element={<ExpedicionCertificadosPage />} />
            
            {/* Seguridad */}
            <Route path="/seguridad/usuarios" element={<UsuariosPage />} />
            <Route path="/seguridad/perfiles" element={<PerfilesPage />} />
            <Route path="/seguridad/menu" element={<MenuPage />} />
          </Route>
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
