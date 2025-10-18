//Libreria para el orm 
using InvestigacionApp.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace InvestigacionApp.Models
{
    //Esta clase hereda del obejto dbcontext
    public class DbContextPiezas : DbContext
    {
        /// <summary>
        /// Constructor com parametros para nuestro dbcontext 
        /// </summary>
        public DbContextPiezas(DbContextOptions<DbContextPiezas> options) : base(options)
        {

        }



        //Propiedad utilizada para dar mantenimiento a nuestra tabla libros en la db
        public DbSet<Pieza> Piezas { get; set; }
    }//cierre class

}//Cierre namespaces
