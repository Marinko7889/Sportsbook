using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly SportsbookContext _context;

    public MatchesController(SportsbookContext context)
    {
        _context = context;
    }

    // GET: api/matches
    // [HttpGet]
    // public async Task<IEnumerable<Match>> GetMatches()
    // {
    //     return await _context.Matches.ToListAsync();
    // }
[HttpGet]
public async Task<IActionResult> GetMatchesWithNames()
{
    var matches = await _context.Matches
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

    return Ok(matches);
}


    // POST: api/matches
[HttpPost]
public async Task<IActionResult> AddMatch([FromBody] Match match)
{
    if (match == null)
        return BadRequest("Match data is required.");

    // Provjeri da ID-jevi postoje
    var homeExists = await _context.Teams.AnyAsync(t => t.Id == match.HomeTeamId);
    var awayExists = await _context.Teams.AnyAsync(t => t.Id == match.AwayTeamId);
    var compExists = await _context.Competitions.AnyAsync(c => c.ID == match.CompetitionId);

    if (!homeExists || !awayExists || !compExists)
        return BadRequest("Invalid team or competition ID.");

    // Postavi datum u UTC
    match.Date = DateTime.SpecifyKind(match.Date, DateTimeKind.Utc);

    // Dodaj u bazu
    _context.Matches.Add(match);
    await _context.SaveChangesAsync();

        // Vrati kompletan match s navigacijama
        var insertedMatch = await _context.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Competition)
            .FirstOrDefaultAsync(m => m.Id == match.Id);

    // return Ok(insertedMatch);
    return Ok(new {
    matchId = insertedMatch?.Id,
    homeTeam = insertedMatch?.HomeTeam?.Name,
    awayTeam = insertedMatch?.AwayTeam?.Name,
    competition = insertedMatch?.Competition?.Name,
    date = insertedMatch?.Date
});
}

    // DELETE: api/matches/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMatch(int id)
    {
        var match = await _context.Matches.FindAsync(id);
        if (match == null) return NotFound();

        _context.Matches.Remove(match);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
