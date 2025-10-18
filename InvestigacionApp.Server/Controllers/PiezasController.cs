// InvestigacionApp.Server/Controllers/PiezasController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvestigacionApp.Models;
using InvestigacionApp.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class PiezasController : ControllerBase
{
    private readonly DbContextPiezas _context;

    public PiezasController(DbContextPiezas context)
    {
        _context = context;
    }

    // GET: api/piezas  (Leer todas las piezas)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pieza>>> GetPiezas()
    {
        return await _context.Piezas.ToListAsync();
    }

    // POST: api/piezas (Crear una pieza)
    [HttpPost]
    public async Task<ActionResult<Pieza>> PostPieza(Pieza pieza)
    {
        _context.Piezas.Add(pieza);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPiezas), new { id = pieza.Id }, pieza);
    }

    // PUT: api/piezas/5 (Actualizar una pieza)
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPieza(int id, Pieza pieza)
    {
        if (id != pieza.Id)
        {
            return BadRequest();
        }
        _context.Entry(pieza).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/piezas/5 (Borrar una pieza)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePieza(int id)
    {
        var pieza = await _context.Piezas.FindAsync(id);
        if (pieza == null)
        {
            return NotFound();
        }
        _context.Piezas.Remove(pieza);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}