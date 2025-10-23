# Sistema de Autenticación JWT - InvestigacionApp

## ?? Descripción
Sistema de autenticación completo con JWT (JSON Web Tokens) para proteger los endpoints de la API REST.

## ?? Configuración Inicial

### 1. Instalar Paquetes NuGet

```powershell
cd InvestigacionApp.Server
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
```

### 2. Crear Tabla de Usuarios

Ejecuta el siguiente script SQL en tu base de datos:

```sql
USE InvestigacionBD;
GO

CREATE TABLE Usuarios (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(200) NOT NULL UNIQUE,
    Email VARCHAR(200) NOT NULL UNIQUE,
    Password VARCHAR(200) NOT NULL,
    Rol VARCHAR(100) NOT NULL DEFAULT 'User'
);
GO
```

### 3. Configuración

La configuración JWT se encuentra en `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "TuClaveSecretaSuperSeguraDeAlMenos32Caracteres!",
    "Issuer": "InvestigacionApp",
    "Audience": "InvestigacionAppUsers",
    "ExpirationHours": 24
  }
}
```

?? **IMPORTANTE:** Cambia `SecretKey` por una clave segura en producción.

## ?? Endpoints de la API

### Autenticación (Sin protección)

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario",
  "email": "usuario@example.com",
  "password": "Password123*",
  "rol": "User"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "usuario",    // Puede ser username o email
  "password": "Password123*"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "usuario",
  "email": "usuario@example.com",
  "rol": "User",
  "expiration": "2025-01-24T..."
}
```

### Piezas (Protegidos con JWT)

| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| GET | `/api/piezas` | Autenticado | Listar todas |
| GET | `/api/piezas/{id}` | Autenticado | Obtener una |
| POST | `/api/piezas` | **Solo Admin** | Crear |
| PUT | `/api/piezas/{id}` | **Solo Admin** | Actualizar |
| DELETE | `/api/piezas/{id}` | **Solo Admin** | Eliminar |

**Ejemplo de uso con token:**
```http
GET /api/piezas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ?? Roles y Permisos

| Acción | User | Admin |
|--------|------|-------|
| Ver piezas | ? | ? |
| Crear pieza | ? | ? |
| Editar pieza | ? | ? |
| Eliminar pieza | ? | ? |

## ?? Uso desde el Frontend

### 1. Login
```javascript
const response = await fetch('https://localhost:7276/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Admin123*' })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### 2. Peticiones Autenticadas
```javascript
const token = localStorage.getItem('token');

const response = await fetch('https://localhost:7276/api/piezas', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

## ??? Ejecutar la Aplicación

### Backend
```powershell
cd InvestigacionApp.Server
dotnet run
```

### Frontend
```powershell
cd investigacionapp.client
npm install
npm run dev
```

O simplemente ejecuta desde Visual Studio (F5).

## ?? Crear Usuario Administrador

Usa el endpoint `/api/auth/register`:

```http
POST https://localhost:7276/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@test.com",
  "password": "Admin123*",
  "rol": "Admin"
}
```

## ?? Notas de Seguridad

1. Las contraseñas se almacenan hasheadas con `PasswordHasher` de ASP.NET Identity
2. Los tokens JWT expiran después de 24 horas (configurable)
3. El sistema acepta tanto username como email para el login
4. Los tokens incluyen claims: UserId, Username, Email y Role

## ?? Swagger

Accede a la documentación interactiva en: `https://localhost:7276/swagger`

1. Haz clic en **Authorize** (??)
2. Ingresa tu token (sin "Bearer")
3. Prueba los endpoints protegidos

## ? Troubleshooting

**Error 401 Unauthorized:**
- Verifica que el token sea válido y no haya expirado
- Asegúrate de incluir el header `Authorization: Bearer {token}`

**Error 403 Forbidden:**
- Tu usuario no tiene permisos (necesitas rol Admin)

**No puedo hacer login:**
- Verifica que el usuario exista en la base de datos
- Asegúrate de usar la contraseña correcta
- Puedes usar username o email indistintamente
