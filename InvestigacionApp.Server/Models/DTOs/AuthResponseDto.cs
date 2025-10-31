// InvestigacionApp.Server/Models/DTOs/AuthResponseDto.cs

namespace InvestigacionApp.Server.Models.DTOs
{
    public class AuthResponseDto
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
    }
}
