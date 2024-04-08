using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Threading.Tasks;
using MRInteractiveMural.Server.Models;
using System;
using BCrypt.Net;

namespace MRInteractiveMural.Server.Controllers {
    [Route("api")]
    [ApiController]
    public class AdminController : ControllerBase {
        // POST: api/admin/login
        [HttpPost("admin/login")]
        public async Task<ActionResult> Login([FromBody] AdminLoginRequest request) {
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            await connection.OpenAsync();
            string query = "SELECT id, adminUsername, adminPassword FROM admin WHERE adminUsername = @username";
            using var command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@username", request.Username);
            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync()) {
                var passwordHash = reader["adminPassword"].ToString();
                if (VerifyPasswordHash(request.Password, passwordHash)) {
                    // Authentication successful
                    return Ok(new { message = "Authentication successful" });
                }
            }

            // Authentication failed
            return Unauthorized(new { message = "Authentication failed" });
        }

        private bool VerifyPasswordHash(string password, string storedHash) {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
    }


    public class AdminLoginRequest {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
