import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCandidatoSchema } from "@shared/schema";
import { z } from "zod";

// Session middleware for simple login
interface Session {
  userId?: number;
  candidatoId?: number;
  userType?: 'admin' | 'candidato';
}

declare module 'express-session' {
  interface SessionData extends Session {}
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Admin Login Routes
  app.post("/api/admin/login", async (req, res) => {
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

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
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

  const httpServer = createServer(app);
  return httpServer;
}
