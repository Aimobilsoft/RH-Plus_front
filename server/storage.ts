import { 
  users, 
  candidatos,
  perfiles,
  type User, 
  type InsertUser,
  type Candidato,
  type InsertCandidato,
  type Perfil,
  type InsertPerfil,
  type CreateCandidatoFromPerfil 
} from "@shared/schema";

export interface IStorage {
  // Admin user operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  updateCandidato(id: number, candidato: Partial<InsertCandidato>): Promise<Candidato>;
  
  // Operaciones especiales para crear candidatos desde perfiles
  createCandidatoFromPerfil(data: CreateCandidatoFromPerfil): Promise<Candidato>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private candidatos: Map<number, Candidato>;
  private perfiles: Map<number, Perfil>;
  currentUserId: number;
  currentCandidatoId: number;
  currentPerfilId: number;

  constructor() {
    this.users = new Map();
    this.candidatos = new Map();
    this.perfiles = new Map();
    this.currentUserId = 1;
    this.currentCandidatoId = 1;
    this.currentPerfilId = 1;

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
      username: "admin",
      password: "admin123",
      nombres: "Administrador",
      apellidos: "Principal",
      email: "admin@sistema.com",
      tipoUsuario: "administrador"
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
    });
    this.currentCandidatoId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
      contactoEmergenciaNombre: insertCandidato.contactoEmergenciaNombre || null,
      contactoEmergenciaTelefono: insertCandidato.contactoEmergenciaTelefono || null,
      contactoEmergenciaRelacion: insertCandidato.contactoEmergenciaRelacion || null,
      deberCambiarPassword: insertCandidato.deberCambiarPassword ?? true,
      perfilId: insertCandidato.perfilId || 2, // Default candidato profile
      experienciaLaboral: insertCandidato.experienciaLaboral || null,
      educacion: insertCandidato.educacion || null,
      hojaDeVida: insertCandidato.hojaDeVida || null,
      fotografia: insertCandidato.fotografia || null,
      fechaRegistro: new Date(),
      estado: "pendiente",
      completado: false,
    };
    this.candidatos.set(id, candidato);
    return candidato;
  }

  async updateCandidato(id: number, updateData: Partial<InsertCandidato>): Promise<Candidato> {
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
      ...insertPerfil,
      id,
      fechaCreacion: new Date(),
    };
    this.perfiles.set(id, perfil);
    return perfil;
  }

  async updatePerfil(id: number, updateData: Partial<InsertPerfil>): Promise<Perfil> {
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
  async createCandidatoFromPerfil(data: CreateCandidatoFromPerfil): Promise<Candidato> {
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
}

export const storage = new MemStorage();
