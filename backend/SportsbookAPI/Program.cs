using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
if (File.Exists(".env.local"))
{
    Env.Load(".env.local");
    Console.WriteLine("Loaded .env.local");
}
//Env.Load(".env.local");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD") 
                 ?? throw new Exception("DB_PASSWORD is not set");
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") 
             ?? throw new Exception("JWT_KEY is not set");

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!
    .Replace("PLACEHOLDER", dbPassword);

builder.Services.AddDbContext<SportsbookContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
// Console.WriteLine($"Issuer: {jwtSettings["Issuer"]}");
// Console.WriteLine($"Audience: {jwtSettings["Audience"]}");
// Console.WriteLine($"Key: {jwtKey}");
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

// CORS za frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3001")
              .WithHeaders("Content-type")
              .AllowAnyMethod()
              .AllowCredentials(); 
    });
});

var app = builder.Build();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

//app.MapControllers();
static IResult? ValidateStringLength(string value, int minLength, string errorMessage)
{
    if (string.IsNullOrWhiteSpace(value) || value.Length < minLength)
        return Results.BadRequest(errorMessage);
    return null;
}
app.MapGet("/api/teams",[Authorize]  async (SportsbookContext db) =>
{
    return await db.Teams.ToListAsync();
});

app.MapPost("/api/teams", [Authorize] async (Team team, SportsbookContext db) =>
{
    var validation = ValidateStringLength(team.Name, 3, "Prekratko ime");
    if (validation != null) return validation;
    db.Teams.Add(team);
    await db.SaveChangesAsync();
    return Results.Ok(team);
    
});

app.MapPut("/api/teams/{id}", [Authorize] async (int id, Team team, SportsbookContext db) =>
{
    var existing = await db.Teams.FindAsync(id);
    if (existing == null) return Results.NotFound();
    var validation = ValidateStringLength(team.Name, 3, "Prekratko ime tima.");
    if (validation != null) return validation;

    existing.Name = team.Name;
    await db.SaveChangesAsync();
    return Results.Ok(existing);
});

app.MapDelete("/api/teams/{id}", [Authorize] async (int id, SportsbookContext db) =>

{
    var team = await db.Teams.FindAsync(id);
    if (team == null) return Results.NotFound();
    db.Teams.Remove(team);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapGet("/api/competitions", [Authorize] async (SportsbookContext db) =>
{
    var competitions = await db.Competitions
        .Include(c => c.Matches)
            .ThenInclude(m => m.HomeTeam)
        .Include(c => c.Matches)
            .ThenInclude(m => m.AwayTeam)
        .ToListAsync();
    return Results.Ok(competitions);
});

app.MapGet("/api/competitions/{id}", [Authorize] async (int id, SportsbookContext db) =>
{
    var competition = await db.Competitions
        .Include(c => c.Matches)
            .ThenInclude(m => m.HomeTeam)
        .Include(c => c.Matches)
            .ThenInclude(m => m.AwayTeam)
        .FirstOrDefaultAsync(c => c.ID == id);

    if (competition == null) return Results.NotFound();
    return Results.Ok(competition);
});

app.MapPost("/api/competitions", [Authorize] async (Competition competition, SportsbookContext db) =>
{
    var validation = ValidateStringLength(competition.Name, 3, "Prekratko ime natjecanja.");
    if (validation != null) return validation;
    db.Competitions.Add(competition);
    await db.SaveChangesAsync();
    return Results.Ok(competition);
});

app.MapPut("/api/competitions/{id}", [Authorize] async (int id, Competition competition, SportsbookContext db) =>
{
    var existing = await db.Competitions.FindAsync(id);
    if (existing == null) return Results.NotFound();

    var validation = ValidateStringLength(competition.Name, 3, "Prekratko ime natjecanja.");
    if (validation != null) return validation;
    existing.Name = competition.Name;
    await db.SaveChangesAsync();
    return Results.Ok(existing);
});

app.MapDelete("/api/competitions/{id}", [Authorize] async (int id, SportsbookContext db) =>
{
    var competition = await db.Competitions.FindAsync(id);
    if (competition == null) return Results.NotFound();

    db.Competitions.Remove(competition);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapGet("/api/matches", [Authorize] async (SportsbookContext db) =>
{
    var matches = await db.Matches
        .Include(m => m.HomeTeam)
        .Include(m => m.AwayTeam)
        .Include(m => m.Competition)
        .Select(m => new
        {
            MatchId = m.Id,
            HomeTeam = m.HomeTeam.Name,
            AwayTeam = m.AwayTeam.Name,
            Competition = m.Competition.Name,
            Date = m.Date
        })
        .ToListAsync();

    return Results.Ok(matches);
});

app.MapPost("/api/matches", [Authorize] async (Match match, SportsbookContext db) =>
{
    if (match == null)
        return Results.BadRequest(new { message = "Match data is required." });

    var homeExists = await db.Teams.AnyAsync(t => t.Id == match.HomeTeamId);
    var awayExists = await db.Teams.AnyAsync(t => t.Id == match.AwayTeamId);
    var compExists = await db.Competitions.AnyAsync(c => c.ID == match.CompetitionId);

    if (!homeExists || !awayExists || !compExists)
        return Results.BadRequest(new { message = "Invalid team or competition ID." });

    match.Date = DateTime.SpecifyKind(match.Date, DateTimeKind.Utc);

    db.Matches.Add(match);
    await db.SaveChangesAsync();

    var insertedMatch = await db.Matches
        .Include(m => m.HomeTeam)
        .Include(m => m.AwayTeam)
        .Include(m => m.Competition)
        .FirstOrDefaultAsync(m => m.Id == match.Id);

    return Results.Ok(new
    {
        matchId = insertedMatch?.Id,
        homeTeam = insertedMatch?.HomeTeam?.Name,
        awayTeam = insertedMatch?.AwayTeam?.Name,
        competition = insertedMatch?.Competition?.Name,
        date = insertedMatch?.Date
    });
});

app.MapDelete("/api/matches/{id}", [Authorize] async (int id, SportsbookContext db) =>
{
    var match = await db.Matches.FindAsync(id);
    if (match == null) return Results.NotFound();

    db.Matches.Remove(match);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapGet("/api/igrac", [Authorize] async (SportsbookContext db) =>
{
    var igraci = await db.Igrac
        .Include(i => i.Team)
        .ToListAsync();
    return Results.Ok(igraci);
});

app.MapGet("/api/igrac/{id}", [Authorize] async (int id, SportsbookContext db) =>
{
    var igrac = await db.Igrac.FindAsync(id);
    if (igrac == null) return Results.BadRequest(new { message = "Greska: ne postoji taj igrac" });
    return Results.Ok(igrac);
});

app.MapPost("/api/igrac", [Authorize] async (Igrac igrac, SportsbookContext db) =>
{
    if (igrac == null) return Results.BadRequest();
    if (string.IsNullOrWhiteSpace(igrac.Ime) || igrac.Age < 1 || string.IsNullOrWhiteSpace(igrac.Position))
    {
        return Results.BadRequest(new { message = "Neispravno unesen igrac." });
    }
    var teamExists = await db.Teams.AnyAsync(t => t.Id == igrac.TeamId);
    if (!teamExists)
        return Results.BadRequest(new { message = "Ne postoji tim s tim ID-em." });
    db.Igrac.Add(igrac);
    await db.SaveChangesAsync();
    return Results.Ok(igrac);
});

app.MapPut("/api/igrac/{id}", [Authorize] async (int id, Igrac igrac, SportsbookContext db) =>
{
    if (igrac == null || igrac.Id != id) return Results.BadRequest(new { message = "Greska" });
    if (string.IsNullOrWhiteSpace(igrac.Ime) || igrac.Age < 1 || string.IsNullOrWhiteSpace(igrac.Position))
    {
        return Results.BadRequest(new { message = "Neispravno unesen igrac." });
    }
    var teamExists = await db.Teams.AnyAsync(t => t.Id == igrac.TeamId);
    if (!teamExists)
        return Results.BadRequest(new { message = "Ne postoji tim s tim ID-em." });
    var existing = await db.Igrac.FindAsync(id);
    if (existing == null) return Results.BadRequest(new { message = "Ne postoji taj igrac" });

    existing.Ime = igrac.Ime;
    existing.Age = igrac.Age;
    existing.Position = igrac.Position;
    existing.TeamId = igrac.TeamId;

    await db.SaveChangesAsync();
    return Results.Ok(existing);
});

app.MapDelete("/api/igrac/{id}", [Authorize] async (int id, SportsbookContext db) =>
{
    var igrac = await db.Igrac.FindAsync(id);
    if (igrac == null) return Results.BadRequest(new { message = "Ne postoji igrac" });

    db.Igrac.Remove(igrac);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapGet("/api/auth/all", [Authorize] async (SportsbookContext db) =>
{
    var users = await db.Users
        .Select(u => new { u.Id, u.Name, u.Email })
        .ToListAsync();
    return Results.Ok(users);
});

app.MapPost("/api/auth/register", async (RegisterDto dto, SportsbookContext db) =>
{
    
    if (string.IsNullOrWhiteSpace(dto.Email) ||
        string.IsNullOrWhiteSpace(dto.Password) ||
        string.IsNullOrWhiteSpace(dto.Name))
    {
        return Results.BadRequest(new { message = "All fields are required." });
    }
    if (await db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
    {
        return Results.BadRequest(new { message = "Email already exists." });
    }

    if (dto.Password.Length < 8)
    {
        return Results.BadRequest(new { message = "Password must be at least 8 characters long." });
    }

    if (!dto.Password.Any(char.IsUpper) || 
        !dto.Password.Any(char.IsLower) || 
        !dto.Password.Any(char.IsDigit))
    {
        return Results.BadRequest(new { message = "Password must contain uppercase, lowercase letters and a number" });
    }
    var user = new User
    {
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Name = dto.Name
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "User registered successfully" });
});

app.MapPost("/api/auth/login", async (LoginDto dto, HttpResponse response, SportsbookContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        return Results.Unauthorized();

    

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim("name", user.Name ?? "")
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(12),
        signingCredentials: creds
    );

    var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

    response.Cookies.Append("jwtToken", jwtToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = false,
        Expires = DateTime.UtcNow.AddHours(12),
        SameSite = SameSiteMode.Strict,
        Path = "/"
    });

    return Results.Ok(new
    {
        userId = user.Id,
        name = user.Name,
        email = user.Email
    });
});

app.MapPost("/api/auth/logout", (HttpResponse response) =>
{
    response.Cookies.Delete("jwtToken", new CookieOptions { Path = "/" });
    return Results.Ok();
});

app.MapGet("/api/auth/me", [Authorize] async (HttpRequest request, SportsbookContext db) =>
{
    var token = request.Cookies["jwtToken"];
    if (string.IsNullOrEmpty(token)) return Results.Unauthorized();

    try
    {
        var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY") 
                        ?? throw new Exception("JWT_KEY is not set"));
        var tokenHandler = new JwtSecurityTokenHandler();

        tokenHandler.ValidateToken(token, new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        }, out var validatedToken);

        var jwtToken = (JwtSecurityToken)validatedToken;
        var userId = int.Parse(jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Sub).Value);

        var user = await db.Users.FindAsync(userId);
        if (user == null) return Results.Unauthorized();

        return Results.Ok(new
        {
            userId = user.Id,
            name = user.Name,
            email = user.Email
        });
    }
    catch
    {
        return Results.Json(new { message = "Not authenticated" }, statusCode: 401);
    }
});

app.Run();
