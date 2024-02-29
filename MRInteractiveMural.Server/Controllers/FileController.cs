using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System;
using System.IO;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [Route("api")]
    [ApiController]
    public class FileController : ControllerBase
    {
        [HttpPost("move")]
        public async Task<IActionResult> MoveFile()
        {
            string sourcePath = "C:\\Users\\kendr\\OneDrive\\Desktop\\Sauron.jpg";
            String destinationPath = "C:\\Users\\kendr\\OneDrive\\Desktop\\ServerFolder\\Sauron.jpg";
            using var connection = new MySqlConnection("Server=localhost:3306;User ID=root;Password=Alessandra99>;Database=mr-mural");


            try
            {

                // Check if the source file exists
                if (!System.IO.File.Exists(sourcePath))
                {
                    return NotFound("Source file not found.");
                }

                // Move the file to the destination path
                System.IO.File.Move(sourcePath, destinationPath);

                return Ok("File moved successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }

    public class MoveFileRequest
    {
        public string SourcePath { get; set; }
        public string DestinationPath { get; set; }
    }
}