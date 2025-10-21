using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportsbookAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamToIgrac : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "Igrac",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Igrac_TeamId",
                table: "Igrac",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Igrac_Teams_TeamId",
                table: "Igrac",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Igrac_Teams_TeamId",
                table: "Igrac");

            migrationBuilder.DropIndex(
                name: "IX_Igrac_TeamId",
                table: "Igrac");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Igrac");
        }
    }
}
