using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportsbookAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToCompetition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Competitions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Competitions");
        }
    }
}
