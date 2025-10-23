# Resumen de Cambios - Sistema de Autenticación JWT

## ? Archivos Creados

### Backend (.NET 8)
- `Models/Usuario.cs` - Modelo de usuario
- `Models/DTOs/LoginDto.cs` - DTO para login
- `Models/DTOs/RegisterDto.cs` - DTO para registro
- `Models/DTOs/AuthResponseDto.cs` - DTO de respuesta de autenticación
- `Services/JwtService.cs` - Servicio para generación de tokens JWT
- `Controllers/AuthController.cs` - Controlador de autenticación (Login/Register)
- `Database/CreateUsuarioTable.sql` - Script SQL para crear tabla de usuarios

### Frontend (React + Vite)
- `src/services/authService.js` - Servicio de autenticación
- `src/components/Login.jsx` - Componente de login
- `src/components/Login.css` - Estilos del login

### Documentación
- `README_AUTENTICACION.md` - Guía completa del sistema de autenticación

## ?? Archivos Modificados

### Backend
- `Program.cs` - Configuración de JWT Authentication y Authorization
- `appsettings.json` - Configuración de JwtSettings
- `Controllers/PiezasController.cs` - Agregado [Authorize] y roles
- `Models/DbContextPiezas.cs` - Agregado DbSet<Usuario>
- `Models/Pieza.cs` - Limpieza de código

### Frontend
- `src/services/piezaService.js` - Agregado token JWT en headers
- `src/App.jsx` - Implementación de login y protección de rutas
- `src/App.css` - Estilos mejorados

## ??? Archivos Eliminados
- `Database/CleanUsuarios.sql` - Script temporal de depuración
- `Database/InsertAdminUser.sql` - Script temporal de depuración

## ?? Funcionalidades Implementadas

1. **Autenticación JWT completa**
   - Registro de usuarios
   - Login con username o email
   - Generación y validación de tokens
   - Hash seguro de contraseñas

2. **Autorización basada en roles**
   - Rol "Admin" con permisos completos
   - Rol "User" solo lectura
   - Endpoints protegidos con [Authorize]

3. **Frontend con React**
   - Formulario de login
   - Almacenamiento de token en localStorage
   - Protección de rutas
   - Manejo de permisos por rol

4. **Seguridad**
   - Contraseñas hasheadas con PasswordHasher
   - Tokens JWT con expiración
   - CORS configurado
   - Validación de datos

## ?? Dependencias Agregadas

**Backend:**
- Microsoft.AspNetCore.Authentication.JwtBearer v8.0.20
- System.IdentityModel.Tokens.Jwt v8.14.0

**Frontend:**
- (Sin cambios - usa las dependencias existentes de React)

## ?? Configuración Requerida

1. Ejecutar script SQL para crear tabla Usuarios
2. Ajustar ConnectionString en appsettings.json
3. Cambiar JwtSettings.SecretKey en producción
4. Crear usuario administrador inicial vía /api/auth/register

## ?? Testing

- Compilación exitosa ?
- Todos los endpoints funcionan correctamente ?
- Login funciona con username y email ?
- Autorización por roles funciona ?

## ?? Notas

- El sistema acepta contraseñas en texto plano de usuarios legacy y las migra automáticamente a hash
- Los tokens expiran después de 24 horas (configurable)
- Swagger incluye soporte para JWT Bearer tokens
