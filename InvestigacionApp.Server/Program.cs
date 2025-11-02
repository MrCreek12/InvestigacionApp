using InvestigacionApp.Models;
using InvestigacionApp.Server.Services;
using InvestigacionApp.Server;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text.Json.Serialization;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

// Track server start time to allow invalidation of tokens issued before restart
builder.Services.AddSingleton(new ServerState { StartedAt = DateTime.UtcNow });

// Configure logging to console and set debug level to capture EF SQL and detailed errors
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

// Configuración de DbContext
builder.Services.AddDbContext<DbContextPiezas>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Cloud"))
           .EnableSensitiveDataLogging()
           .EnableDetailedErrors()
);

// Configuración de JWT Service
builder.Services.AddScoped<JwtService>();

// Configuración de JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey no configurada");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };

    // Invalidate tokens issued before server start (forces logout on restart)
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            try
            {
                var serverState = context.HttpContext.RequestServices.GetRequiredService<ServerState>();
                var iatClaim = context.Principal?.FindFirst(JwtRegisteredClaimNames.Iat)?.Value;
                if (!string.IsNullOrEmpty(iatClaim) && long.TryParse(iatClaim, out var iatSeconds))
                {
                    var issuedAt = DateTimeOffset.FromUnixTimeSeconds(iatSeconds).UtcDateTime;
                    if (issuedAt < serverState.StartedAt)
                    {
                        context.Fail("Token issued before server restart");
                    }
                }
            }
            catch
            {
                // swallow and allow normal validation to handle failures
            }

            return Task.CompletedTask;
        }
    };
});

// Configuración de servicios
builder.Services.AddControllers().AddJsonOptions(opts =>
{
    // Evita ciclos de referencias y usa JsonIgnoreAttribute/ReferenceHandler si es necesario
    opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://localhost:56122")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Configuración de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingrese 'Bearer' [espacio] y luego su token JWT"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware para registrar el body de POST a /api/pedidos para depuración
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api/pedidos") && context.Request.Method == "POST")
    {
        context.Request.EnableBuffering();
        using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, detectEncodingFromByteOrderMarks: false, leaveOpen: true);
        var body = await reader.ReadToEndAsync();
        context.Request.Body.Position = 0;
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogDebug("Incoming POST /api/pedidos body: {Body}", body);
    }

    await next();
});

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();