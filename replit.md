# Replit.md - Medical System Management Application

## Overview

This is a full-stack medical practice management application built with modern web technologies. The system focuses on managing occupational health services, including companies, candidates, medical appointments, service orders, and certificate generation. It's designed as a comprehensive solution for medical clinics that provide occupational health services to businesses.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Query (@tanstack/react-query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router for client-side navigation
- **Component Structure**: Modular component architecture with reusable UI components

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful API endpoints
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for fast bundling
- **API Design**: REST-based architecture with /api prefix for all endpoints

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **Schema Management**: Centralized schema definitions in shared/schema.ts
- **Migrations**: Drizzle Kit for database migrations
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations

## Key Components

### Data Models
- **Users**: Basic user authentication system with username/password
- **Companies**: Business entities that require occupational health services
- **Candidates**: Individuals applying for positions or requiring medical evaluations
- **Medical Services**: Configurable services offered by the clinic
- **Orders**: Service requests linking companies, candidates, and medical services
- **Appointments**: Scheduled medical consultations
- **Certificates**: Medical certificates generated after evaluations

### Core Modules
1. **Registration System**: Management of companies, candidates, and service providers
2. **Order Management**: Creation and tracking of medical service orders
3. **Clinical Module**: Medical scheduling, consultations, and patient records
4. **Certificate Generation**: Automated certificate creation and management
5. **Security Module**: User management, profiles, and permissions

### External Integrations
- **Neon Database**: Serverless PostgreSQL hosting via @neondatabase/serverless
- **File Storage**: Configurable document management system
- **PDF Generation**: Certificate and report generation capabilities

## Data Flow

1. **Company Registration**: Businesses register to access occupational health services
2. **Candidate Management**: Individual profiles are created for medical evaluations
3. **Order Creation**: Companies request specific medical services for candidates
4. **Appointment Scheduling**: Medical consultations are scheduled based on orders
5. **Medical Evaluation**: Healthcare providers conduct examinations
6. **Certificate Generation**: Medical certificates are produced based on evaluation results
7. **Record Management**: All data is stored for compliance and historical tracking

## External Dependencies

### Core Dependencies
- React ecosystem (React, React Router, React Query)
- UI Components (Radix UI primitives, Lucide React icons)
- Form handling (React Hook Form, Hookform Resolvers)
- Validation (Zod, Drizzle Zod)
- Database (Drizzle ORM, Neon Database connector)
- Styling (Tailwind CSS, Class Variance Authority)
- Development tools (Vite, TypeScript, ESBuild)

### Development Tools
- Replit integration for cloud development
- Hot module replacement for fast development
- TypeScript for type safety
- ESLint and Prettier (implied by structure)

## Deployment Strategy

### Development Environment
- Replit-hosted development with hot reload
- PostgreSQL database provisioning
- Environment variable management for database connections
- Development server on port 5000

### Production Deployment
- Vite build process for optimized frontend assets
- ESBuild bundling for Node.js backend
- Autoscale deployment target on Replit
- Static asset serving through Express
- Database migrations through Drizzle Kit

### Build Process
1. Frontend assets built with Vite to dist/public
2. Backend bundled with ESBuild to dist/
3. Static files served from public directory
4. Environment-specific configurations

## Changelog

```
Changelog:

- January 3, 2025. Enhanced candidate management with approval system and quick send features
  * Added candidate approval/rejection system with notes functionality for hiring decisions
  * Implemented quick send buttons for WhatsApp and Email in candidate list using stored QR configuration
  * Moved approval buttons to dropdown menu for better UI organization after user feedback
  * Added progress percentage display matching candidate portal calculation (based on 10 required fields)
  * Enhanced candidate interface with visual progress bars and completion indicators
  * Created comprehensive approval workflow with notes for tracking hiring requirements and follow-ups
  * Added approval status tracking with color-coded badges and statistics dashboard
  * Integrated database schema changes with notasAprobacion field for storing approval decisions
- June 27, 2025. Menu management system and company visible fields implementation
  * Implemented comprehensive menu management interface with tree view navigation
  * Added visible fields checklist to company form (cargo, salario, celular, correo, fecha_ingreso, direccion, jornada_laboral)
  * Created interactive tree structure for menu configuration with expand/collapse functionality
  * Built permission management form with dynamic action fields (código, nombre, tipo)
  * Added action buttons for menu node management (crear, eliminar, visualizar, vista/nom)
  * Integrated proper form validation and submission handling for menu permissions
  * Menu system includes drag-and-drop preparation for future organization features

- January 2, 2025. Enhanced analistas module with cascading selects and improved forms
  * Created CascadingSelects component with Regional → Zona → Sucursal hierarchy using React/TypeScript
  * Implemented automatic dependency resets when parent level changes (regional change clears zona/sucursal)  
  * Added mock data structure: 7 regionales, 6 zonas, 6 sucursales with hierarchical relationships
  * Only displays options where estado === 1 as per business requirements
  * Updated analista creation form with enhanced fields: cliente asignado, nivel prioridad (1-5 scale), ubicación completa
  * Added comprehensive form validation and real-time feedback for location selection
  * Created test page (/test-cascading) for standalone component verification
  * Fixed SelectItem error by replacing empty string values with meaningful defaults
  * Integrated component into existing analistas workflow with proper state management
- January 1, 2025. Complete Analistas management module implementation
  * Added comprehensive Analistas module with full CRUD operations and advanced management features
  * Implemented new database schema for analistas table with fields: nombre, apellido, email, telefono, regional, clienteAsignado, nivelPrioridad, estado, fechaIngreso
  * Created three main pages: AnalistasPage (listing with advanced filters), CrearAnalistaPage (form creation), EditarAnalistaPage (edit functionality)
  * Added new sidebar menu item "Analistas" with UserCheck icon positioned before "Maestro" section
  * Implemented comprehensive filtering system: search by name/email/regional/client, filter by regional, priority level, and status
  * Added statistics dashboard showing: total analysts, active analysts, high priority analysts, and number of regionals
  * Included Excel export functionality for analyst data with CSV format download
  * Created complete backend API with routes: GET /api/analistas, POST /api/analistas, PUT /api/analistas/:id, DELETE /api/analistas/:id
  * Added validation schema and proper error handling for all analyst operations
  * Implemented sample data with 4 example analysts from different regionals (Bogotá, Medellín, Cali, Barranquilla)
  * Features include: email uniqueness validation, priority levels (alto/medio/bajo), status management (activo/inactivo), regional assignments
  * Full integration with existing authentication and navigation system

- December 30, 2024. Complete enterprise portal implementation
  * Built complete portal de empresas with authentication, dashboard, and candidate management
  * Implemented enterprise-specific candidate creation and isolation (companies only see their own candidates)  
  * Added database schemas for empresas table with business information and NIT
  * Created comprehensive dashboard with candidate statistics and management actions
  * Implemented candidate listing with filtering by status and search functionality
  * Added detailed candidate view pages showing complete information for enterprise review
  * Extended session management to support empresa userType alongside admin and candidato
  * Created API routes for enterprise login, profile management, and candidate operations
  * Added enterprise login access from main admin portal for easy discovery
  * Complete candidate isolation: each empresa only sees candidates they created
  * Portal includes: login, dashboard with stats, create candidates, view candidate list, detailed candidate view
- June 27, 2025. Maestro-detalle system implementation for dynamic candidate document requirements
  * Implemented complete maestro-detalle system allowing companies to configure document requirements by candidate type
  * Added new sidebar section "Maestro" with comprehensive management interface for candidate types and document types
  * Restructured navigation: "Ordenes" simplified to "Expedicion de Orden" and "Certificados" to "Expedicion de Certificados" as single menu items instead of dropdowns
  * Created TiposCandidatosPage with dual-panel interface for managing candidate types (Ingeniero, Diseñador, Contador) and document types (CV, Diploma, Certificaciones, Portafolio)
  * Implemented configuration system allowing administrators to define which documents are required for each candidate type
  * Added complete backend support with new database schemas, storage methods, and API endpoints
  * System now supports flexible document requirements: engineers need CV+Diploma+Certifications, designers need CV+Portfolio, accountants need CV+Diploma+Work Certificate
  * Foundation laid for candidate portal integration where candidates will see different document upload requirements based on their selected type
- June 27, 2025. UI modernization and minimalist design improvements  
  * Updated login page to be more minimalist: removed green logo/shield, changed "Sistema Médico" to "Recursos humanos", "Acceso Administrativo" to "control de seguridad"
  * Eliminated "Portal Candidatos" button from dashboard header for cleaner interface
  * Removed "Clínica" section entirely from sidebar navigation
  * Modernized sidebar design: removed dropdown arrows (▼), increased font sizes, improved typography with font-medium classes
  * Enhanced "Recursos Humanos" title with larger text-2xl font for better hierarchy
  * Applied consistent text sizing: text-base for main menu items, text-sm for submenu items
- June 27, 2025. User interface improvements and page-based forms implementation
  * Removed redundant buttons from profiles page header to eliminate duplication
  * Converted modal-based forms to page-based forms following "empresa afiliadas" style
  * Created separate pages for each user type creation: CrearCandidatoPage, CrearAdministradorPage, CrearCoordinadorPage, CrearAdminGeneralPage
  * Implemented color-coded interface: green for candidatos, red for administradores, blue for coordinadores, purple for administradores generales
  * Added proper navigation with "Volver" buttons and breadcrumb-style headers
  * Fixed authentication issues that were causing slow page loads - temporarily disabled auth checks for development
  * All form pages now use full-page layouts instead of modal dialogs for better user experience
- June 27, 2025. Complete user profiles and security management system implemented
  * Full profiles management system with 4 user types: administrador, candidato, coordinador, administrador_general
  * Candidate creation workflow from profiles: admin creates candidate with cedula/name/email, generates account with email as username and cedula as initial password
  * Administrative user creation system for coordinador and administrador_general types with custom username and temporary password (12345678)
  * Forced password change system for first-time candidate login with security validations and requirements
  * Comprehensive password change page with validation (min 8 chars, uppercase, lowercase, number)
  * Backend routes for creating both candidate and administrative users with proper validation
  * Updated database schema with extended user fields for administrative roles
- June 26, 2025. UI improvements and bug fixes
  * Fixed critical blank screen issue by diagnosing React/Vite configuration problems
  * Successfully changed all blue UI elements to green color scheme
  * Removed "Create Candidate" button from admin candidates page (edit-only mode)
  * Removed "¿No tienes cuenta? Regístrate aquí" text from candidate login
  * Fixed logout button 404 error - now properly redirects to admin login (/)
  * Enhanced DatosPersonalesForm with organized color-coded sections
  * Completed modal redesign for candidate registration with professional layout
- June 26, 2025. Migration from Lovable to Replit completed successfully
  * Dual portal system implemented (admin + candidate self-registration)
  * PostgreSQL database integration configured  
  * Session-based authentication system added
  * Admin login as first view with protected routes
  * Candidate registration, login, and profile management created
  * Dashboard UI cleaned: removed logout button and candidate portal card
  * Simplified authentication with immediate credential validation (admin/admin123)
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```