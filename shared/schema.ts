import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  varchar,
  timestamp,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla de usuarios admin
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  nombres: varchar("nombres", { length: 100 }),
  apellidos: varchar("apellidos", { length: 100 }),
  email: varchar("email", { length: 255 }),
  tipoUsuario: varchar("tipo_usuario", { length: 50 }), // administrador, coordinador, administrador_general, cliente
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
  numeroDocumento: varchar("numero_documento", { length: 20 })
    .notNull()
    .unique(),
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
  contactoEmergenciaNombre: varchar("contacto_emergencia_nombre", {
    length: 100,
  }),
  contactoEmergenciaTelefono: varchar("contacto_emergencia_telefono", {
    length: 20,
  }),
  contactoEmergenciaRelacion: varchar("contacto_emergencia_relacion", {
    length: 50,
  }),

  // Archivos
  hojaDeVida: text("hoja_de_vida"), // URL o base64 del archivo
  fotografia: text("fotografia"), // URL o base64 de la foto

  // Metadatos
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
  estado: varchar("estado", { length: 20 }).default("pendiente"), // pendiente, aprobado, rechazado
  completado: boolean("completado").default(false),
  empresaId: integer("empresa_id").references(() => empresas.id), // Referencia a la empresa que creó el candidato
});

// Tabla de empresas/usuarios del portal
export const empresas = pgTable("empresas", {
  id: serial("id").primaryKey(),
  // Credenciales de acceso
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),

  // Información de la empresa
  nombreEmpresa: varchar("nombre_empresa", { length: 200 }).notNull(),
  nit: varchar("nit", { length: 20 }).notNull().unique(),
  direccion: text("direccion"),
  telefono: varchar("telefono", { length: 20 }),
  ciudad: varchar("ciudad", { length: 100 }),
  contactoPrincipal: varchar("contacto_principal", { length: 100 }),
  cargoContacto: varchar("cargo_contacto", { length: 100 }),

  // Metadatos
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
  estado: varchar("estado", { length: 20 }).default("activo"), // activo, inactivo
});

// Tabla de clientes
export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  // Credenciales de acceso
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),

  // Información personal
  nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
  empresa: varchar("empresa", { length: 200 }).notNull(),
  regional: varchar("regional", { length: 100 }).notNull(),
  sucursal: varchar("sucursal", { length: 100 }).notNull(),

  // Metadatos
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
  estado: varchar("estado", { length: 20 }).default("activo"), // activo, inactivo
});

// Esquemas de inserción
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  nombres: true,
  apellidos: true,
  email: true,
  tipoUsuario: true,
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

export const createAdminUserSchema = z.object({
  nombres: z.string().min(2, "Nombres requeridos"),
  apellidos: z.string().min(2, "Apellidos requeridos"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Username debe tener al menos 3 caracteres"),
  tipoUsuario: z.enum([
    "administrador",
    "coordinador",
    "administrador_general",
  ]),
});

export const insertEmpresaSchema = createInsertSchema(empresas).omit({
  id: true,
  fechaRegistro: true,
});

export const insertClienteSchema = createInsertSchema(clientes).omit({
  id: true,
  fechaRegistro: true,
});

export const createClienteSchema = z.object({
  nombreCompleto: z.string().min(2, "Nombre completo requerido"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .optional(),
  empresa: z.string().min(2, "Empresa requerida"),
  regional: z.string().min(2, "Regional requerida"),
  sucursal: z.string().min(2, "Sucursal requerida"),
});

export const createEmpresaSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Password debe tener al menos 8 caracteres"),
  nombreEmpresa: z.string().min(2, "Nombre de empresa requerido"),
  nit: z.string().min(6, "NIT requerido"),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  ciudad: z.string().optional(),
  contactoPrincipal: z.string().min(2, "Contacto principal requerido"),
  cargoContacto: z.string().optional(),
});

// Tipos TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPerfil = z.infer<typeof insertPerfilSchema>;
export type Perfil = typeof perfiles.$inferSelect;
export type InsertCandidato = z.infer<typeof insertCandidatoSchema>;
export type Candidato = typeof candidatos.$inferSelect;
export type CreateCandidatoFromPerfil = z.infer<
  typeof createCandidatoFromPerfilSchema
>;
export type CreateAdminUser = z.infer<typeof createAdminUserSchema>;
export type InsertEmpresa = z.infer<typeof insertEmpresaSchema>;
export type Empresa = typeof empresas.$inferSelect;
export type CreateEmpresa = z.infer<typeof createEmpresaSchema>;

// Tipos TypeScript para clientes
export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Cliente = typeof clientes.$inferSelect;
export type CreateCliente = z.infer<typeof createClienteSchema>;

// Tabla maestro para tipos de candidatos
export const tiposCandidatos = pgTable("tipos_candidatos", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull().unique(), // "Ingeniero", "Diseñador", "Contador", etc.
  descripcion: text("descripcion"),
  activo: boolean("activo").default(true),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});

// Tabla de documentos disponibles en el sistema
export const documentosTipo = pgTable("documentos_tipo", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull().unique(), // "Hoja de Vida", "Diploma", "Certificaciones", etc.
  descripcion: text("descripcion"),
  requerido: boolean("requerido").default(false), // Si es obligatorio por defecto
  activo: boolean("activo").default(true),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});

// Tabla relación: qué documentos requiere cada tipo de candidato
export const tiposCandidatosDocumentos = pgTable(
  "tipos_candidatos_documentos",
  {
    id: serial("id").primaryKey(),
    tipoCandidatoId: integer("tipo_candidato_id")
      .references(() => tiposCandidatos.id)
      .notNull(),
    documentoTipoId: integer("documento_tipo_id")
      .references(() => documentosTipo.id)
      .notNull(),
    obligatorio: boolean("obligatorio").default(true),
    orden: integer("orden").default(0), // Para ordenar los documentos en el formulario
    fechaCreacion: timestamp("fecha_creacion").defaultNow(),
  },
);

// Tabla para almacenar los documentos subidos por candidatos
export const candidatosDocumentos = pgTable("candidatos_documentos", {
  id: serial("id").primaryKey(),
  candidatoId: integer("candidato_id")
    .references(() => candidatos.id)
    .notNull(),
  documentoTipoId: integer("documento_tipo_id")
    .references(() => documentosTipo.id)
    .notNull(),
  archivo: text("archivo"), // URL o path del archivo
  nombreArchivo: varchar("nombre_archivo", { length: 255 }),
  fechaSubida: timestamp("fecha_subida").defaultNow(),
  estado: varchar("estado", { length: 20 }).default("pendiente"), // "pendiente", "aprobado", "rechazado"
});

// Schemas de validación
export const insertTipoCandidatoSchema = createInsertSchema(
  tiposCandidatos,
).omit({
  id: true,
  fechaCreacion: true,
});

export const insertDocumentoTipoSchema = createInsertSchema(
  documentosTipo,
).omit({
  id: true,
  fechaCreacion: true,
});

export const insertTipoCandidatoDocumentoSchema = createInsertSchema(
  tiposCandidatosDocumentos,
).omit({
  id: true,
  fechaCreacion: true,
});

export const insertCandidatoDocumentoSchema = createInsertSchema(
  candidatosDocumentos,
).omit({
  id: true,
  fechaSubida: true,
});

// Tipos TypeScript para las nuevas tablas
export type InsertTipoCandidato = z.infer<typeof insertTipoCandidatoSchema>;
export type TipoCandidato = typeof tiposCandidatos.$inferSelect;
export type InsertDocumentoTipo = z.infer<typeof insertDocumentoTipoSchema>;
export type DocumentoTipo = typeof documentosTipo.$inferSelect;
export type InsertTipoCandidatoDocumento = z.infer<
  typeof insertTipoCandidatoDocumentoSchema
>;
export type TipoCandidatoDocumento =
  typeof tiposCandidatosDocumentos.$inferSelect;
export type InsertCandidatoDocumento = z.infer<
  typeof insertCandidatoDocumentoSchema
>;
export type CandidatoDocumento = typeof candidatosDocumentos.$inferSelect;

// Menu management schemas
export const menuNodes = pgTable("menu_nodes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  tipo: varchar("tipo", { length: 10 }).notNull(), // 'folder' or 'file'
  parentId: integer("parent_id").references(() => menuNodes.id),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menuPermissions = pgTable("menu_permissions", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id")
    .references(() => menuNodes.id)
    .notNull(),
  nombreVista: varchar("nombre_vista", { length: 255 }).notNull(),
  ruta: varchar("ruta", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menuActions = pgTable("menu_actions", {
  id: serial("id").primaryKey(),
  permissionId: integer("permission_id")
    .references(() => menuPermissions.id)
    .notNull(),
  codigo: varchar("codigo", { length: 100 }).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull().default("Accion"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertMenuNodeSchema = createInsertSchema(menuNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuPermissionSchema = createInsertSchema(
  menuPermissions,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuActionSchema = createInsertSchema(menuActions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertMenuNode = z.infer<typeof insertMenuNodeSchema>;
export type MenuNode = typeof menuNodes.$inferSelect;
export type InsertMenuPermission = z.infer<typeof insertMenuPermissionSchema>;
export type MenuPermission = typeof menuPermissions.$inferSelect;
export type InsertMenuAction = z.infer<typeof insertMenuActionSchema>;
export type MenuAction = typeof menuActions.$inferSelect;

// Tabla de analistas
export const analistas = pgTable("analistas", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  telefono: varchar("telefono", { length: 20 }),
  regional: varchar("regional", { length: 100 }).notNull(),
  clienteAsignado: varchar("cliente_asignado", { length: 100 }),
  nivelPrioridad: varchar("nivel_prioridad", { length: 20 })
    .notNull()
    .default("medio"), // "alto", "medio", "bajo"
  estado: varchar("estado", { length: 20 }).notNull().default("activo"), // "activo", "inactivo"
  fechaIngreso: timestamp("fecha_ingreso").defaultNow(),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
  fechaActualizacion: timestamp("fecha_actualizacion").defaultNow(),
});

// Esquemas de validación para analistas
export const insertAnalistaSchema = createInsertSchema(analistas).omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
}).extend({
  nivelPrioridad: z.number().min(1).max(5).transform(String), // Acepta número pero lo convierte a string
  fechaIngreso: z.string().transform((str) => new Date(str)), // Acepta string de fecha y lo convierte a Date
});

// Tipos TypeScript para analistas
export type InsertAnalista = z.infer<typeof insertAnalistaSchema>;
export type Analista = typeof analistas.$inferSelect;
