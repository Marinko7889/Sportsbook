using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;

namespace SportsbookAPI.Endpoints
{
    public static class TeamsEndpoints
    {
        public static void RegisterTeamsEndpoints(this WebApplication app)
        {
            var teamsGroup = app.MapGroup("/api/teams").RequireAuthorization();

            teamsGroup.MapGet("/", GetAllTeams);
            teamsGroup.MapGet("/{id}", GetTeamById);
            teamsGroup.MapPost("/", CreateTeam);
            teamsGroup.MapPut("/{id}", UpdateTeam);
            teamsGroup.MapDelete("/{id}", DeleteTeam);
        }

        private static async Task<IResult> GetAllTeams(SportsbookContext db, ILogger<Program> logger)
        {
            var allTeams = await db.Teams.ToListAsync();
            logger.LogInformation("Returned {Count} teams", allTeams.Count);
            return Results.Ok(allTeams);
        }

        private static async Task<IResult> GetTeamById(int id, SportsbookContext db, ILogger<Program> logger)
        {
            var team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                logger.LogWarning("Team with ID {TeamId} not found", id);
                return Results.NotFound();
            }

            logger.LogInformation("Returned team {TeamName}", team.Name);
            return Results.Ok(team);
        }

        private static async Task<IResult> CreateTeam(Team team, SportsbookContext db, ILogger<Program> logger)
        {
            if (string.IsNullOrWhiteSpace(team.Name) || team.Name.Length < 3)
            {
                logger.LogWarning("Failed to create team. Name too short");
                return Results.BadRequest("Name too short");
            }

            db.Teams.Add(team);
            await db.SaveChangesAsync();

            logger.LogInformation("Created new team {TeamName}", team.Name);
            return Results.Ok(team);
        }

        private static async Task<IResult> UpdateTeam(int id, Team team, SportsbookContext db, ILogger<Program> logger)
        {
            var existing = await db.Teams.FindAsync(id);
            if (existing == null)
            {
                logger.LogWarning("Failed to update. Team with ID {TeamId} not found", id);
                return Results.NotFound();
            }

            if (string.IsNullOrWhiteSpace(team.Name) || team.Name.Length < 3)
            {
                logger.LogWarning("Failed to update team {TeamId}. Name too short", id);
                return Results.BadRequest("Name too short");
            }

            existing.Name = team.Name;
            await db.SaveChangesAsync();

            logger.LogInformation("Updated team {TeamName}", existing.Name);
            return Results.Ok(existing);
        }

        private static async Task<IResult> DeleteTeam(int id, SportsbookContext db, ILogger<Program> logger)
        {
            var existing = await db.Teams.FindAsync(id);
            if (existing == null)
            {
                logger.LogWarning("Failed to delete. Team with ID {TeamId} not found", id);
                return Results.NotFound();
            }

            db.Teams.Remove(existing);
            await db.SaveChangesAsync();

            logger.LogInformation("Deleted team {TeamName}", existing.Name);
            return Results.Ok();
        }
    }
}
