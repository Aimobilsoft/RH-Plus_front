
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
  Users,
  User,
  Briefcase,
  FileText,
  Calendar,
  Building,
  Layers,
  Settings,
  Menu,
  LogOut,
  UserCheck,
  BarChart3,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Define los menús y submenús
const menuItems = [
  {
    title: "Dashboard",
    icon: <Layers className="h-5 w-5" />,
    path: "/dashboard",
    subItems: [],
  },
  {
    title: "Registros",
    icon: <Users className="h-5 w-5" />,
    subItems: [
      { title: "Empresas Afiliadas", path: "/registros/empresas", icon: <Building className="h-4 w-4" /> },
      { title: "Candidatos", path: "/registros/candidatos", icon: <User className="h-4 w-4" /> },
      { title: "Prestadores", path: "/registros/prestadores", icon: <Briefcase className="h-4 w-4" /> },
    ],
  },
  {
    title: "Expedicion de Orden",
    icon: <FileText className="h-5 w-5" />,
    path: "/ordenes/expedicion",
    subItems: [],
  },

  {
    title: "Expedicion de Certificados",
    icon: <FileText className="h-5 w-5" />,
    path: "/certificados/expedicion",
    subItems: [],
  },
  {
    title: "Analistas",
    icon: <UserCheck className="h-5 w-5" />,
    path: "/analistas",
    subItems: [],
  },
  {
    title: "Reportes",
    icon: <BarChart3 className="h-5 w-5" />,
    subItems: [
      { title: "Dashboard", path: "/reportes/dashboard", icon: <Activity className="h-4 w-4" /> },
    ],
  },
  {
    title: "Maestro",
    icon: <Settings className="h-5 w-5" />,
    path: "/maestro/tipos-candidatos",
    subItems: [],
  },
  {
    title: "Seguridad",
    icon: <Settings className="h-5 w-5" />,
    subItems: [
      { title: "Usuarios", path: "/seguridad/usuarios", icon: <Users className="h-4 w-4" /> },
      { title: "Perfiles", path: "/seguridad/perfiles", icon: <Settings className="h-4 w-4" /> },
      { title: "Menu", path: "/seguridad/menu", icon: <Menu className="h-4 w-4" /> },
    ],
  },
];

// Componente para el header
const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
      <SidebarTrigger />
      <div className="ml-4">
        <h1 className="text-lg font-semibold">Sistema de Recursos Humanos</h1>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          <User className="w-4 h-4 mr-2" />
          Administrador
        </div>
      </div>
    </header>
  );
};

// Componente para el sidebar
const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  // Control state for each menu group
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // Initialize open state based on current path
    const initialState: Record<string, boolean> = {};
    menuItems.forEach((item, index) => {
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

  return (
    <Sidebar
      className={`border-r h-screen ${collapsed ? "w-14" : "w-64"}`}
      collapsible="icon"
    >
      <div className="p-4 flex justify-center items-center h-16">
        {!collapsed && (
          <div className="text-2xl font-bold text-sidebar-foreground">Recursos Humanos</div>
        )}
      </div>
      <SidebarContent className="p-2">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.title}>
            {item.subItems.length === 0 ? (
              // Elemento sin subítems
              (<Link
                to={item.path || "/"}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 mb-1 ${
                  currentPath === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                }`}
              >
                {item.icon}
                {!collapsed && <span className="text-base font-medium">{item.title}</span>}
              </Link>)
            ) : (
              // Grupo con subítems
              (<SidebarGroup>
                <SidebarGroupLabel 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleGroup(index)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {!collapsed && (
                      <span className="ml-2 text-base font-medium">
                        {item.title}
                      </span>
                    )}
                  </span>
                </SidebarGroupLabel>
                {openGroups[index] && (
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              to={subItem.path}
                              className={`flex items-center space-x-2 w-full ${
                                currentPath === subItem.path
                                  ? "text-sidebar-primary font-medium"
                                  : "text-sidebar-foreground"
                              }`}
                            >
                              {subItem.icon}
                              {!collapsed && <span className="ml-1 text-sm font-medium">{subItem.title}</span>}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
              </SidebarGroup>)
            )}
          </React.Fragment>
        ))}
        
        {/* Logout Button at Bottom */}
        <div className="mt-auto p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => {
              // Clear local storage
              localStorage.removeItem('admin_authenticated');
              // Redirect to admin login
              window.location.href = '/';
            }}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const Layout = () => {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
