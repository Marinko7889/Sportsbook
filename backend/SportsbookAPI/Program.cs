using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
using SportsbookAPI.Endpoints;


Env.Load(".env.local");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!
    .Replace("PLACEHOLDER", dbPassword);
    
builder.Services.AddDbContext<SportsbookContext>(options =>
{
    options.UseNpgsql(connectionString);      
           //.EnableSensitiveDataLogging()    
           //.EnableDetailedErrors()          
});

//builder.Services.AddControllers();
// JWT Authentication
//var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience =false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("jwtToken"))
            {
                context.Token = context.Request.Cookies["jwtToken"];
            }
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization();

// CORS za frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddMemoryCache();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.MaxDepth = 64;
});
var app = builder.Build();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();


app.RegisterTeamsEndpoints();
app.RegisterCompetitionsEndpoints();
app.RegisterMatchesEndpoint();
app.RegisterPlayerEndpoints();
app.RegisterAuthEndpoint();



app.Run();
