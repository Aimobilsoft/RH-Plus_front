import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Building2,
  Users,
  Plus,
  List,
  LogOut,
  BarChart3,
  QrCode,
  Settings,
  Send,
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Elementos del menú para empresas
const empresaMenuItems = [
  {
    title: "Dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
    path: "/empresa/dashboard",
    subItems: [],
  },
  {
    title: "Candidatos",
    icon: <Users className="h-5 w-5" />,
    path: undefined,
    subItems: [
      { title: "Crear Candidato", path: "/empresa/candidatos/crear", icon: <Plus className="h-4 w-4" /> },
      { title: "Ver Candidatos", path: "/empresa/candidatos", icon: <List className="h-4 w-4" /> },
    ],
  },
  {
    title: "Códigos QR",
    icon: <QrCode className="h-5 w-5" />,
    path: undefined,
    subItems: [
      { title: "Generar QR", path: "/empresa/qr/generar", icon: <QrCode className="h-4 w-4" /> },
      { title: "Configuración QR", path: "/empresa/qr/configuracion", icon: <Settings className="h-4 w-4" /> },
      { title: "Enviar por WhatsApp", path: "/empresa/qr/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
      { title: "Enviar por Email", path: "/empresa/qr/email", icon: <Send className="h-4 w-4" /> },
    ],
  },
];

// Componente Header para empresas
const EmpresaHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
      <SidebarTrigger />
      <div className="ml-4">
        <h1 className="text-lg font-semibold">Portal de Empresas</h1>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <Building2 className="w-4 h-4 mr-2" />
          Empresa
        </div>
      </div>
    </header>
  );
};

// Componente Sidebar para empresas
const EmpresaSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  // Control state for each menu group
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // Initialize open state based on current path
    const initialState: Record<string, boolean> = {};
    empresaMenuItems.forEach((item, index) => {
      if (item.subItems.some(subItem => currentPath.startsWith(subItem.path))) {
        initialState[index] = true;
      } else {
        initialState[index] = false;
      }
    });
    return initialState;
  });

  const toggleGroup = (index: number) => {
    setOpenGroups(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/empresa/logout', { method: 'POST' });
      window.location.href = '/empresa/login';
    } catch (error) {
      console.error('Error en logout:', error);
      window.location.href = '/empresa/login';
    }
  };

  return (
    <Sidebar
      className={`border-r h-screen ${collapsed ? "w-14" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 text-xl font-bold text-[#ffffff]">
              {collapsed ? "RH" : "Recursos Humanos"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {empresaMenuItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    {item.subItems.length > 0 ? (
                      <div>
                        <SidebarMenuButton
                          onClick={() => toggleGroup(index)}
                          className={`w-full justify-between text-base font-medium ${
                            item.subItems.some(subItem => 
                              currentPath.startsWith(subItem.path)
                            ) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            {item.icon}
                            {!collapsed && <span className="ml-3">{item.title}</span>}
                          </div>
                          {!collapsed && (
                            <span className={`transition-transform ${openGroups[index] ? "rotate-90" : ""}`}>
                              ▶
                            </span>
                          )}
                        </SidebarMenuButton>
                        {!collapsed && openGroups[index] && (
                          <div className="ml-6 mt-1">
                            {item.subItems.map((subItem, subIndex) => (
                              <SidebarMenuButton
                                key={subIndex}
                                asChild
                                className={`text-sm mb-1 ${
                                  currentPath === subItem.path 
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                    : ""
                                }`}
                              >
                                <Link to={subItem.path || '#'} className="flex items-center">
                                  {subItem.icon}
                                  <span className="ml-2">{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className={`text-base font-medium ${
                          currentPath === item.path 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                            : ""
                        }`}
                      >
                        <Link to={item.path || '#'} className="flex items-center">
                          {item.icon}
                          {!collapsed && <span className="ml-3">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        
        {/* Logout button at the bottom */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const EmpresaLayout = () => {
  return (
    <div className="flex h-screen w-full">
      <EmpresaSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <EmpresaHeader />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmpresaLayout;