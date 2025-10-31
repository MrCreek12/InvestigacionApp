using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvestigacionApp.Server.Models
{
    public class Pedido
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; } // Cambiado a int para coincidir con la base de datos

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        [InverseProperty("Pedido")]
        public List<PedidoDetalle> Detalles { get; set; } = new List<PedidoDetalle>();
    }
}