using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Http;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace YourNamespace.Controllers {
    [Route("api")]
    [ApiController]
    public class FileController : ControllerBase {

        [HttpPost("uploadNewMember")]
        public async Task<IActionResult> UploadNewMember(string folderName, IFormFile modelFile, IFormFile pattFile, IFormFile paramFile) {
            try {
                // Create a new folder in the GitHub repository
                await CreateGitHubFolder(folderName);

                // Upload each file to the new folder
                await UploadFileToGitHub(folderName, modelFile);
                await UploadFileToGitHub(folderName, pattFile);
                await UploadFileToGitHub(folderName, paramFile);

                return Ok("Files uploaded successfully.");
            }
            catch (Exception ex) {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        private async Task CreateGitHubFolder(string folderName) {
            var token = "";
            var repositoryOwner = "ahmedmansour3548";
            var repositoryName = "MRInteractiveWallPage";
            using (var client = new System.Net.Http.HttpClient()) {
                client.DefaultRequestHeaders.Add("Authorization", $"token {token}");
                client.DefaultRequestHeaders.Add("User-Agent", "GitHub-API-Client");

                var apiUrl = $"https://api.github.com/repos/{repositoryOwner}/{repositoryName}/contents/{folderName}";

                var requestData = new
                {
                    message = "Create new folder",
                    content = "", // Empty content for folder creation
                    path = folderName
                };

                var content = new System.Net.Http.StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(requestData));
                content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

                var response = await client.PutAsync(apiUrl, content);
                response.EnsureSuccessStatusCode();
            }
        }

        private async Task UploadFileToGitHub(string folderName, IFormFile file) {
            var token = "";
            var repositoryOwner = "ahmedmansour3548";
            var repositoryName = "MRInteractiveWallPage";
            if (file == null || file.Length == 0) {
                throw new ArgumentException("No file uploaded.");
            }

            using (var client = new System.Net.Http.HttpClient()) {
                client.DefaultRequestHeaders.Add("Authorization", $"token {token}");
                client.DefaultRequestHeaders.Add("User-Agent", "GitHub-API-Client");

                var apiUrl = $"https://api.github.com/repos/{repositoryOwner}/{repositoryName}/contents/{folderName}/{file.FileName}";

                using (var memoryStream = new MemoryStream()) {
                    await file.CopyToAsync(memoryStream);
                    var base64Content = Convert.ToBase64String(memoryStream.ToArray());

                    var requestData = new
                    {
                        message = "Upload file",
                        content = base64Content
                    };

                    var content = new System.Net.Http.StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(requestData));
                    content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

                    var response = await client.PutAsync(apiUrl, content);
                    response.EnsureSuccessStatusCode();
                }
            }
        }
        [HttpPost("uploadGitHubModel")]
        public async Task<IActionResult> UploadModel(IFormFile file, int ID) {

            var token = "";
            try {
                if (file == null || file.Length == 0) {
                    return BadRequest("No file uploaded.");
                }

                // Read file content as base64 string
                using (var memoryStream = new MemoryStream()) {
                    await file.CopyToAsync(memoryStream);
                    var base64Content = Convert.ToBase64String(memoryStream.ToArray());

                    // Construct API URL with folder name based on ID
                    var folderName = ID.ToString();
                    var apiUrl = $"https://api.github.com/repos/ahmedmansour3548/MRInteractiveWallPage/contents/{folderName}/{file.FileName}";

                    // Send PUT request to GitHub API
                    using (var client = new HttpClient()) {
                        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                        client.DefaultRequestHeaders.Add("User-Agent", "GitHub-API-Client");

                        var requestData = new
                        {
                            message = "Upload file",
                            content = base64Content
                        };

                        var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");

                        var response = await client.PutAsync(apiUrl, content);
                        response.EnsureSuccessStatusCode();

                        var responseBody = await response.Content.ReadAsStringAsync();
                        return Ok(responseBody);
                    }
                }
            }
            catch (Exception ex) {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("getFiles")]
        public async Task<IActionResult> GetFiles() {
            var token = "";
            var repositoryOwner = "ahmedmansour3548";
            var repositoryName = "MRInteractiveWallPage";
            var baseUrl = $"https://api.github.com/repos/{repositoryOwner}/{repositoryName}/contents";

            try {
                var filesLinks = new Dictionary<int, Dictionary<string, string>>();

                // Iterate through each numbered folder in the repository
                for (int folderNumber = 1; ; folderNumber++) {
                    var folderUrl = $"{baseUrl}/{folderNumber}";
                    var folderContents = await GetFolderContents(folderUrl, token);

                    // Check if the folder exists
                    if (folderContents == null) {
                        // No more numbered folders found
                        break;
                    }

                    // Find the 3D object file, .patt pattern file, and .json parameter file in the folder
                    var modelFile = FindFileWithExtensions(folderContents, new[] { ".gltf", ".glb" });
                    var patternFile = FindFileWithExtension(folderContents, ".patt");
                    var parameterFile = FindFileWithExtension(folderContents, ".json");

                    // Add links to the files to the result list
                    var folderData = new Dictionary<string, string>();
                    if (modelFile != null) {
                        folderData["model"] = modelFile.Download_Url;
                    }
                    if (patternFile != null) {
                        folderData["pattern"] = patternFile.Download_Url;
                    }
                    if (parameterFile != null) {
                        folderData["param"] = parameterFile.Download_Url;
                    }

                    // Add folder data to the dictionary
                    filesLinks[folderNumber] = folderData;
                }

                return Ok(filesLinks);
            }
            catch (Exception ex) {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        private async Task<List<FolderItem>> GetFolderContents(string folderUrl, string token) {
            try {
                using (var client = new HttpClient()) {
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                    client.DefaultRequestHeaders.Add("User-Agent", "GitHub-API-Client");

                    var response = await client.GetAsync(folderUrl);
                    response.EnsureSuccessStatusCode();

                    var responseBodyString = await response.Content.ReadAsStringAsync();
                    var responseBody = JsonConvert.DeserializeObject<List<FolderItem>>(responseBodyString);
                    return responseBody;
                }

            }
            catch {
                return null;
            }
        }


        private FolderItem FindFileWithExtensions(List<FolderItem> folderContents, string[] extensions) {
            foreach (var item in folderContents) {
                foreach (var extension in extensions) {
                    if (item.Name.EndsWith(extension, StringComparison.OrdinalIgnoreCase)) {
                        return item;
                    }
                }
            }
            return null; // File not found
        }
        private FolderItem FindFileWithExtension(List<FolderItem> folderContents, string extension) {
            foreach (var item in folderContents) {
                if (item.Type == "file" && item.Name.EndsWith(extension, StringComparison.OrdinalIgnoreCase)) {
                    return item;
                }
            }
            return null;
        }

        [HttpGet("getGitHubModel")]
        public async Task<IActionResult> GetGitHubModel(string folderName) {
            try {
                // Construct GitHub API URL to list files in the specified folder
                var apiUrl = $"https://api.github.com/repos/ahmedmansour3548/MRInteractiveWallPage/contents/{folderName}";

                // Send GET request to GitHub API
                using (var client = new HttpClient()) {
                    client.DefaultRequestHeaders.Add("User-Agent", "GitHub-API-Client");

                    var response = await client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();

                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic folderContent = Newtonsoft.Json.JsonConvert.DeserializeObject(responseBody);

                    // Initialize variables for storing file links
                    string modelFileUrl = null;
                    string jsonFileUrl = null;

                    // Search for .glb or .gltf file and .json file in the folder
                    foreach (var item in folderContent) {
                        string fileName = item.name;
                        string fileType = Path.GetExtension(fileName);

                        if (fileType == ".glb" || fileType == ".gltf") {
                            modelFileUrl = item.download_url;
                        }
                        else if (fileType == ".json") {
                            jsonFileUrl = item.download_url;
                        }
                    }

                    // Construct object with file links
                    var filesObject = new
                    {
                        modelUrl = modelFileUrl,
                        jsonUrl = jsonFileUrl
                    };

                    return Ok(filesObject);
                }
            }
            catch (Exception ex) {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("getGitHubFolders")]
        public async Task<IActionResult> GetGitHubFolders() {
            try {
                // GitHub repo details
                string repoOwner = "ahmedmansour3548";
                string repoName = "MRInteractiveWallPage";

                // Construct GitHub API URL to list contents of the repo's root directory
                string apiUrl = $"https://api.github.com/repos/{repoOwner}/{repoName}/contents";

                // Send GET request to GitHub API
                using (var client = new HttpClient()) {
                    client.DefaultRequestHeaders.Add("User-Agent", "GitHub-API-Client");

                    var response = await client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();

                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic repoContent = Newtonsoft.Json.JsonConvert.DeserializeObject(responseBody);

                    // Filter out numbered folders
                    List<object> numberedFolders = new List<object>();
                    foreach (var item in repoContent) {
                        int.TryParse((string)item.name, out int folderNumber);
                        if (folderNumber != 0) {
                            numberedFolders.Add(new
                            {
                                folderName = item.name,
                                folderUrl = item.url
                            });
                        }
                    }

                    return Ok(numberedFolders);
                }
            }
            catch (Exception ex) {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("deleteGitHubFolder/{folderNumber}")]
        public async Task<IActionResult> DeleteGitHubFolder(int folderNumber) {
            try {
                // GitHub repo details
                string repoOwner = "ahmedmansour3548";
                string repoName = "MRInteractiveWallPage";

                // Construct GitHub API URL for the folder to be deleted
                string folderUrl = $"https://api.github.com/repos/{repoOwner}/{repoName}/contents/{folderNumber}";

                // Send DELETE request to GitHub API
                using (var client = new HttpClient()) {
                    client.DefaultRequestHeaders.Add("User-Agent", "GitHub-API-Client");

                    var response = await client.DeleteAsync(folderUrl);
                    response.EnsureSuccessStatusCode();

                    return Ok("Folder deleted successfully.");
                }
            }
            catch (Exception ex) {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

    }







    public class FolderItem {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Download_Url { get; set; }
    }

}
