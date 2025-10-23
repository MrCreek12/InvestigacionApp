// InvestigacionApp.Server/Models/Pieza.cs

using System.ComponentModel.DataAnnotations;

namespace InvestigacionApp.Server.Models
{
    public class Pieza
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;

        public string Cantidad { get; set; } = string.Empty;

        public string Ubicacion { get; set; } = string.Empty;

        public string? PosiblesUsos { get; set; }
    }
}