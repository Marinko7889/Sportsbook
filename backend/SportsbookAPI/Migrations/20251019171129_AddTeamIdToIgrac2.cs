using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportsbookAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamIdToIgrac2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Igrac_Teams_TeamId",
                table: "Igrac");

            migrationBuilder.AlterColumn<int>(
                name: "TeamId",
                table: "Igrac",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Igrac_Teams_TeamId",
                table: "Igrac",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Igrac_Teams_TeamId",
                table: "Igrac");

            migrationBuilder.AlterColumn<int>(
                name: "TeamId",
                table: "Igrac",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Igrac_Teams_TeamId",
                table: "Igrac",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
