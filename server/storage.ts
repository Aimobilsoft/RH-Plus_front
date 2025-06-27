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
  currentUserId: number;
  currentCandidatoId: number;

  constructor() {
    this.users = new Map();
    this.candidatos = new Map();
    this.currentUserId = 1;
    this.currentCandidatoId = 1;

    // Create default admin user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "admin123"
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
      experienciaLaboral: null,
      educacion: null,
      hojaDeVida: null,
      fotografia: null
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
      hojaDeVida: insertCandidato.hojaDeVida || null,
      fotografia: insertCandidato.fotografia || null,
      experienciaLaboral: insertCandidato.experienciaLaboral || null,
      educacion: insertCandidato.educacion || null,
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
}

export const storage = new MemStorage();
