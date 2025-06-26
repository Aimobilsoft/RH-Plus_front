import { 
  users, 
  candidatos,
  type User, 
  type InsertUser,
  type Candidato,
  type InsertCandidato 
} from "@shared/schema";

export interface IStorage {
  // Admin user operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Candidato operations
  getCandidato(id: number): Promise<Candidato | undefined>;
  getCandidatoByEmail(email: string): Promise<Candidato | undefined>;
  getAllCandidatos(): Promise<Candidato[]>;
  createCandidato(candidato: InsertCandidato): Promise<Candidato>;
  updateCandidato(id: number, candidato: Partial<InsertCandidato>): Promise<Candidato>;
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
      eps: "Sanitas",
      arl: "SURA",
      grupoSanguineo: "O+",
      nivelEducativo: "Universitario",
      contactoEmergenciaNombre: "María Pérez",
      contactoEmergenciaTelefono: "3109876543",
      contactoEmergenciaRelacion: "Madre",
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
      ...insertCandidato,
      id,
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
