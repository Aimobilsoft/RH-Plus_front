import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCandidatoSchema, createCandidatoFromPerfilSchema, createAdminUserSchema, createEmpresaSchema, insertAnalistaSchema } from "@shared/schema";
import { z } from "zod";

// Session middleware for simple login
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    candidatoId?: number;
    empresaId?: number;
    userType?: 'admin' | 'candidato' | 'empresa';
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Test route to diagnose the problem
  app.get("/api/test", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Test</title></head>
      <body style="background: yellow; padding: 20px;">
        <h1 style="color: red; font-size: 48px;">SERVER TEST WORKING</h1>
        <p>Express server is responding correctly at ${new Date().toLocaleString()}</p>
        <script>console.log("Test page loaded successfully");</script>
      </body>
      </html>
    `);
  });

  // Temporary auto-login route for development
  app.get("/api/auto-login", async (req, res) => {
    try {
      // Get the admin user
      const adminUser = await storage.getUserByUsername('admin');
      if (adminUser) {
        req.session.userId = adminUser.id;
        req.session.userType = 'admin';
        res.json({ 
          message: "Auto-login exitoso", 
          user: { id: adminUser.id, username: adminUser.username },
          session: { userId: req.session.userId, userType: req.session.userType }
        });
      } else {
        res.status(404).json({ message: "Usuario admin no encontrado" });
      }
    } catch (error) {
      console.error("Error en auto-login:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Debug route to check session
  app.get("/api/session-debug", (req, res) => {
    res.json({ 
      session: req.session,
      userId: req.session.userId,
      userType: req.session.userType,
      sessionId: req.sessionID
    });
  });
  
  // Admin Login Routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username y password son requeridos" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      req.session.userId = user.id;
      req.session.userType = 'admin';
      
      res.json({ message: "Login exitoso", user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error("Error en login admin:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  // Check auth status
  app.get("/api/auth/status", (req, res) => {
    if (req.session.userId && req.session.userType) {
      res.json({ 
        authenticated: true, 
        userType: req.session.userType,
        userId: req.session.userId 
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Candidato Login Routes
  app.post("/api/candidato/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email y password son requeridos" });
      }
      
      const candidato = await storage.getCandidatoByEmail(email);
      if (!candidato || candidato.password !== password) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      req.session.candidatoId = candidato.id;
      req.session.userType = 'candidato';
      
      res.json({ 
        message: "Login exitoso", 
        deberCambiarPassword: candidato.deberCambiarPassword,
        candidato: { 
          id: candidato.id, 
          email: candidato.email, 
          nombres: candidato.nombres,
          apellidos: candidato.apellidos,
          completado: candidato.completado 
        } 
      });
    } catch (error) {
      console.error("Error en login candidato:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/candidato/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  // Candidato Registration
  app.post("/api/candidato/register", async (req, res) => {
    try {
      const validatedData = insertCandidatoSchema.parse(req.body);
      
      // Check if email already exists
      const existingCandidato = await storage.getCandidatoByEmail(validatedData.email);
      if (existingCandidato) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      
      const candidato = await storage.createCandidato(validatedData);
      
      // Auto login after registration
      req.session.candidatoId = candidato.id;
      req.session.userType = 'candidato';
      
      res.status(201).json({ 
        message: "Candidato registrado exitosamente",
        candidato: {
          id: candidato.id,
          email: candidato.email,
          nombres: candidato.nombres,
          apellidos: candidato.apellidos,
          completado: candidato.completado
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error registrando candidato:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Get current session info
  app.get("/api/auth/me", (req, res) => {
    if (req.session.userId && req.session.userType === 'admin') {
      res.json({ userType: 'admin', userId: req.session.userId });
    } else if (req.session.candidatoId && req.session.userType === 'candidato') {
      res.json({ userType: 'candidato', candidatoId: req.session.candidatoId });
    } else {
      res.status(401).json({ message: "No hay sesión activa" });
    }
  });

  // Candidato profile management
  app.get("/api/candidato/profile", async (req, res) => {
    try {
      if (!req.session.candidatoId || req.session.userType !== 'candidato') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const candidato = await storage.getCandidato(req.session.candidatoId);
      if (!candidato) {
        return res.status(404).json({ message: "Candidato no encontrado" });
      }
      
      // Don't send password in response
      const { password, ...candidatoData } = candidato;
      res.json(candidatoData);
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/candidato/cambiar-password", async (req, res) => {
    try {
      if (!req.session.candidatoId || req.session.userType !== 'candidato') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const { passwordActual, passwordNueva } = req.body;
      
      if (!passwordActual || !passwordNueva) {
        return res.status(400).json({ message: "Contraseña actual y nueva son requeridas" });
      }
      
      const candidato = await storage.getCandidato(req.session.candidatoId);
      if (!candidato) {
        return res.status(404).json({ message: "Candidato no encontrado" });
      }
      
      // Verificar contraseña actual
      if (candidato.password !== passwordActual) {
        return res.status(400).json({ message: "Contraseña actual incorrecta" });
      }
      
      // Actualizar contraseña y marcar que ya no debe cambiarla
      const updatedCandidato = await storage.updateCandidato(req.session.candidatoId, {
        password: passwordNueva,
        deberCambiarPassword: false,
      });
      
      res.json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.put("/api/candidato/profile", async (req, res) => {
    try {
      if (!req.session.candidatoId || req.session.userType !== 'candidato') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const updateData = req.body;
      delete updateData.id; // Don't allow ID updates
      delete updateData.email; // Don't allow email updates for now
      
      const updatedCandidato = await storage.updateCandidato(req.session.candidatoId, updateData);
      
      const { password, ...candidatoData } = updatedCandidato;
      res.json({ message: "Perfil actualizado exitosamente", candidato: candidatoData });
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Admin routes to manage candidatos
  app.get("/api/admin/candidatos", async (req, res) => {
    try {
      if (!req.session.userId || req.session.userType !== 'admin') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const candidatos = await storage.getAllCandidatos();
      // Remove passwords from response
      const safeCandidatos = candidatos.map(({ password, ...candidato }) => candidato);
      
      res.json(safeCandidatos);
    } catch (error) {
      console.error("Error obteniendo candidatos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.get("/api/admin/candidatos/:id", async (req, res) => {
    try {
      if (!req.session.userId || req.session.userType !== 'admin') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const candidatoId = parseInt(req.params.id);
      const candidato = await storage.getCandidato(candidatoId);
      
      if (!candidato) {
        return res.status(404).json({ message: "Candidato no encontrado" });
      }
      
      const { password, ...candidatoData } = candidato;
      res.json(candidatoData);
    } catch (error) {
      console.error("Error obteniendo candidato:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Rutas de perfiles
  app.get("/api/perfiles", async (req, res) => {
    try {
      // Temporarily disabled auth check for debugging
      // if (!req.session.userId || req.session.userType !== 'admin') {
      //   return res.status(401).json({ message: "No autorizado" });
      // }
      
      const perfiles = await storage.getAllPerfiles();
      res.json(perfiles);
    } catch (error) {
      console.error("Error obteniendo perfiles:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/perfiles/create-candidato", async (req, res) => {
    try {
      // Temporarily disabled auth check for debugging
      // if (!req.session.userId || req.session.userType !== 'admin') {
      //   return res.status(401).json({ message: "No autorizado" });
      // }
      
      const validatedData = createCandidatoFromPerfilSchema.parse(req.body);
      
      // Check if email already exists
      const existingCandidato = await storage.getCandidatoByEmail(validatedData.email);
      if (existingCandidato) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      
      // Check if document number already exists
      const allCandidatos = await storage.getAllCandidatos();
      const existingDocument = allCandidatos.find(c => c.numeroDocumento === validatedData.cedula);
      if (existingDocument) {
        return res.status(400).json({ message: "El número de documento ya está registrado" });
      }
      
      const candidato = await storage.createCandidatoFromPerfil(validatedData);
      
      res.status(201).json({ 
        message: "Candidato creado exitosamente",
        candidato: {
          id: candidato.id,
          email: candidato.email,
          nombres: candidato.nombres,
          apellidos: candidato.apellidos,
          numeroDocumento: candidato.numeroDocumento,
          deberCambiarPassword: candidato.deberCambiarPassword
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error creando candidato desde perfil:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/perfiles/create-admin", async (req, res) => {
    try {
      // Temporarily disabled auth check for debugging
      // if (!req.session.userId || req.session.userType !== 'admin') {
      //   return res.status(401).json({ message: "No autorizado" });
      // }
      
      const validatedData = createAdminUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "El nombre de usuario ya está registrado" });
      }
      
      // Create user with default password
      const userData = {
        username: validatedData.username,
        password: "12345678", // Default password
        nombres: validatedData.nombres,
        apellidos: validatedData.apellidos,
        email: validatedData.email,
        tipoUsuario: validatedData.tipoUsuario,
      };
      
      const user = await storage.createUser(userData);
      
      res.status(201).json({ 
        message: "Usuario administrativo creado exitosamente",
        user: {
          id: user.id,
          username: user.username,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          tipoUsuario: user.tipoUsuario
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error creando usuario administrativo:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Rutas del Maestro - Tipos de Candidatos
  app.get("/api/maestro/tipos-candidatos", async (req, res) => {
    try {
      const tiposCandidatos = await storage.getAllTiposCandidatos();
      res.json(tiposCandidatos);
    } catch (error) {
      console.error("Error obteniendo tipos de candidatos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/maestro/tipos-candidatos", async (req, res) => {
    try {
      const tipoCandidato = await storage.createTipoCandidato(req.body);
      res.status(201).json(tipoCandidato);
    } catch (error) {
      console.error("Error creando tipo de candidato:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Rutas del Maestro - Documentos Tipo
  app.get("/api/maestro/documentos-tipo", async (req, res) => {
    try {
      const documentosTipo = await storage.getAllDocumentosTipo();
      res.json(documentosTipo);
    } catch (error) {
      console.error("Error obteniendo tipos de documentos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/maestro/documentos-tipo", async (req, res) => {
    try {
      const documentoTipo = await storage.createDocumentoTipo(req.body);
      res.status(201).json(documentoTipo);
    } catch (error) {
      console.error("Error creando tipo de documento:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Rutas del Maestro - Relación Tipos-Documentos
  app.get("/api/maestro/tipos-candidatos-documentos/:tipoCandidatoId", async (req, res) => {
    try {
      const tipoCandidatoId = parseInt(req.params.tipoCandidatoId);
      const documentos = await storage.getDocumentosByTipoCandidato(tipoCandidatoId);
      res.json(documentos);
    } catch (error) {
      console.error("Error obteniendo documentos por tipo de candidato:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.put("/api/maestro/tipos-candidatos-documentos/:tipoCandidatoId", async (req, res) => {
    try {
      const tipoCandidatoId = parseInt(req.params.tipoCandidatoId);
      const { documentos } = req.body;
      await storage.updateDocumentosByTipoCandidato(tipoCandidatoId, documentos);
      res.json({ message: "Configuración actualizada exitosamente" });
    } catch (error) {
      console.error("Error actualizando documentos por tipo de candidato:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // =====================================
  // RUTAS DEL PORTAL DE EMPRESAS
  // =====================================

  // Login de empresas
  app.post("/api/empresa/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña requeridos" });
      }
      
      const empresa = await storage.getEmpresaByEmail(email);
      
      if (!empresa || empresa.password !== password) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      req.session.empresaId = empresa.id;
      req.session.userType = 'empresa';
      
      res.json({ 
        message: "Login exitoso",
        empresa: {
          id: empresa.id,
          nombreEmpresa: empresa.nombreEmpresa,
          email: empresa.email,
          nit: empresa.nit
        }
      });
    } catch (error) {
      console.error("Error en login de empresa:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Profile de empresa autenticada
  app.get("/api/empresa/profile", async (req, res) => {
    try {
      if (!req.session.empresaId || req.session.userType !== 'empresa') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const empresa = await storage.getEmpresa(req.session.empresaId);
      if (!empresa) {
        return res.status(404).json({ message: "Empresa no encontrada" });
      }
      
      res.json({
        id: empresa.id,
        nombreEmpresa: empresa.nombreEmpresa,
        email: empresa.email,
        nit: empresa.nit,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        ciudad: empresa.ciudad,
        contactoPrincipal: empresa.contactoPrincipal,
        cargoContacto: empresa.cargoContacto
      });
    } catch (error) {
      console.error("Error obteniendo perfil de empresa:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Dashboard stats para empresa
  app.get("/api/empresa/dashboard-stats", async (req, res) => {
    try {
      if (!req.session.empresaId || req.session.userType !== 'empresa') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const candidatos = await storage.getCandidatosByEmpresa(req.session.empresaId);
      
      res.json({
        totalCandidatos: candidatos.length,
        candidatosPendientes: candidatos.filter(c => c.estado === 'pendiente').length,
        candidatosAprobados: candidatos.filter(c => c.estado === 'aprobado').length,
        candidatosRechazados: candidatos.filter(c => c.estado === 'rechazado').length
      });
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Lista de candidatos de la empresa
  app.get("/api/empresa/candidatos", async (req, res) => {
    try {
      if (!req.session.empresaId || req.session.userType !== 'empresa') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const candidatos = await storage.getCandidatosByEmpresa(req.session.empresaId);
      res.json(candidatos);
    } catch (error) {
      console.error("Error obteniendo candidatos de la empresa:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Crear candidato por empresa
  app.post("/api/empresa/candidatos", async (req, res) => {
    try {
      if (!req.session.empresaId || req.session.userType !== 'empresa') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const validatedData = insertCandidatoSchema.parse(req.body);
      const candidato = await storage.createCandidatoForEmpresa(validatedData, req.session.empresaId);
      
      res.status(201).json({
        message: "Candidato creado exitosamente",
        candidato
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      console.error("Error creando candidato:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Obtener candidato específico de la empresa
  app.get("/api/empresa/candidatos/:id", async (req, res) => {
    try {
      if (!req.session.empresaId || req.session.userType !== 'empresa') {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const candidatoId = parseInt(req.params.id);
      const candidato = await storage.getCandidato(candidatoId);
      
      if (!candidato || candidato.empresaId !== req.session.empresaId) {
        return res.status(404).json({ message: "Candidato no encontrado" });
      }
      
      res.json(candidato);
    } catch (error) {
      console.error("Error obteniendo candidato:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Logout de empresa
  app.post("/api/empresa/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error en logout:", err);
        return res.status(500).json({ message: "Error en logout" });
      }
      res.json({ message: "Logout exitoso" });
    });
  });

  // ===== RUTAS DE ANALISTAS =====
  
  // Obtener todos los analistas
  app.get("/api/analistas", async (req, res) => {
    try {
      const analistas = await storage.getAllAnalistas();
      res.json(analistas);
    } catch (error) {
      console.error("Error obteniendo analistas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Obtener analista por ID
  app.get("/api/analistas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analista = await storage.getAnalistaById(id);
      
      if (!analista) {
        return res.status(404).json({ message: "Analista no encontrado" });
      }
      
      res.json(analista);
    } catch (error) {
      console.error("Error obteniendo analista:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Crear nuevo analista
  app.post("/api/analistas", async (req, res) => {
    try {
      const validatedData = insertAnalistaSchema.parse(req.body);
      
      // Verificar que el email no esté en uso
      const existingAnalista = await storage.getAnalistaByEmail(validatedData.email);
      if (existingAnalista) {
        return res.status(400).json({ message: "El email ya está en uso" });
      }
      
      const analista = await storage.createAnalista(validatedData);
      res.status(201).json({ message: "Analista creado exitosamente", analista });
    } catch (error) {
      console.error("Error creando analista:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Actualizar analista
  app.put("/api/analistas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      // Si se está actualizando el email, verificar que no esté en uso
      if (updateData.email) {
        const existingAnalista = await storage.getAnalistaByEmail(updateData.email);
        if (existingAnalista && existingAnalista.id !== id) {
          return res.status(400).json({ message: "El email ya está en uso" });
        }
      }
      
      const analista = await storage.updateAnalista(id, updateData);
      res.json({ message: "Analista actualizado exitosamente", analista });
    } catch (error) {
      console.error("Error actualizando analista:", error);
      if (error.message === "Analista no encontrado") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Eliminar analista
  app.delete("/api/analistas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAnalista(id);
      res.json({ message: "Analista eliminado exitosamente" });
    } catch (error) {
      console.error("Error eliminando analista:", error);
      if (error.message === "Analista no encontrado") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // ===== RUTAS DE CLIENTES =====
  
  // Obtener todos los clientes
  app.get("/api/clientes", async (req, res) => {
    try {
      const clientes = await storage.getAllClientes();
      res.json(clientes);
    } catch (error) {
      console.error("Error obteniendo clientes:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Crear nuevo cliente
  app.post("/api/clientes", async (req, res) => {
    try {
      const clienteData = req.body;
      
      // Generar contraseña temporal si no se proporciona
      if (!clienteData.password) {
        clienteData.password = "TempPass123!";
      }

      const cliente = await storage.createCliente(clienteData);
      res.status(201).json(cliente);
    } catch (error) {
      console.error("Error creando cliente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Obtener cliente por ID
  app.get("/api/clientes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cliente = await storage.getClienteById(id);
      
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      
      res.json(cliente);
    } catch (error) {
      console.error("Error obteniendo cliente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Actualizar cliente
  app.put("/api/clientes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const clienteData = req.body;
      
      const cliente = await storage.updateCliente(id, clienteData);
      res.json(cliente);
    } catch (error) {
      console.error("Error actualizando cliente:", error);
      if (error.message === "Cliente no encontrado") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Eliminar cliente
  app.delete("/api/clientes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCliente(id);
      res.json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
