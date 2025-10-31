using InvestigacionApp.Models;
using InvestigacionApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Linq;

namespace InvestigacionApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PedidosController : ControllerBase
    {
        private readonly DbContextPiezas _context;
        private readonly ILogger<PedidosController> _logger;

        public PedidosController(DbContextPiezas context, ILogger<PedidosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos()
        {
            return await _context.Pedidos
                .Include(p => p.Detalles)
                .ToListAsync();
        }

       

      

        

        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido([FromBody] Pedido pedido)
        {
            if (pedido == null || pedido.Detalles == null || !pedido.Detalles.Any())
            {
                return BadRequest(new { message = "El pedido debe contener detalles." });
            }

            // Simple server-side validation of detalles
            foreach (var d in pedido.Detalles)
            {
                if (d.PiezaId <= 0 || d.Cantidad <= 0)
                {
                    return BadRequest(new { message = "Cada detalle debe contener un PiezaId y una Cantidad válida (>0)." });
                }
            }

            // Verify usuario exists
            var usuarioExists = await _context.Usuarios.AnyAsync(u => u.Id == pedido.UsuarioId);
            if (!usuarioExists)
            {
                return BadRequest(new { message = $"Usuario con Id {pedido.UsuarioId} no existe." });
            }

            // Verify each pieza exists
            var piezaIds = pedido.Detalles.Select(d => d.PiezaId).Distinct().ToList();
            var existentes = await _context.Piezas.Where(p => piezaIds.Contains(p.Id)).Select(p => p.Id).ToListAsync();
            var faltantes = piezaIds.Except(existentes).ToList();
            if (faltantes.Any())
            {
                return BadRequest(new { message = "Algunas piezas no existen: " + string.Join(',', faltantes) });
            }

            _logger.LogInformation("Recibido pedido de usuario {UsuarioId} con {Count} detalles", pedido.UsuarioId, pedido.Detalles.Count);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Create the Pedido without attaching child entities to avoid EF tracking problems
                var nuevoPedido = new Pedido
                {
                    UsuarioId = pedido.UsuarioId,
                    Fecha = DateTime.Now, // usar hora local para mostrar en UI como hora local
                    Detalles = new List<PedidoDetalle>()
                };

                _context.Pedidos.Add(nuevoPedido);
                await _context.SaveChangesAsync();

                // Insert each detalle referencing the created pedido Id
                foreach (var detalle in pedido.Detalles)
                {
                    var nuevoDetalle = new PedidoDetalle
                    {
                        PedidoId = nuevoPedido.Id,
                        PiezaId = detalle.PiezaId,
                        Cantidad = detalle.Cantidad
                    };

                    _context.PedidoDetalles.Add(nuevoDetalle);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Load detalles to return full object
                await _context.Entry(nuevoPedido).Collection(p => p.Detalles).LoadAsync();

                return CreatedAtAction(nameof(GetPedidos), new { id = nuevoPedido.Id }, nuevoPedido);
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();

                // Log EF mapping info and entry details
                var pedidoEntity = _context.Model.FindEntityType(typeof(Pedido));
                var detalleEntity = _context.Model.FindEntityType(typeof(PedidoDetalle));
                var pedidoTable = pedidoEntity?.GetTableName();
                var detalleTable = detalleEntity?.GetTableName();

                var entriesInfo = new List<object>();
                foreach (var entry in dbEx.Entries)
                {
                    try
                    {
                        var currentValues = entry.CurrentValues;
                        var dict = new Dictionary<string, object?>();
                        foreach (var prop in currentValues.Properties)
                        {
                            dict[prop.Name] = currentValues[prop]?.ToString();
                        }

                        entriesInfo.Add(new
                        {
                            EntityType = entry.Entity?.GetType().FullName,
                            State = entry.State.ToString(),
                            Values = dict
                        });
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e, "Error reading entry values for logging");
                    }
                }

                _logger.LogError(dbEx, "DbUpdateException al guardar pedido. Mapped Pedido table: {PedidoTable}, Detalle table: {DetalleTable}. Entries: {@Entries}", pedidoTable, detalleTable, entriesInfo);

                var inner = dbEx.InnerException?.Message ?? string.Empty;
                var inner2 = dbEx.InnerException?.InnerException?.Message ?? string.Empty;
                return StatusCode(500, new
                {
                    message = "DbUpdateException al guardar el pedido.",
                    error = dbEx.Message,
                    inner,
                    inner2,
                    mapped = new { PedidoTable = pedidoTable, DetalleTable = detalleTable },
                    entries = entriesInfo
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error al guardar pedido para usuario {UsuarioId}. Exception: {Ex}", pedido.UsuarioId, ex.ToString());

                // Include inner exception details to help debugging during development
                var inner = ex.InnerException?.Message ?? string.Empty;
                var inner2 = ex.InnerException?.InnerException?.Message ?? string.Empty;
                return StatusCode(500, new { message = "Error al guardar el pedido.", error = ex.Message, inner, inner2 });
            }
        }
    }
}