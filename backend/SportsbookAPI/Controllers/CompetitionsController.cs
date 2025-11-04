// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.AspNetCore.Authorization;

// [ApiController]
// [Route("api/[controller]")]
// [Authorize]

// public class CompetitionsController : ControllerBase
// {
//     private readonly SportsbookContext _context;

//     public CompetitionsController(SportsbookContext context)
//     {
//         _context = context;
//     }

//     [HttpGet]
//     public async Task<IEnumerable<Competition>> GetCompetitions()
//     {
//         return await _context.Competitions
//             .Include(c => c.Matches)
//                 .ThenInclude(m => m.HomeTeam)
//             .Include(c => c.Matches)
//                 .ThenInclude(m => m.AwayTeam)
//             .ToListAsync();
//     }

//     [HttpGet("{id}")]
//     public async Task<IActionResult> GetCompetition(int id)
//     {
//         var competition = await _context.Competitions
//             .Include(c => c.Matches)
//                 .ThenInclude(m => m.HomeTeam)
//             .Include(c => c.Matches)
//                 .ThenInclude(m => m.AwayTeam)
//             .FirstOrDefaultAsync(c => c.ID == id);

//         if (competition == null) return NotFound();
//         return Ok(competition);
//     }

//     [HttpPost]
//     public async Task<IActionResult> AddCompetition(Competition competition)
//     {
//         _context.Competitions.Add(competition);
//         await _context.SaveChangesAsync();
//         return Ok(competition);
//     }

//     [HttpPut("{id}")]
//     public async Task<IActionResult> UpdateCompetition(int id, Competition competition)
//     {
//         var existing = await _context.Competitions.FindAsync(id);
//         if (existing == null) return NotFound();

//         existing.Name = competition.Name;
//         await _context.SaveChangesAsync();
//         return Ok(existing);
//     }

//     [HttpDelete("{id}")]
//     public async Task<IActionResult> DeleteCompetition(int id)
//     {
//         var competition = await _context.Competitions.FindAsync(id);
//         if (competition == null) return NotFound();

//         _context.Competitions.Remove(competition);
//         await _context.SaveChangesAsync();
//         return Ok();
//     }
// }
