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
    }
}
