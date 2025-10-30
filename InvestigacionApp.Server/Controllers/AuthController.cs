// InvestigacionApp.Server/Controllers/AuthController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvestigacionApp.Models;
using InvestigacionApp.Server.Models;
using InvestigacionApp.Server.Models.DTOs;
using InvestigacionApp.Server.Services;
using Microsoft.AspNetCore.Identity;

namespace InvestigacionApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DbContextPiezas _context;
        private readonly JwtService _jwtService;
        private readonly PasswordHasher<Usuario> _passwordHasher;

        public AuthController(DbContextPiezas context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
            _passwordHasher = new PasswordHasher<Usuario>();
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            try
            {
                // Verificar si el usuario ya existe
                if (await _context.Usuarios.AnyAsync(u => u.Username == registerDto.Username))
                {
                    return BadRequest(new { message = "El nombre de usuario ya está en uso" });
                }

                if (await _context.Usuarios.AnyAsync(u => u.Email == registerDto.Email))
                {
                    return BadRequest(new { message = "El email ya está registrado" });
                }

                // Crear nuevo usuario
                var usuario = new Usuario
                {
                    Username = registerDto.Username,
                    Email = registerDto.Email,
                    Rol = registerDto.Rol
                };

                // Hash de la contraseña
                usuario.Password = _passwordHasher.HashPassword(usuario, registerDto.Password);

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                // Generar token JWT
                var token = _jwtService.GenerateToken(usuario);

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    Username = usuario.Username,
                    Email = usuario.Email,
                    Rol = usuario.Rol,
                    Expiration = _jwtService.GetTokenExpiration()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            try
            {
                // Buscar usuario por Username O Email
                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Username == loginDto.Username || u.Email == loginDto.Username);

                if (usuario == null)
                {
                    return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
                }

                // Verificar contraseña
                bool passwordValid = false;
                
                // Primero verificar si es texto plano (para usuarios antiguos)
                if (usuario.Password == loginDto.Password)
                {
                    passwordValid = true;
                    
                    // Actualizar a hash (migración automática)
                    usuario.Password = _passwordHasher.HashPassword(usuario, loginDto.Password);
                    _context.Usuarios.Update(usuario);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Intentar verificar con hash solo si no es texto plano
                    try
                    {
                        var result = _passwordHasher.VerifyHashedPassword(usuario, usuario.Password, loginDto.Password);
                        
                        if (result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded)
                        {
                            passwordValid = true;
                        }
                    }
                    catch (FormatException)
                    {
                        // Si falla el formato del hash, no es válido
                        passwordValid = false;
                    }
                }
                
                if (!passwordValid)
                {
                    return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
                }

                // Generar token JWT
                var token = _jwtService.GenerateToken(usuario);

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    Username = usuario.Username,
                    Email = usuario.Email,
                    Rol = usuario.Rol,
                    Expiration = _jwtService.GetTokenExpiration()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
