using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly SportsbookContext _context;

    public TeamsController(SportsbookContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<Team>> GetTeams()
    {
        return await _context.Teams.ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> AddTeam(Team team)
    {
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();
        return Ok(team);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(int id, Team team)
    {
        var existing = await _context.Teams.FindAsync(id);
        if (existing == null) return NotFound();
        existing.Name = team.Name;
        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(int id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return NotFound();
        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
