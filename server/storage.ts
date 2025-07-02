import {
  users,
  candidatos,
  perfiles,
  userPerfiles,
  empresas,
  clientes,
  tiposCandidatos,
  documentosTipo,
  tiposCandidatosDocumentos,
  candidatosDocumentos,
  menuNodes,
  menuPermissions,
  menuActions,
  perfilMenus,
  perfilAcciones,
  analistas,
  type User,
  type InsertUser,
  type UserPerfil,
  type InsertUserPerfil,
  type Candidato,
  type InsertCandidato,
  type Perfil,
  type InsertPerfil,
  type CreateCandidatoFromPerfil,
  type Empresa,
  type InsertEmpresa,
  type CreateEmpresa,
  type Cliente,
  type InsertCliente,
  type CreateCliente,
  type TipoCandidato,
  type InsertTipoCandidato,
  type DocumentoTipo,
  type InsertDocumentoTipo,
  type TipoCandidatoDocumento,
  type InsertTipoCandidatoDocumento,
  type CandidatoDocumento,
  type InsertCandidatoDocumento,
  type MenuNode,
  type InsertMenuNode,
  type MenuPermission,
  type InsertMenuPermission,
  type MenuAction,
  type InsertMenuAction,
  type PerfilMenu,
  type InsertPerfilMenu,
  type PerfilAccion,
  type InsertPerfilAccion,
  type Analista,
  type InsertAnalista,
} from "@shared/schema";

export interface IStorage {
  // Admin user operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // User-Profile relationship operations
  getUserPerfiles(userId: number): Promise<Perfil[]>;
  createUserPerfil(userPerfil: InsertUserPerfil): Promise<UserPerfil>;
  deleteUserPerfiles(userId: number): Promise<void>;
  createUserWithPerfiles(userData: InsertUser, perfilIds: number[]): Promise<{ user: User; perfiles: Perfil[] }>;

  // Perfil operations
  getAllPerfiles(): Promise<Perfil[]>;
  getPerfilById(id: number): Promise<Perfil | undefined>;
  getPerfilByNombre(nombre: string): Promise<Perfil | undefined>;
  createPerfil(perfil: InsertPerfil): Promise<Perfil>;
  updatePerfil(id: number, perfil: Partial<InsertPerfil>): Promise<Perfil>;
  deletePerfil(id: number): Promise<void>;

  // Candidato operations
  getCandidato(id: number): Promise<Candidato | undefined>;
  getCandidatoByEmail(email: string): Promise<Candidato | undefined>;
  getAllCandidatos(): Promise<Candidato[]>;
  createCandidato(candidato: InsertCandidato): Promise<Candidato>;
  updateCandidato(
    id: number,
    candidato: Partial<InsertCandidato>,
  ): Promise<Candidato>;

  // Operaciones especiales para crear candidatos desde perfiles
  createCandidatoFromPerfil(
    data: CreateCandidatoFromPerfil,
  ): Promise<Candidato>;

  // Empresa operations
  getEmpresa(id: number): Promise<Empresa | undefined>;
  getEmpresaByEmail(email: string): Promise<Empresa | undefined>;
  getAllEmpresas(): Promise<Empresa[]>;
  createEmpresa(empresa: InsertEmpresa): Promise<Empresa>;
  updateEmpresa(id: number, empresa: Partial<InsertEmpresa>): Promise<Empresa>;

  // Candidatos por empresa (para portal de empresas)
  getCandidatosByEmpresa(empresaId: number): Promise<Candidato[]>;
  createCandidatoForEmpresa(
    candidato: InsertCandidato,
    empresaId: number,
  ): Promise<Candidato>;

  // Maestro operations - Tipos de Candidatos
  getAllTiposCandidatos(): Promise<TipoCandidato[]>;
  getTipoCandidatoById(id: number): Promise<TipoCandidato | undefined>;
  createTipoCandidato(
    tipoCandidato: InsertTipoCandidato,
  ): Promise<TipoCandidato>;
  updateTipoCandidato(
    id: number,
    tipoCandidato: Partial<InsertTipoCandidato>,
  ): Promise<TipoCandidato>;
  deleteTipoCandidato(id: number): Promise<void>;

  // Maestro operations - Documentos Tipo
  getAllDocumentosTipo(): Promise<DocumentoTipo[]>;
  getDocumentoTipoById(id: number): Promise<DocumentoTipo | undefined>;
  createDocumentoTipo(
    documentoTipo: InsertDocumentoTipo,
  ): Promise<DocumentoTipo>;
  updateDocumentoTipo(
    id: number,
    documentoTipo: Partial<InsertDocumentoTipo>,
  ): Promise<DocumentoTipo>;
  deleteDocumentoTipo(id: number): Promise<void>;

  // Maestro operations - Relación Tipos-Documentos
  getDocumentosByTipoCandidato(
    tipoCandidatoId: number,
  ): Promise<TipoCandidatoDocumento[]>;
  updateDocumentosByTipoCandidato(
    tipoCandidatoId: number,
    documentos: InsertTipoCandidatoDocumento[],
  ): Promise<void>;

  // Candidatos Documentos
  getDocumentosByCandidato(candidatoId: number): Promise<CandidatoDocumento[]>;
  createCandidatoDocumento(
    candidatoDocumento: InsertCandidatoDocumento,
  ): Promise<CandidatoDocumento>;
  updateCandidatoDocumento(
    id: number,
    candidatoDocumento: Partial<InsertCandidatoDocumento>,
  ): Promise<CandidatoDocumento>;
  deleteCandidatoDocumento(id: number): Promise<void>;

  // Menu operations
  getAllMenuNodes(): Promise<MenuNode[]>;
  createMenuNode(menuNode: InsertMenuNode): Promise<MenuNode>;
  updateMenuNode(
    id: number,
    menuNode: Partial<InsertMenuNode>,
  ): Promise<MenuNode>;
  deleteMenuNode(id: number): Promise<void>;

  // Menu permissions operations
  getMenuPermissionByNodeId(
    nodeId: number,
  ): Promise<MenuPermission | undefined>;
  createMenuPermission(
    permission: InsertMenuPermission,
  ): Promise<MenuPermission>;
  updateMenuPermission(
    id: number,
    permission: Partial<InsertMenuPermission>,
  ): Promise<MenuPermission>;
  deleteMenuPermission(id: number): Promise<void>;

  // Menu actions operations
  getMenuActionsByPermissionId(permissionId: number): Promise<MenuAction[]>;
  createMenuAction(action: InsertMenuAction): Promise<MenuAction>;
  deleteMenuAction(id: number): Promise<void>;
  // Analistas operations
  getAllAnalistas(): Promise<Analista[]>;
  getAnalistaById(id: number): Promise<Analista | undefined>;
  getAnalistaByEmail(email: string): Promise<Analista | undefined>;
  createAnalista(analista: InsertAnalista): Promise<Analista>;
  updateAnalista(
    id: number,
    analista: Partial<InsertAnalista>,
  ): Promise<Analista>;
  deleteAnalista(id: number): Promise<void>;

  // Clientes operations
  getAllClientes(): Promise<Cliente[]>;
  getClienteById(id: number): Promise<Cliente | undefined>;
  getClienteByEmail(email: string): Promise<Cliente | undefined>;
  createCliente(cliente: InsertCliente): Promise<Cliente>;
  updateCliente(id: number, cliente: Partial<InsertCliente>): Promise<Cliente>;
  deleteCliente(id: number): Promise<void>;

  // Perfil menus and actions operations
  createPerfilMenu(perfilMenu: InsertPerfilMenu): Promise<PerfilMenu>;
  deletePerfilMenusByPerfilId(perfilId: number): Promise<void>;
  createPerfilAccion(perfilAccion: InsertPerfilAccion): Promise<PerfilAccion>;
  deletePerfilAccionesByPerfilMenuId(perfilMenuId: number): Promise<void>;
  getPerfilMenusByPerfilId(perfilId: number): Promise<PerfilMenu[]>;
  getPerfilAccionesByPerfilMenuId(perfilMenuId: number): Promise<PerfilAccion[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userPerfiles: Map<number, UserPerfil>;
  private candidatos: Map<number, Candidato>;
  private perfiles: Map<number, Perfil>;
  private empresas: Map<number, Empresa>;
  private clientes: Map<number, Cliente>;
  private tiposCandidatos: Map<number, TipoCandidato>;
  private documentosTipo: Map<number, DocumentoTipo>;
  private tiposCandidatosDocumentos: Map<number, TipoCandidatoDocumento>;
  private candidatosDocumentos: Map<number, CandidatoDocumento>;

  private menuNodes: Map<number, MenuNode>;
  private menuPermissions: Map<number, MenuPermission>;
  private menuActions: Map<number, MenuAction>;
  private perfilMenus: Map<number, PerfilMenu>;
  private perfilAcciones: Map<number, PerfilAccion>;
  private analistas: Map<number, Analista>;

  currentUserId: number;
  currentUserPerfilId: number;
  currentCandidatoId: number;
  currentPerfilId: number;
  currentEmpresaId: number;
  currentClienteId: number;
  currentTipoCandidatoId: number;
  currentDocumentoTipoId: number;
  currentTipoCandidatoDocumentoId: number;
  currentCandidatoDocumentoId: number;
  currentMenuNodeId: number;
  currentMenuPermissionId: number;
  currentMenuActionId: number;
  currentPerfilMenuId: number;
  currentPerfilAccionId: number;
  currentAnalistaId: number;

  constructor() {
    this.users = new Map();
    this.userPerfiles = new Map();
    this.candidatos = new Map();
    this.perfiles = new Map();
    this.empresas = new Map();
    this.clientes = new Map();
    this.tiposCandidatos = new Map();
    this.documentosTipo = new Map();
    this.tiposCandidatosDocumentos = new Map();
    this.candidatosDocumentos = new Map();
    this.menuNodes = new Map();
    this.menuPermissions = new Map();
    this.menuActions = new Map();
    this.perfilMenus = new Map();
    this.perfilAcciones = new Map();
    this.analistas = new Map();
    this.currentUserId = 1;
    this.currentUserPerfilId = 1;
    this.currentCandidatoId = 1;
    this.currentPerfilId = 1;
    this.currentEmpresaId = 1;
    this.currentClienteId = 1;
    this.currentTipoCandidatoId = 1;
    this.currentDocumentoTipoId = 1;
    this.currentTipoCandidatoDocumentoId = 1;
    this.currentCandidatoDocumentoId = 1;
    this.currentMenuNodeId = 1;
    this.currentMenuPermissionId = 1;
    this.currentMenuActionId = 1;
    this.currentPerfilMenuId = 1;
    this.currentPerfilAccionId = 1;
    this.currentAnalistaId = 1;

    // Create default profiles
    this.perfiles.set(1, {
      id: 1,
      nombre: "administrador",
      descripcion: "Administrador del sistema con todos los permisos",
      permisos: { all: true },
      fechaCreacion: new Date(),
      activo: true,
    });

    this.perfiles.set(2, {
      id: 2,
      nombre: "candidato",
      descripcion: "Candidato con acceso al portal de autogestión",
      permisos: { profile: true, documents: true },
      fechaCreacion: new Date(),
      activo: true,
    });

    this.perfiles.set(3, {
      id: 3,
      nombre: "coordinador",
      descripcion: "Coordinador con permisos de gestión intermedia",
      permisos: { manage_candidates: true, view_reports: true },
      fechaCreacion: new Date(),
      activo: true,
    });

    this.perfiles.set(4, {
      id: 4,
      nombre: "administrador_general",
      descripcion: "Administrador general con permisos completos",
      permisos: { all: true, manage_users: true },
      fechaCreacion: new Date(),
      activo: true,
    });

    this.currentPerfilId = 5;

    // Create default admin user
    this.users.set(1, {
      id: 1,
      identificacion: "12345678",
      primerNombre: "Administrador",
      segundoNombre: null,
      primerApellido: "Principal",
      segundoApellido: null,
      telefono: "555-0000",
      email: "admin@sistema.com",
      username: "admin",
      password: "admin123",
      fechaCreacion: new Date(),
      activo: true,
    });
    this.currentUserId = 2;

    // Create some test candidatos
    this.candidatos.set(1, {
      id: 1,
      email: "candidato1@ejemplo.com",
      password: "123456",
      deberCambiarPassword: false, // Ya cambió la contraseña
      perfilId: 2, // Perfil de candidato
      nombres: "Juan Carlos",
      apellidos: "Pérez González",
      tipoDocumento: "CC",
      numeroDocumento: "1234567890",
      fechaNacimiento: "1990-05-15",
      edad: 33,
      sexo: "Masculino",
      estadoCivil: "Soltero",
      telefono: "3101234567",
      direccion: "Calle 123 #45-67",
      ciudad: "Bogotá",
      cargoAspirado: "Desarrollador Full Stack",
      experienciaLaboral: null,
      eps: "Sanitas",
      arl: "SURA",
      fondoPension: "Porvenir",
      grupoSanguineo: "O+",
      nivelEducativo: "Universitario",
      educacion: null,
      contactoEmergenciaNombre: "María Pérez",
      contactoEmergenciaTelefono: "3109876543",
      contactoEmergenciaRelacion: "Madre",
      hojaDeVida: null,
      fotografia: null,
      fechaRegistro: new Date(),
      estado: "pendiente",
      completado: true,
      empresaId: null, // Candidato creado por admin, no por empresa
    });
    this.currentCandidatoId = 2;

    // Create example empresas
    this.empresas.set(1, {
      id: 1,
      email: "empresa1@ejemplo.com",
      password: "empresa123",
      nombreEmpresa: "TechCorp Solutions",
      nit: "9001234567",
      direccion: "Calle 100 #15-23, Piso 5",
      telefono: "6012345678",
      ciudad: "Bogotá",
      contactoPrincipal: "María González",
      cargoContacto: "Directora de Recursos Humanos",
      fechaRegistro: new Date(),
      estado: "activo",
    });

    this.empresas.set(2, {
      id: 2,
      email: "empresa2@ejemplo.com",
      password: "empresa456",
      nombreEmpresa: "Innovación Digital S.A.S",
      nit: "9007654321",
      direccion: "Carrera 50 #80-15",
      telefono: "6019876543",
      ciudad: "Medellín",
      contactoPrincipal: "Carlos Ramírez",
      cargoContacto: "Gerente General",
      fechaRegistro: new Date(),
      estado: "activo",
    });
    this.currentEmpresaId = 3;

    // Create default tipos de candidatos
    this.tiposCandidatos.set(1, {
      id: 1,
      nombre: "Ingeniero de Sistemas",
      descripcion: "Profesional en desarrollo de software y sistemas",
      activo: true,
      fechaCreacion: new Date(),
    });

    this.tiposCandidatos.set(2, {
      id: 2,
      nombre: "Diseñador Gráfico",
      descripcion: "Profesional en diseño visual y multimedia",
      activo: true,
      fechaCreacion: new Date(),
    });

    this.tiposCandidatos.set(3, {
      id: 3,
      nombre: "Contador",
      descripcion: "Profesional en contabilidad y finanzas",
      activo: true,
      fechaCreacion: new Date(),
    });

    this.currentTipoCandidatoId = 4;

    // Create default documentos tipo
    this.documentosTipo.set(1, {
      id: 1,
      nombre: "Hoja de Vida",
      descripcion: "Curriculum vitae actualizado",
      requerido: true,
      activo: true,
      fechaCreacion: new Date(),
    });

    this.documentosTipo.set(2, {
      id: 2,
      nombre: "Diploma Universitario",
      descripcion: "Titulo profesional universitario",
      requerido: false,
      activo: true,
      fechaCreacion: new Date(),
    });

    this.documentosTipo.set(3, {
      id: 3,
      nombre: "Certificaciones Técnicas",
      descripcion: "Certificados de cursos técnicos relevantes",
      requerido: false,
      activo: true,
      fechaCreacion: new Date(),
    });

    this.documentosTipo.set(4, {
      id: 4,
      nombre: "Portafolio",
      descripcion: "Muestra de trabajos realizados",
      requerido: false,
      activo: true,
      fechaCreacion: new Date(),
    });

    this.documentosTipo.set(5, {
      id: 5,
      nombre: "Certificado Laboral",
      descripcion: "Cartas de recomendación laboral",
      requerido: false,
      activo: true,
      fechaCreacion: new Date(),
    });

    this.currentDocumentoTipoId = 6;

    // Create default tipo-documento relationships
    // Ingeniero de Sistemas
    this.tiposCandidatosDocumentos.set(1, {
      id: 1,
      tipoCandidatoId: 1,
      documentoTipoId: 1, // Hoja de Vida
      obligatorio: true,
      orden: 1,
      fechaCreacion: new Date(),
    });

    this.tiposCandidatosDocumentos.set(2, {
      id: 2,
      tipoCandidatoId: 1,
      documentoTipoId: 2, // Diploma Universitario
      obligatorio: true,
      orden: 2,
      fechaCreacion: new Date(),
    });

    this.tiposCandidatosDocumentos.set(3, {
      id: 3,
      tipoCandidatoId: 1,
      documentoTipoId: 3, // Certificaciones Técnicas
      obligatorio: false,
      orden: 3,
      fechaCreacion: new Date(),
    });

    // Diseñador Gráfico
    this.tiposCandidatosDocumentos.set(4, {
      id: 4,
      tipoCandidatoId: 2,
      documentoTipoId: 1, // Hoja de Vida
      obligatorio: true,
      orden: 1,
      fechaCreacion: new Date(),
    });

    this.tiposCandidatosDocumentos.set(5, {
      id: 5,
      tipoCandidatoId: 2,
      documentoTipoId: 4, // Portafolio
      obligatorio: true,
      orden: 2,
      fechaCreacion: new Date(),
    });

    // Contador
    this.tiposCandidatosDocumentos.set(6, {
      id: 6,
      tipoCandidatoId: 3,
      documentoTipoId: 1, // Hoja de Vida
      obligatorio: true,
      orden: 1,
      fechaCreacion: new Date(),
    });

    this.tiposCandidatosDocumentos.set(7, {
      id: 7,
      tipoCandidatoId: 3,
      documentoTipoId: 2, // Diploma Universitario
      obligatorio: true,
      orden: 2,
      fechaCreacion: new Date(),
    });

    this.tiposCandidatosDocumentos.set(8, {
      id: 8,
      tipoCandidatoId: 3,
      documentoTipoId: 5, // Certificado Laboral
      obligatorio: true,
      orden: 3,
      fechaCreacion: new Date(),
    });

    this.currentTipoCandidatoDocumentoId = 9;
    this.currentCandidatoDocumentoId = 1;

    // Crear analistas de ejemplo
    this.analistas.set(1, {
      id: 1,
      nombre: "Ana María",
      apellido: "González",
      email: "ana.gonzalez@empresa.com",
      telefono: "300-555-0101",
      regional: "Bogotá",
      clienteAsignado: "TechCorp",
      nivelPrioridad: "alto",
      estado: "activo",
      fechaIngreso: new Date("2023-01-15"),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    });

    this.analistas.set(2, {
      id: 2,
      nombre: "Carlos",
      apellido: "Rodríguez",
      email: "carlos.rodriguez@empresa.com",
      telefono: "301-555-0102",
      regional: "Medellín",
      clienteAsignado: "InnovateCorp",
      nivelPrioridad: "medio",
      estado: "activo",
      fechaIngreso: new Date("2023-03-20"),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    });

    this.analistas.set(3, {
      id: 3,
      nombre: "Laura",
      apellido: "Martínez",
      email: "laura.martinez@empresa.com",
      telefono: "302-555-0103",
      regional: "Cali",
      clienteAsignado: null,
      nivelPrioridad: "bajo",
      estado: "activo",
      fechaIngreso: new Date("2023-06-10"),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    });

    this.analistas.set(4, {
      id: 4,
      nombre: "Diego",
      apellido: "Pérez",
      email: "diego.perez@empresa.com",
      telefono: "303-555-0104",
      regional: "Barranquilla",
      clienteAsignado: "GlobalSolutions",
      nivelPrioridad: "alto",
      estado: "inactivo",
      fechaIngreso: new Date("2022-11-05"),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    });

    this.currentAnalistaId = 5;

    // Crear clientes de ejemplo
    this.clientes.set(1, {
      id: 1,
      email: "maria.torres@techcorp.com",
      password: "12345678",
      nombreCompleto: "María Torres",
      empresa: "TechCorp",
      regional: "Bogotá",
      sucursal: "Centro",
      fechaRegistro: new Date("2023-02-10"),
      estado: "activo",
    });

    this.clientes.set(2, {
      id: 2,
      email: "carlos.herrera@innovate.com",
      password: "12345678",
      nombreCompleto: "Carlos Herrera",
      empresa: "InnovateCorp",
      regional: "Medellín",
      sucursal: "Norte",
      fechaRegistro: new Date("2023-04-15"),
      estado: "activo",
    });

    this.currentClienteId = 3;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      identificacion: insertUser.identificacion,
      primerNombre: insertUser.primerNombre,
      segundoNombre: insertUser.segundoNombre || null,
      primerApellido: insertUser.primerApellido,
      segundoApellido: insertUser.segundoApellido || null,
      telefono: insertUser.telefono || null,
      email: insertUser.email,
      username: insertUser.username,
      password: insertUser.password,
      fechaCreacion: new Date(),
      activo: insertUser.activo !== undefined ? insertUser.activo : true,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    // Primero eliminar todas las relaciones usuario-perfil
    await this.deleteUserPerfiles(id);
    // Luego eliminar el usuario
    this.users.delete(id);
  }

  // User-Profile relationship operations
  async getUserPerfiles(userId: number): Promise<Perfil[]> {
    const userPerfiles = Array.from(this.userPerfiles.values()).filter(
      (up) => up.userId === userId
    );
    const perfiles: Perfil[] = [];
    for (const userPerfil of userPerfiles) {
      const perfil = this.perfiles.get(userPerfil.perfilId);
      if (perfil) {
        perfiles.push(perfil);
      }
    }
    return perfiles;
  }

  async createUserPerfil(userPerfil: InsertUserPerfil): Promise<UserPerfil> {
    const id = this.currentUserPerfilId++;
    const newUserPerfil: UserPerfil = {
      id,
      userId: userPerfil.userId,
      perfilId: userPerfil.perfilId,
      fechaAsignacion: new Date(),
    };
    this.userPerfiles.set(id, newUserPerfil);
    return newUserPerfil;
  }

  async deleteUserPerfiles(userId: number): Promise<void> {
    const userPerfiles = Array.from(this.userPerfiles.values()).filter(
      (up) => up.userId === userId
    );
    for (const userPerfil of userPerfiles) {
      this.userPerfiles.delete(userPerfil.id);
    }
  }

  async createUserWithPerfiles(userData: InsertUser, perfilIds: number[]): Promise<{ user: User; perfiles: Perfil[] }> {
    // Crear el usuario
    const user = await this.createUser(userData);
    
    // Crear las relaciones usuario-perfil
    const perfiles: Perfil[] = [];
    for (const perfilId of perfilIds) {
      await this.createUserPerfil({ userId: user.id, perfilId });
      const perfil = this.perfiles.get(perfilId);
      if (perfil) {
        perfiles.push(perfil);
      }
    }
    
    return { user, perfiles };
  }

  async getCandidato(id: number): Promise<Candidato | undefined> {
    return this.candidatos.get(id);
  }

  async getCandidatoByEmail(email: string): Promise<Candidato | undefined> {
    for (const candidato of this.candidatos.values()) {
      if (candidato.email === email) {
        return candidato;
      }
    }
    return undefined;
  }

  async getAllCandidatos(): Promise<Candidato[]> {
    return Array.from(this.candidatos.values());
  }

  async createCandidato(insertCandidato: InsertCandidato): Promise<Candidato> {
    const id = this.currentCandidatoId++;
    const candidato: Candidato = {
      id,
      tipoDocumento: insertCandidato.tipoDocumento,
      numeroDocumento: insertCandidato.numeroDocumento,
      nombres: insertCandidato.nombres,
      apellidos: insertCandidato.apellidos,
      email: insertCandidato.email,
      password: insertCandidato.password,
      telefono: insertCandidato.telefono || null,
      fechaNacimiento: insertCandidato.fechaNacimiento || null,
      edad: insertCandidato.edad || null,
      sexo: insertCandidato.sexo || null,
      estadoCivil: insertCandidato.estadoCivil || null,
      ciudad: insertCandidato.ciudad || null,
      direccion: insertCandidato.direccion || null,
      cargoAspirado: insertCandidato.cargoAspirado || null,
      eps: insertCandidato.eps || null,
      arl: insertCandidato.arl || null,
      fondoPension: insertCandidato.fondoPension || null,
      nivelEducativo: insertCandidato.nivelEducativo || null,
      grupoSanguineo: insertCandidato.grupoSanguineo || null,
      contactoEmergenciaNombre:
        insertCandidato.contactoEmergenciaNombre || null,
      contactoEmergenciaTelefono:
        insertCandidato.contactoEmergenciaTelefono || null,
      contactoEmergenciaRelacion:
        insertCandidato.contactoEmergenciaRelacion || null,
      deberCambiarPassword: insertCandidato.deberCambiarPassword ?? true,
      perfilId: insertCandidato.perfilId || 2, // Default candidato profile
      experienciaLaboral: insertCandidato.experienciaLaboral || null,
      educacion: insertCandidato.educacion || null,
      hojaDeVida: insertCandidato.hojaDeVida || null,
      fotografia: insertCandidato.fotografia || null,
      fechaRegistro: new Date(),
      estado: "pendiente",
      completado: false,
      empresaId: insertCandidato.empresaId || null,
    };
    this.candidatos.set(id, candidato);
    return candidato;
  }

  async updateCandidato(
    id: number,
    updateData: Partial<InsertCandidato>,
  ): Promise<Candidato> {
    const candidato = this.candidatos.get(id);
    if (!candidato) {
      throw new Error(`Candidato with id ${id} not found`);
    }

    const updatedCandidato = { ...candidato, ...updateData };
    this.candidatos.set(id, updatedCandidato);
    return updatedCandidato;
  }

  // Perfil operations
  async getAllPerfiles(): Promise<Perfil[]> {
    return Array.from(this.perfiles.values());
  }

  async getPerfilById(id: number): Promise<Perfil | undefined> {
    return this.perfiles.get(id);
  }

  async getPerfilByNombre(nombre: string): Promise<Perfil | undefined> {
    return Array.from(this.perfiles.values()).find(
      (perfil) => perfil.nombre === nombre,
    );
  }

  async createPerfil(insertPerfil: InsertPerfil): Promise<Perfil> {
    const id = this.currentPerfilId++;
    const perfil: Perfil = {
      id,
      nombre: insertPerfil.nombre,
      descripcion: insertPerfil.descripcion || null,
      permisos: insertPerfil.permisos || null,
      fechaCreacion: new Date(),
      activo: insertPerfil.activo !== undefined ? insertPerfil.activo : true,
    };
    this.perfiles.set(id, perfil);
    return perfil;
  }

  async updatePerfil(
    id: number,
    updateData: Partial<InsertPerfil>,
  ): Promise<Perfil> {
    const perfil = this.perfiles.get(id);
    if (!perfil) {
      throw new Error(`Perfil with id ${id} not found`);
    }

    const updatedPerfil = { ...perfil, ...updateData };
    this.perfiles.set(id, updatedPerfil);
    return updatedPerfil;
  }

  async deletePerfil(id: number): Promise<void> {
    if (!this.perfiles.has(id)) {
      throw new Error(`Perfil with id ${id} not found`);
    }
    this.perfiles.delete(id);
  }

  // Operación especial para crear candidatos desde perfiles
  async createCandidatoFromPerfil(
    data: CreateCandidatoFromPerfil,
  ): Promise<Candidato> {
    // Buscar el perfil de candidato
    const perfilCandidato = await this.getPerfilByNombre("candidato");
    if (!perfilCandidato) {
      throw new Error("Perfil de candidato no encontrado");
    }

    // Crear candidato con contraseña inicial = cédula
    const candidatoData: InsertCandidato = {
      email: data.email,
      password: data.cedula, // Contraseña inicial es la cédula
      deberCambiarPassword: true, // Debe cambiar contraseña en primer login
      perfilId: perfilCandidato.id,
      nombres: data.nombres,
      apellidos: data.apellidos,
      tipoDocumento: data.tipoDocumento,
      numeroDocumento: data.cedula,
      // Campos opcionales con valores por defecto
      fechaNacimiento: null,
      edad: null,
      sexo: null,
      estadoCivil: null,
      telefono: null,
      direccion: null,
      ciudad: null,
      cargoAspirado: null,
      experienciaLaboral: null,
      eps: null,
      arl: null,
      fondoPension: null,
      grupoSanguineo: null,
      nivelEducativo: null,
      educacion: null,
      contactoEmergenciaNombre: null,
      contactoEmergenciaTelefono: null,
      contactoEmergenciaRelacion: null,
      hojaDeVida: null,
      fotografia: null,
      estado: "pendiente",
      completado: false,
    };

    return this.createCandidato(candidatoData);
  }

  // Maestro operations - Tipos de Candidatos
  async getAllTiposCandidatos(): Promise<TipoCandidato[]> {
    return Array.from(this.tiposCandidatos.values()).filter((tc) => tc.activo);
  }

  async getTipoCandidatoById(id: number): Promise<TipoCandidato | undefined> {
    return this.tiposCandidatos.get(id);
  }

  async createTipoCandidato(
    tipoCandidato: InsertTipoCandidato,
  ): Promise<TipoCandidato> {
    const id = this.currentTipoCandidatoId++;
    const nuevo: TipoCandidato = {
      id,
      nombre: tipoCandidato.nombre,
      descripcion: tipoCandidato.descripcion || null,
      activo: tipoCandidato.activo ?? true,
      fechaCreacion: new Date(),
    };
    this.tiposCandidatos.set(id, nuevo);
    return nuevo;
  }

  async updateTipoCandidato(
    id: number,
    tipoCandidato: Partial<InsertTipoCandidato>,
  ): Promise<TipoCandidato> {
    const existing = this.tiposCandidatos.get(id);
    if (!existing) {
      throw new Error("Tipo de candidato no encontrado");
    }
    const updated = { ...existing, ...tipoCandidato };
    this.tiposCandidatos.set(id, updated);
    return updated;
  }

  async deleteTipoCandidato(id: number): Promise<void> {
    const existing = this.tiposCandidatos.get(id);
    if (!existing) {
      throw new Error("Tipo de candidato no encontrado");
    }
    // Soft delete
    existing.activo = false;
    this.tiposCandidatos.set(id, existing);
  }

  // Maestro operations - Documentos Tipo
  async getAllDocumentosTipo(): Promise<DocumentoTipo[]> {
    return Array.from(this.documentosTipo.values()).filter((dt) => dt.activo);
  }

  async getDocumentoTipoById(id: number): Promise<DocumentoTipo | undefined> {
    return this.documentosTipo.get(id);
  }

  async createDocumentoTipo(
    documentoTipo: InsertDocumentoTipo,
  ): Promise<DocumentoTipo> {
    const id = this.currentDocumentoTipoId++;
    const nuevo: DocumentoTipo = {
      id,
      nombre: documentoTipo.nombre,
      descripcion: documentoTipo.descripcion || null,
      requerido: documentoTipo.requerido ?? false,
      activo: documentoTipo.activo ?? true,
      fechaCreacion: new Date(),
    };
    this.documentosTipo.set(id, nuevo);
    return nuevo;
  }

  async updateDocumentoTipo(
    id: number,
    documentoTipo: Partial<InsertDocumentoTipo>,
  ): Promise<DocumentoTipo> {
    const existing = this.documentosTipo.get(id);
    if (!existing) {
      throw new Error("Tipo de documento no encontrado");
    }
    const updated = { ...existing, ...documentoTipo };
    this.documentosTipo.set(id, updated);
    return updated;
  }

  async deleteDocumentoTipo(id: number): Promise<void> {
    const existing = this.documentosTipo.get(id);
    if (!existing) {
      throw new Error("Tipo de documento no encontrado");
    }
    // Soft delete
    existing.activo = false;
    this.documentosTipo.set(id, existing);
  }

  // Maestro operations - Relación Tipos-Documentos
  async getDocumentosByTipoCandidato(
    tipoCandidatoId: number,
  ): Promise<TipoCandidatoDocumento[]> {
    return Array.from(this.tiposCandidatosDocumentos.values())
      .filter((tcd) => tcd.tipoCandidatoId === tipoCandidatoId)
      .sort((a, b) => a.orden - b.orden);
  }

  async updateDocumentosByTipoCandidato(
    tipoCandidatoId: number,
    documentos: InsertTipoCandidatoDocumento[],
  ): Promise<void> {
    // Eliminar relaciones existentes para este tipo de candidato
    const idsToDelete: number[] = [];
    for (const [id, tcd] of this.tiposCandidatosDocumentos.entries()) {
      if (tcd.tipoCandidatoId === tipoCandidatoId) {
        idsToDelete.push(id);
      }
    }
    idsToDelete.forEach((id) => this.tiposCandidatosDocumentos.delete(id));

    // Agregar las nuevas relaciones
    documentos.forEach((doc) => {
      const id = this.currentTipoCandidatoDocumentoId++;
      const nuevo: TipoCandidatoDocumento = {
        id,
        tipoCandidatoId: doc.tipoCandidatoId,
        documentoTipoId: doc.documentoTipoId,
        obligatorio: doc.obligatorio ?? true,
        orden: doc.orden ?? 0,
        fechaCreacion: new Date(),
      };
      this.tiposCandidatosDocumentos.set(id, nuevo);
    });
  }

  // Candidatos Documentos
  async getDocumentosByCandidato(
    candidatoId: number,
  ): Promise<CandidatoDocumento[]> {
    return Array.from(this.candidatosDocumentos.values()).filter(
      (cd) => cd.candidatoId === candidatoId,
    );
  }

  async createCandidatoDocumento(
    candidatoDocumento: InsertCandidatoDocumento,
  ): Promise<CandidatoDocumento> {
    const id = this.currentCandidatoDocumentoId++;
    const nuevo: CandidatoDocumento = {
      id,
      candidatoId: candidatoDocumento.candidatoId,
      documentoTipoId: candidatoDocumento.documentoTipoId,
      archivo: candidatoDocumento.archivo || null,
      nombreArchivo: candidatoDocumento.nombreArchivo || null,
      fechaSubida: new Date(),
      estado: candidatoDocumento.estado ?? "pendiente",
    };
    this.candidatosDocumentos.set(id, nuevo);
    return nuevo;
  }

  async updateCandidatoDocumento(
    id: number,
    candidatoDocumento: Partial<InsertCandidatoDocumento>,
  ): Promise<CandidatoDocumento> {
    const existing = this.candidatosDocumentos.get(id);
    if (!existing) {
      throw new Error("Documento de candidato no encontrado");
    }
    const updated = { ...existing, ...candidatoDocumento };
    this.candidatosDocumentos.set(id, updated);
    return updated;
  }

  async deleteCandidatoDocumento(id: number): Promise<void> {
    this.candidatosDocumentos.delete(id);
  }

  // Empresa operations
  async getEmpresa(id: number): Promise<Empresa | undefined> {
    return this.empresas.get(id);
  }

  async getEmpresaByEmail(email: string): Promise<Empresa | undefined> {
    for (const empresa of this.empresas.values()) {
      if (empresa.email === email) {
        return empresa;
      }
    }
    return undefined;
  }

  async getAllEmpresas(): Promise<Empresa[]> {
    return Array.from(this.empresas.values());
  }

  async createEmpresa(insertEmpresa: InsertEmpresa): Promise<Empresa> {
    const id = this.currentEmpresaId++;
    const empresa: Empresa = {
      id,
      email: insertEmpresa.email,
      password: insertEmpresa.password,
      nombreEmpresa: insertEmpresa.nombreEmpresa,
      nit: insertEmpresa.nit,
      direccion: insertEmpresa.direccion || null,
      telefono: insertEmpresa.telefono || null,
      ciudad: insertEmpresa.ciudad || null,
      contactoPrincipal: insertEmpresa.contactoPrincipal || null,
      cargoContacto: insertEmpresa.cargoContacto || null,
      fechaRegistro: new Date(),
      estado: "activo",
    };
    this.empresas.set(id, empresa);
    return empresa;
  }

  async updateEmpresa(
    id: number,
    updateData: Partial<InsertEmpresa>,
  ): Promise<Empresa> {
    const existing = this.empresas.get(id);
    if (!existing) {
      throw new Error(`Empresa with id ${id} not found`);
    }
    const updated = { ...existing, ...updateData };
    this.empresas.set(id, updated);
    return updated;
  }

  // Candidatos por empresa (para portal de empresas)
  async getCandidatosByEmpresa(empresaId: number): Promise<Candidato[]> {
    return Array.from(this.candidatos.values()).filter(
      (candidato) => candidato.empresaId === empresaId,
    );
  }

  async createCandidatoForEmpresa(
    candidato: InsertCandidato,
    empresaId: number,
  ): Promise<Candidato> {
    const candidatoData = {
      ...candidato,
      empresaId: empresaId,
    };
    return this.createCandidato(candidatoData);
  }

  // Menu operations
  async getAllMenuNodes(): Promise<MenuNode[]> {
    return Array.from(this.menuNodes.values());
  }

  async createMenuNode(insertMenuNode: InsertMenuNode): Promise<MenuNode> {
    const menuNode: MenuNode = {
      id: this.currentMenuNodeId++,
      ...insertMenuNode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.menuNodes.set(menuNode.id, menuNode);
    return menuNode;
  }

  async updateMenuNode(
    id: number,
    updateData: Partial<InsertMenuNode>,
  ): Promise<MenuNode> {
    const existing = this.menuNodes.get(id);
    if (!existing) {
      throw new Error(`MenuNode with id ${id} not found`);
    }

    const updated: MenuNode = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };

    this.menuNodes.set(id, updated);
    return updated;
  }

  async deleteMenuNode(id: number): Promise<void> {
    // Also delete any permissions and actions related to this node
    const permission = Array.from(this.menuPermissions.values()).find(
      (p) => p.nodeId === id,
    );

    if (permission) {
      await this.deleteMenuPermission(permission.id);
    }

    this.menuNodes.delete(id);
  }

  // Menu permissions operations
  async getMenuPermissionByNodeId(
    nodeId: number,
  ): Promise<MenuPermission | undefined> {
    return Array.from(this.menuPermissions.values()).find(
      (permission) => permission.nodeId === nodeId,
    );
  }

  async createMenuPermission(
    insertPermission: InsertMenuPermission,
  ): Promise<MenuPermission> {
    const permission: MenuPermission = {
      id: this.currentMenuPermissionId++,
      ...insertPermission,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.menuPermissions.set(permission.id, permission);
    return permission;
  }

  async updateMenuPermission(
    id: number,
    updateData: Partial<InsertMenuPermission>,
  ): Promise<MenuPermission> {
    const existing = this.menuPermissions.get(id);
    if (!existing) {
      throw new Error(`MenuPermission with id ${id} not found`);
    }

    const updated: MenuPermission = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };

    this.menuPermissions.set(id, updated);
    return updated;
  }

  async deleteMenuPermission(id: number): Promise<void> {
    // Also delete any actions related to this permission
    const actions = Array.from(this.menuActions.values()).filter(
      (action) => action.permissionId === id,
    );

    for (const action of actions) {
      await this.deleteMenuAction(action.id);
    }

    this.menuPermissions.delete(id);
  }

  // Menu actions operations
  async getMenuActionsByPermissionId(
    permissionId: number,
  ): Promise<MenuAction[]> {
    return Array.from(this.menuActions.values()).filter(
      (action) => action.permissionId === permissionId,
    );
  }

  async createMenuAction(insertAction: InsertMenuAction): Promise<MenuAction> {
    const action: MenuAction = {
      id: this.currentMenuActionId++,
      ...insertAction,
      tipo: insertAction.tipo || "Accion",
      createdAt: new Date(),
    };

    this.menuActions.set(action.id, action);
    return action;
  }

  async deleteMenuAction(id: number): Promise<void> {
    this.menuActions.delete(id);
  }

  // Implementaciones de Analistas
  async getAllAnalistas(): Promise<Analista[]> {
    return Array.from(this.analistas.values());
  }

  async getAnalistaById(id: number): Promise<Analista | undefined> {
    return this.analistas.get(id);
  }

  async getAnalistaByEmail(email: string): Promise<Analista | undefined> {
    return Array.from(this.analistas.values()).find(
      (analista) => analista.email === email,
    );
  }

  async createAnalista(insertAnalista: InsertAnalista): Promise<Analista> {
    const analista: Analista = {
      id: this.currentAnalistaId++,
      nombre: insertAnalista.nombre,
      apellido: insertAnalista.apellido,
      email: insertAnalista.email,
      telefono: insertAnalista.telefono || null,
      regional: insertAnalista.regional,
      clienteAsignado: insertAnalista.clienteAsignado || null,
      nivelPrioridad: insertAnalista.nivelPrioridad || "medio",
      estado: insertAnalista.estado || "activo",
      fechaIngreso: insertAnalista.fechaIngreso || new Date(),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };

    this.analistas.set(analista.id, analista);
    return analista;
  }

  async updateAnalista(
    id: number,
    updateData: Partial<InsertAnalista>,
  ): Promise<Analista> {
    const existing = this.analistas.get(id);
    if (!existing) {
      throw new Error("Analista no encontrado");
    }

    const updated: Analista = {
      ...existing,
      ...updateData,
      fechaActualizacion: new Date(),
    };

    this.analistas.set(id, updated);
    return updated;
  }

  async deleteAnalista(id: number): Promise<void> {
    if (!this.analistas.has(id)) {
      throw new Error("Analista no encontrado");
    }
    this.analistas.delete(id);
  }

  // Clientes operations
  async getAllClientes(): Promise<Cliente[]> {
    return Array.from(this.clientes.values());
  }

  async getClienteById(id: number): Promise<Cliente | undefined> {
    return this.clientes.get(id);
  }

  async getClienteByEmail(email: string): Promise<Cliente | undefined> {
    return Array.from(this.clientes.values()).find(
      (cliente) => cliente.email === email,
    );
  }

  async createCliente(insertCliente: InsertCliente): Promise<Cliente> {
    const id = this.currentClienteId++;
    const cliente: Cliente = {
      id,
      email: insertCliente.email,
      password: insertCliente.password,
      nombreCompleto: insertCliente.nombreCompleto,
      empresa: insertCliente.empresa,
      regional: insertCliente.regional,
      sucursal: insertCliente.sucursal,
      fechaRegistro: new Date(),
      estado: insertCliente.estado || "activo",
    };
    this.clientes.set(id, cliente);
    return cliente;
  }

  async updateCliente(
    id: number,
    updateData: Partial<InsertCliente>,
  ): Promise<Cliente> {
    const cliente = this.clientes.get(id);
    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }

    const updated: Cliente = {
      ...cliente,
      ...updateData,
    };
    this.clientes.set(id, updated);
    return updated;
  }

  async deleteCliente(id: number): Promise<void> {
    this.clientes.delete(id);
  }

  // Perfil menus and actions operations
  async createPerfilMenu(perfilMenu: InsertPerfilMenu): Promise<PerfilMenu> {
    const newPerfilMenu: PerfilMenu = {
      id: this.currentPerfilMenuId++,
      ...perfilMenu,
      createdAt: new Date(),
    };

    this.perfilMenus.set(newPerfilMenu.id, newPerfilMenu);
    return newPerfilMenu;
  }

  async deletePerfilMenusByPerfilId(perfilId: number): Promise<void> {
    const perfilMenusToDelete = Array.from(this.perfilMenus.values()).filter(
      (perfilMenu) => perfilMenu.perfilId === perfilId,
    );

    for (const perfilMenu of perfilMenusToDelete) {
      // Delete related actions first
      await this.deletePerfilAccionesByPerfilMenuId(perfilMenu.id);
      this.perfilMenus.delete(perfilMenu.id);
    }
  }

  async createPerfilAccion(perfilAccion: InsertPerfilAccion): Promise<PerfilAccion> {
    const newPerfilAccion: PerfilAccion = {
      id: this.currentPerfilAccionId++,
      ...perfilAccion,
      createdAt: new Date(),
    };

    this.perfilAcciones.set(newPerfilAccion.id, newPerfilAccion);
    return newPerfilAccion;
  }

  async deletePerfilAccionesByPerfilMenuId(perfilMenuId: number): Promise<void> {
    const accionesToDelete = Array.from(this.perfilAcciones.values()).filter(
      (accion) => accion.perfilMenuId === perfilMenuId,
    );

    for (const accion of accionesToDelete) {
      this.perfilAcciones.delete(accion.id);
    }
  }

  async getPerfilMenusByPerfilId(perfilId: number): Promise<PerfilMenu[]> {
    return Array.from(this.perfilMenus.values()).filter(
      (perfilMenu) => perfilMenu.perfilId === perfilId,
    );
  }

  async getPerfilAccionesByPerfilMenuId(perfilMenuId: number): Promise<PerfilAccion[]> {
    return Array.from(this.perfilAcciones.values()).filter(
      (accion) => accion.perfilMenuId === perfilMenuId,
    );
  }
}

export const storage = new MemStorage();
