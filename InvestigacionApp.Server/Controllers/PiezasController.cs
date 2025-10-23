// InvestigacionApp.Server/Controllers/PiezasController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvestigacionApp.Models;
using InvestigacionApp.Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace InvestigacionApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PiezasController : ControllerBase
    {
        private readonly DbContextPiezas _context;

        public PiezasController(DbContextPiezas context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pieza>>> GetPiezas()
        {
            return await _context.Piezas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pieza>> GetPieza(int id)
        {
            var pieza = await _context.Piezas.FindAsync(id);

            if (pieza == null)
            {
                return NotFound(new { message = $"No se encontró la pieza con ID {id}" });
            }

            return pieza;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Pieza>> PostPieza(Pieza pieza)
        {
            _context.Piezas.Add(pieza);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPieza), new { id = pieza.Id }, pieza);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutPieza(int id, Pieza pieza)
        {
            if (id != pieza.Id)
            {
                return BadRequest(new { message = "El ID de la URL no coincide con el ID de la pieza" });
            }

            _context.Entry(pieza).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await PiezaExists(id))
                {
                    return NotFound(new { message = $"No se encontró la pieza con ID {id}" });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePieza(int id)
        {
            var pieza = await _context.Piezas.FindAsync(id);
            if (pieza == null)
            {
                return NotFound(new { message = $"No se encontró la pieza con ID {id}" });
            }

            _context.Piezas.Remove(pieza);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<bool> PiezaExists(int id)
        {
            return await _context.Piezas.AnyAsync(e => e.Id == id);
        }
    }
}