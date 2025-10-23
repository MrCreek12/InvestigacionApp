// InvestigacionApp.Server/Models/DTOs/RegisterDto.cs

using System.ComponentModel.DataAnnotations;

namespace InvestigacionApp.Server.Models.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "El nombre de usuario debe tener entre 3 y 50 caracteres")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "Email inv�lido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contrase�a es requerida")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contrase�a debe tener al menos 6 caracteres")]
        public string Password { get; set; } = string.Empty;

        public string Rol { get; set; } = "User";
    }
}
