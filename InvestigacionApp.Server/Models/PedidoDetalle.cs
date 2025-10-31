using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InvestigacionApp.Server.Models
{
    public class PedidoDetalle
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PedidoId { get; set; }

        [Required]
        public int PiezaId { get; set; }

        [Required]
        public int Cantidad { get; set; }

        [ForeignKey("PedidoId")]
        [JsonIgnore] // Evita ciclos al serializar Pedido -> Detalles -> Pedido ...
        public Pedido? Pedido { get; set; }
    }
}