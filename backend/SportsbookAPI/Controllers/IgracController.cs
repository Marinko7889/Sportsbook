
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]

public class IgracController : ControllerBase
{
    private readonly SportsbookContext _context;
    public IgracController(SportsbookContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IEnumerable<Igrac>> GetIgraci()
    {
        //return await _context.Igrac.ToListAsync();
         return await _context.Igrac
            .Include(i => i.Team) 
            .ToListAsync();
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetIgrac(int id)
    {
        var igrac = await _context.Igrac.FindAsync(id);
        if (igrac == null) return BadRequest("Greska nepostoji taj igrac");
        return Ok(igrac);
    }
    
    [HttpPost]
    public async Task<IActionResult> AddIgrac([FromBody] Igrac igrac)
    {
        if (igrac == null) return BadRequest();

        _context.Igrac.Add(igrac);
        await _context.SaveChangesAsync();
        return Ok(igrac);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateIgrac(int id, [FromBody] Igrac igrac)
    {
        if (igrac == null || igrac.Id != id) return BadRequest("Greska");
        var existing = await _context.Igrac.FindAsync(id);
        if (existing == null) return BadRequest("Ne postoji taj igrac");

        existing.Ime = igrac.Ime;
        existing.Age = igrac.Age;
        existing.Position = igrac.Position;
        existing.TeamId = igrac.TeamId; 

        await _context.SaveChangesAsync();

        return Ok(existing);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult>DeleteIgrac(int id)
    {
        var igrac = await _context.Igrac.FindAsync(id);
        if (igrac == null) return BadRequest("Ne posotji igrac");
        _context.Igrac.Remove(igrac);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
