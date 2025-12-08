using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
namespace SportsbookAPI.Endpoints
{
    public static class AuthEndpoints
    {
        static string jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");

        public static void RegisterAuthEndpoint(this WebApplication app)
        {
            var authGroup = app.MapGroup("/api/auth");
            authGroup.MapPost("/login", LoginUser);
            authGroup.MapPost("/register", RegisterUser);
            authGroup.MapPost("/logout",Logout);
            var protectedGroup = app.MapGroup("/api/auth").RequireAuthorization();
            protectedGroup.MapGet("/me", Me);
            //protectedGroup.MapPost("/logout", Logout);
            protectedGroup.MapGet("/all", GetAllUsers);
        }
        private static async Task<IResult> GetAllUsers(SportsbookContext db)
        {
            var users = await db.Users
                .Select(u => new { u.Id, u.Name, u.Email })
                .ToListAsync();
            return Results.Ok(users);
        }
        private static async Task<IResult> RegisterUser(SportsbookContext db, ILogger<Program> logger, RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.Name))
            {
                logger.LogWarning("Registration failed");
                return Results.BadRequest(new { message = "All fields are required." });
            }
            if (await db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                logger.LogWarning("Registration failed: Email {Email} already exists", dto.Email);
                return Results.BadRequest(new { message = "Email already exists." });
            }

            if (dto.Password.Length < 8)
            {
                logger.LogWarning("Registration failed: Password is too short");

                return Results.BadRequest(new { message = "Password must be at least 8 characters long." });
            }

            if (!dto.Password.Any(char.IsUpper) ||
                !dto.Password.Any(char.IsLower) ||
                !dto.Password.Any(char.IsDigit))
            {
                logger.LogWarning("Password is weak");
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
            logger.LogInformation("User registered succesfully {}", user.Name);
            return Results.Ok(new { message = "User registered successfully" });
        }
        private static async Task<IResult> LoginUser(SportsbookContext db, LoginDto dto, HttpResponse response, ILogger<Program> logger)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {

                logger.LogWarning("Failed login {Email}", dto.Email);
                return Results.Json(new { message = "Invalid email or password" }, statusCode: 401);

            }
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
                SameSite =  SameSiteMode.Lax,
                Path = "/"
            });
            logger.LogInformation("User logged in successfully: {UserId}, Email: {Email}", user.Id, user.Email);

            return Results.Ok(new
            {
                userId = user.Id,
                name = user.Name,
                email = user.Email,
                token = jwtToken
            });
        }

        private static async Task<IResult> Logout(SportsbookContext db, HttpResponse response, ILogger<Program> logger)
        {
            response.Cookies.Delete("jwtToken", new CookieOptions { Path = "/" });
            logger.LogInformation("User logged out");
            return Results.Ok();
        }
        private static async Task<IResult> Me(HttpRequest request, SportsbookContext db, ILogger<Program> logger)
        {
            var token = request.Cookies["jwtToken"];
            if (string.IsNullOrEmpty(token))
            {
                logger.LogWarning("missing JWT cookie");
                return Results.Unauthorized();
            } 

            try
            {
                var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY") 
                                ?? throw new Exception("JWT_KEY is not set"));
                var tokenHandler = new JwtSecurityTokenHandler();

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                }, out var validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Sub).Value);

                var user = await db.Users.FindAsync(userId);
                if (user == null) return Results.Unauthorized();
                logger.LogInformation("Authenticated user {Email}",user.Email);

                return Results.Ok(new
                {
                    userId = user.Id,
                    name = user.Name,
                    email = user.Email
                });
            }
            catch(Exception ex)
            {
                logger.LogError(ex, "Failed to validate JWT token.");

                return Results.Json(new { message = "Not authenticated" }, statusCode: 401);
            }
        }
    }
}