using InvestigacionApp.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------------
// 1?? Configuración del servicio de DbContext (conexión SQL)
// --------------------------------------------------------
builder.Services.AddDbContext<DbContextPiezas>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("StringLocal")));

// --------------------------------------------------------
// 2?? Agregar servicios del controlador y CORS
// --------------------------------------------------------
builder.Services.AddControllers();

// ?? Configurar CORS para permitir el frontend (React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            // Cambia el puerto si tu frontend usa otro
            policy.WithOrigins("https://localhost:56122")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// --------------------------------------------------------
// 3?? Swagger
// --------------------------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --------------------------------------------------------
// 4?? Archivos estáticos y default (para SPA React)
// --------------------------------------------------------
app.UseDefaultFiles();
app.UseStaticFiles();

// --------------------------------------------------------
// 5?? Configurar pipeline HTTP
// --------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ?? Activar CORS ANTES de los controladores
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// ?? Permitir SPA fallback (React Router)
app.MapFallbackToFile("/index.html");

app.Run();