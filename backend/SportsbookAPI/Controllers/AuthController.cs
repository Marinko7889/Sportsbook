// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using BCrypt.Net;

// [ApiController]
// [Route("api/[controller]")]
// public class AuthController : ControllerBase
// {
//     private readonly SportsbookContext _context;
//     private readonly IConfiguration _config;

//     public AuthController(SportsbookContext context, IConfiguration config)
//     {
//         _context = context;
//         _config = config;
//     }
//     [HttpGet("all")]
//     public async Task<IActionResult> GetAllUsers()
//     {
//         var users = await _context.Users
//             .Select(u => new { u.Id, u.Name, u.Email }) 
//             .ToListAsync();
//         return Ok(users);
//     }
//     [HttpPost("register")]
//     public async Task<IActionResult> Register([FromBody] RegisterDto dto)
//     {
//         if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
//             return BadRequest("Email already exists.");

//         var user = new User
//         {
//             Email = dto.Email,
//             PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
//             Name = dto.Name
//         };

//         _context.Users.Add(user);
//         await _context.SaveChangesAsync();
//         return Ok(new { message = "User registered successfully" });
//     }

   
//     [HttpPost("login")]
//     public async Task<IActionResult> Login([FromBody] LoginDto dto)
//     {
//         var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
//         if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
//             return Unauthorized("Invalid email or password.");

//         var token = GenerateJwtToken(user);

//         // Postavi token u HttpOnly cookie
//         Response.Cookies.Append("jwtToken", token, new CookieOptions
//         {
//             HttpOnly = true,
//             Secure = false,
//             Expires = DateTime.UtcNow.AddHours(12),
//             SameSite = SameSiteMode.Strict,
//             Path = "/",
//         });

//         return Ok(new 
//         { 
//             userId = user.Id, 
//             name = user.Name, 
//             email = user.Email 
//         });
//     }

//     private string GenerateJwtToken(User user)
//     {
//         var claims = new[]
//         {
//         new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
//         new Claim(JwtRegisteredClaimNames.Email, user.Email),
//         new Claim("name", user.Name ?? "")
//         };

//         var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
//                      ?? throw new Exception("JWT_KEY is not set");

//         var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
//         var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//         var token = new JwtSecurityToken(
//             claims: claims,
//             expires: DateTime.UtcNow.AddHours(12),
//             signingCredentials: creds
//         );

//         return new JwtSecurityTokenHandler().WriteToken(token);
//     }
//     [HttpPost("logout")]
//     public IActionResult Logout()
//     {
//         Response.Cookies.Delete("jwtToken", new CookieOptions
//         {
//             Path = "/"
//         });
//         return Ok();
//     }
//     [HttpGet("me")]
//     public async Task<IActionResult> Me()
//     {
//         // Dohvati token iz HttpOnly cookie
//         var token = Request.Cookies["jwtToken"];

//         if (string.IsNullOrEmpty(token))
//         {
//             return Unauthorized(new { message = "Not authenticated" });
//         }

//         try
//         {
//             var tokenHandler = new JwtSecurityTokenHandler();
//             var key = Encoding.UTF8.GetBytes(
//                 Environment.GetEnvironmentVariable("JWT_KEY") ?? throw new Exception("JWT_KEY not set")
//             );

//             tokenHandler.ValidateToken(token, new Microsoft.IdentityModel.Tokens.TokenValidationParameters
//             {
//                 ValidateIssuer = false,
//                 ValidateAudience = false,
//                 ValidateLifetime = true,
//                 ValidateIssuerSigningKey = true,
//                 IssuerSigningKey = new SymmetricSecurityKey(key),
//                 ClockSkew = TimeSpan.Zero
//             }, out var validatedToken);

//             var jwtToken = (JwtSecurityToken)validatedToken;
//             var userId = int.Parse(jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Sub).Value);

//             // Dohvati usera iz baze
//             var user = await _context.Users.FindAsync(userId);
//             if (user == null) return Unauthorized();

//             return Ok(new
//             {
//                 userId = user.Id,
//                 name = user.Name,
//                 email = user.Email
//             });
//         }
//         catch
//         {
//             return Unauthorized(new { message = "Invalid token" });
//         }
//     }

// }
