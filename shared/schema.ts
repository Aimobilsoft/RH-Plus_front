import { pgTable, text, serial, integer, boolean, varchar, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla de usuarios admin
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Tabla de tipos de perfiles/roles
export const perfiles = pgTable("perfiles", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 50 }).notNull().unique(), // administrador, candidato, coordinador, administrador_general
  descripcion: text("descripcion"),
  permisos: jsonb("permisos"), // JSON con permisos específicos
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
  activo: boolean("activo").default(true),
});

// Tabla de candidatos que se registran
export const candidatos = pgTable("candidatos", {
  id: serial("id").primaryKey(),
  // Credenciales de acceso
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  deberCambiarPassword: boolean("deber_cambiar_password").default(true), // Para forzar cambio en primer login
  perfilId: integer("perfil_id").references(() => perfiles.id), // Referencia al tipo de perfil
  
  // Información personal
  nombres: varchar("nombres", { length: 100 }).notNull(),
  apellidos: varchar("apellidos", { length: 100 }).notNull(),
  tipoDocumento: varchar("tipo_documento", { length: 10 }).notNull(),
  numeroDocumento: varchar("numero_documento", { length: 20 }).notNull().unique(),
  fechaNacimiento: date("fecha_nacimiento"),
  edad: integer("edad"),
  sexo: varchar("sexo", { length: 10 }),
  estadoCivil: varchar("estado_civil", { length: 20 }),
  telefono: varchar("telefono", { length: 20 }),
  direccion: text("direccion"),
  ciudad: varchar("ciudad", { length: 100 }),
  
  // Información laboral
  cargoAspirado: varchar("cargo_aspirado", { length: 100 }),
  experienciaLaboral: jsonb("experiencia_laboral"),
  
  // Información de salud
  eps: varchar("eps", { length: 100 }),
  arl: varchar("arl", { length: 100 }),
  fondoPension: varchar("fondo_pension", { length: 100 }),
  grupoSanguineo: varchar("grupo_sanguineo", { length: 5 }),
  
  // Educación
  nivelEducativo: varchar("nivel_educativo", { length: 50 }),
  educacion: jsonb("educacion"),
  
  // Contacto de emergencia
  contactoEmergenciaNombre: varchar("contacto_emergencia_nombre", { length: 100 }),
  contactoEmergenciaTelefono: varchar("contacto_emergencia_telefono", { length: 20 }),
  contactoEmergenciaRelacion: varchar("contacto_emergencia_relacion", { length: 50 }),
  
  // Archivos
  hojaDeVida: text("hoja_de_vida"), // URL o base64 del archivo
  fotografia: text("fotografia"), // URL o base64 de la foto
  
  // Metadatos
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
  estado: varchar("estado", { length: 20 }).default("pendiente"), // pendiente, aprobado, rechazado
  completado: boolean("completado").default(false),
});

// Esquemas de inserción
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPerfilSchema = createInsertSchema(perfiles).omit({
  id: true,
  fechaCreacion: true,
});

export const insertCandidatoSchema = createInsertSchema(candidatos).omit({
  id: true,
  fechaRegistro: true,
});

export const createCandidatoFromPerfilSchema = z.object({
  cedula: z.string().min(6, "Cédula requerida"),
  nombres: z.string().min(2, "Nombres requeridos"),
  apellidos: z.string().min(2, "Apellidos requeridos"),
  email: z.string().email("Email inválido"),
  tipoDocumento: z.string().default("CC"),
});

// Tipos TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPerfil = z.infer<typeof insertPerfilSchema>;
export type Perfil = typeof perfiles.$inferSelect;
export type InsertCandidato = z.infer<typeof insertCandidatoSchema>;
export type Candidato = typeof candidatos.$inferSelect;
export type CreateCandidatoFromPerfil = z.infer<typeof createCandidatoFromPerfilSchema>;
