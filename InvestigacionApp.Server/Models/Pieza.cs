// InvestigacionApp.Server/Models/Pieza.cs

using System.ComponentModel.DataAnnotations;

namespace InvestigacionApp.Server.Models
{
    

    public class Pieza
    {
        [Key] // Esto lo marca como la clave primaria
        public int Id { get; set; }

        [Required] // Campo obligatorio
        public string Nombre { get; set; }

        public string Estado { get; set; }

        public string Cantidad { get; set; } // Puede ser "10kg", "5 unidades", etc.

        public string Ubicacion { get; set; }

        public string? PosiblesUsos { get; set; } // El '?' lo hace opcional
    }
}