using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

namespace MRInteractiveMural.Server.Controllers {
    [Route("api")]
    [ApiController]
    public class AdminController : ControllerBase {
        [HttpPost("admin/login")]
        public async Task<ActionResult> Login([FromBody] AdminLoginRequest request) {
            try {
                // Validate the GitHub API key
                bool isValidApiKey = await ValidateGitHubApiKey(request.GitHubApiKey);
                if (isValidApiKey) {
                    // Authentication successful
                    return Ok(new { message = "Authentication successful" });
                }
                else {
                    // Authentication failed
                    return Unauthorized(new { message = "Authentication failed" });
                }
            }
            catch (Exception ex) {
                // Handle any errors that occur during the authentication process
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        private async Task<bool> ValidateGitHubApiKey(string apiKey) {
            using (var httpClient = new HttpClient()) {
                // Set the GitHub API key in the request headers
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                // Make a request to the GitHub API to verify the API key
                var response = await httpClient.GetAsync("https://api.github.com/user");
                if (response.IsSuccessStatusCode) {
                    // API key is valid
                    return true;
                }
                else {
                    // API key is invalid
                    return false;
                }
            }
        }
    }

    public class AdminLoginRequest {
        public string GitHubApiKey { get; set; }
    }
}