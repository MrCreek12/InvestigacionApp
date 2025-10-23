// InvestigacionApp.Server/Models/Usuario.cs

using System.ComponentModel.DataAnnotations;

namespace InvestigacionApp.Server.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Rol { get; set; } = "User"; // "Admin" o "User"
    }
}
