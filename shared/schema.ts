import { pgTable, text, serial, integer, boolean, varchar, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla de usuarios admin
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Tabla de candidatos que se registran
export const candidatos = pgTable("candidatos", {
  id: serial("id").primaryKey(),
  // Credenciales de acceso
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCandidatoSchema = createInsertSchema(candidatos).omit({
  id: true,
  fechaRegistro: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCandidato = z.infer<typeof insertCandidatoSchema>;
export type Candidato = typeof candidatos.$inferSelect;
