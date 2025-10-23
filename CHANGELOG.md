# Resumen de Cambios - Sistema de Autenticaci�n JWT

## ? Archivos Creados

### Backend (.NET 8)
- `Models/Usuario.cs` - Modelo de usuario
- `Models/DTOs/LoginDto.cs` - DTO para login
- `Models/DTOs/RegisterDto.cs` - DTO para registro
- `Models/DTOs/AuthResponseDto.cs` - DTO de respuesta de autenticaci�n
- `Services/JwtService.cs` - Servicio para generaci�n de tokens JWT
- `Controllers/AuthController.cs` - Controlador de autenticaci�n (Login/Register)
- `Database/CreateUsuarioTable.sql` - Script SQL para crear tabla de usuarios

### Frontend (React + Vite)
- `src/services/authService.js` - Servicio de autenticaci�n
- `src/components/Login.jsx` - Componente de login
- `src/components/Login.css` - Estilos del login

### Documentaci�n
- `README_AUTENTICACION.md` - Gu�a completa del sistema de autenticaci�n

## ?? Archivos Modificados

### Backend
- `Program.cs` - Configuraci�n de JWT Authentication y Authorization
- `appsettings.json` - Configuraci�n de JwtSettings
- `Controllers/PiezasController.cs` - Agregado [Authorize] y roles
- `Models/DbContextPiezas.cs` - Agregado DbSet<Usuario>
- `Models/Pieza.cs` - Limpieza de c�digo

### Frontend
- `src/services/piezaService.js` - Agregado token JWT en headers
- `src/App.jsx` - Implementaci�n de login y protecci�n de rutas
- `src/App.css` - Estilos mejorados

## ??? Archivos Eliminados
- `Database/CleanUsuarios.sql` - Script temporal de depuraci�n
- `Database/InsertAdminUser.sql` - Script temporal de depuraci�n

## ?? Funcionalidades Implementadas

1. **Autenticaci�n JWT completa**
   - Registro de usuarios
   - Login con username o email
   - Generaci�n y validaci�n de tokens
   - Hash seguro de contrase�as

2. **Autorizaci�n basada en roles**
   - Rol "Admin" con permisos completos
   - Rol "User" solo lectura
   - Endpoints protegidos con [Authorize]

3. **Frontend con React**
   - Formulario de login
   - Almacenamiento de token en localStorage
   - Protecci�n de rutas
   - Manejo de permisos por rol

4. **Seguridad**
   - Contrase�as hasheadas con PasswordHasher
   - Tokens JWT con expiraci�n
   - CORS configurado
   - Validaci�n de datos

## ?? Dependencias Agregadas

**Backend:**
- Microsoft.AspNetCore.Authentication.JwtBearer v8.0.20
- System.IdentityModel.Tokens.Jwt v8.14.0

**Frontend:**
- (Sin cambios - usa las dependencias existentes de React)

## ?? Configuraci�n Requerida

1. Ejecutar script SQL para crear tabla Usuarios
2. Ajustar ConnectionString en appsettings.json
3. Cambiar JwtSettings.SecretKey en producci�n
4. Crear usuario administrador inicial v�a /api/auth/register

## ?? Testing

- Compilaci�n exitosa ?
- Todos los endpoints funcionan correctamente ?
- Login funciona con username y email ?
- Autorizaci�n por roles funciona ?

## ?? Notas

- El sistema acepta contrase�as en texto plano de usuarios legacy y las migra autom�ticamente a hash
- Los tokens expiran despu�s de 24 horas (configurable)
- Swagger incluye soporte para JWT Bearer tokens
