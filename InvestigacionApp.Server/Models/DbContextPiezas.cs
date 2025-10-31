using InvestigacionApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace InvestigacionApp.Models
{
    public class DbContextPiezas : DbContext
    {
        public DbContextPiezas(DbContextOptions<DbContextPiezas> options) : base(options)
        {
        }

        public DbSet<Pieza> Piezas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<PedidoDetalle> PedidoDetalles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Pedido>()
                .HasMany(p => p.Detalles)
                .WithOne(d => d.Pedido)
                .HasForeignKey(d => d.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
