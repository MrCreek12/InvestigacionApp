// InvestigacionApp.Server/Models/DTOs/LoginDto.cs

using System.ComponentModel.DataAnnotations;

namespace InvestigacionApp.Server.Models.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida")]
        public string Password { get; set; } = string.Empty;
    }
}
