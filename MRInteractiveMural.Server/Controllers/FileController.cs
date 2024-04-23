using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace YourNamespace.Controllers {
    [Route("api")]
    [ApiController]
    public class FileController : ControllerBase {

        [HttpPost("uploadGitHubFile")]
        public async Task<IActionResult> UploadFile(string token, IFormFile file) {
            try {
                if (file == null || file.Length == 0) {
                    return BadRequest("No file uploaded.");
                }

                // Read file content as base64 string
                using (var memoryStream = new MemoryStream()) {
                    await file.CopyToAsync(memoryStream);
                    var base64Content = Convert.ToBase64String(memoryStream.ToArray());

                    // Construct API URL
                    var apiUrl = $"https://api.github.com/repos/ahmedmansour3548/MRInteractiveWallPage/contents/{file.FileName}";

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

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file) {
            if (file == null || file.Length == 0) {
                return BadRequest("No file uploaded.");
            }
            try {
                // Create Drive API service
                var service = GetService();

                GetDriveFiles("root");
                // Upload file to Google Drive
                var fileMetadata = new Google.Apis.Drive.v3.Data.File()
                {
                    Name = file.FileName,
                    Parents = new string[] { "139poIBq-GrAwExWpBWVG6YFl8-9O_ZYg" } // ID of the folder in which you want to upload the file
                };
                using (var stream = file.OpenReadStream()) {
                    var request = service.Files.Create(fileMetadata, stream, file.ContentType);
                    request.Fields = "id";
                    var uploadedFile = await request.UploadAsync();
                    if (uploadedFile != null && uploadedFile.Status != Google.Apis.Upload.UploadStatus.Failed) {
                        return Ok("File uploaded successfully.");
                    }
                    else {
                        return BadRequest("Error uploading file: " + uploadedFile.Exception) ;
                    }
                }
            }
            catch (Exception ex) {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        private static DriveService GetService() {

            var applicationName = "MRIW"; // Use the name of the project in Google Cloud
            // Load the service account key file
            string serviceAccountKeyPath = "C:\\Users\\Ahmed\\Playground\\Models\\mriw.json";
            GoogleCredential credential;
            using (var stream = new FileStream(serviceAccountKeyPath, FileMode.Open, FileAccess.Read)) {
                credential = GoogleCredential.FromStream(stream)
                    .CreateScoped(new[] { DriveService.ScopeConstants.Drive });
            }

            var service = new DriveService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = applicationName
            });

            return service;
        }
        [HttpPost("createDriveFolder")]
        public string CreateDriveFolder(string parent, string folderName) {
            var service = GetService();
            var driveFolder = new Google.Apis.Drive.v3.Data.File();
            driveFolder.Name = folderName;
            driveFolder.MimeType = "application/vnd.google-apps.folder";
            driveFolder.Parents = new string[] { parent };
            var command = service.Files.Create(driveFolder);
            var file = command.Execute();
            return file.Id;
        }

        [HttpGet("getDriveFiles")]
        public IEnumerable<Google.Apis.Drive.v3.Data.File> GetDriveFiles(string folder = null) {
            var service = GetService();

            var fileList = service.Files.List();
            if (!string.IsNullOrEmpty(folder)) {
                fileList.Q = $"mimeType!='application/vnd.google-apps.folder' and '{folder}' in parents";
            }
            else {
                fileList.Q = "mimeType!='application/vnd.google-apps.folder' and 'root' in parents";
            }
            fileList.Fields = "nextPageToken, files(id, name, size, mimeType)";

            var result = new List<Google.Apis.Drive.v3.Data.File>();
            string pageToken = null;
            do {
                fileList.PageToken = pageToken;
                var filesResult = fileList.Execute();
                var files = filesResult.Files;
                pageToken = filesResult.NextPageToken;
                result.AddRange(files);
            } while (pageToken != null);

            return result;
        }

        [HttpGet("getDriveFolders")]
        public IEnumerable<Google.Apis.Drive.v3.Data.File> GetFolders(bool includeSharedFolders) {
            var service = GetService();
            var fileListRequest = service.Files.List();
            fileListRequest.Q = "mimeType = 'application/vnd.google-apps.folder'";
            fileListRequest.Fields = "files(id, name, mimeType)";
            var fileList = fileListRequest.Execute().Files;

            if (includeSharedFolders) {
                return fileList;
            }
            else {
                var nonSharedFolders = new List<Google.Apis.Drive.v3.Data.File>();
                foreach (var file in fileList) {
                    var permissionListRequest = service.Permissions.List(file.Id);
                    var permissions = permissionListRequest.Execute().Permissions;
                    bool isShared = permissions.Any(permission => permission.Type == "anyone" || permission.Type == "anyoneWithLink");
                    if (!isShared) {
                        nonSharedFolders.Add(file);
                    }
                }
                return nonSharedFolders;
            }
        }

        [HttpPost("downloadFiles")]
        public void DownloadFilesFromFolder(string folderId, string destinationDirectory) {
            var service = GetService();
            try {
                // Define parameters for the file list request
                var fileListRequest = service.Files.List();
                fileListRequest.Q = $"'{folderId}' in parents";
                fileListRequest.Fields = "files(id, name, mimeType)";

                // Get the list of files in the folder
                var fileList = fileListRequest.Execute().Files;

                // Download each file
                foreach (var file in fileList) {
                    DownloadFile(file.Id, file.Name, destinationDirectory);
                }

                Console.WriteLine("All files downloaded successfully.");
            }
            catch (Exception ex) {
                Console.WriteLine($"An error occurred while downloading files from the folder: {ex.Message}");
            }
        }

        [HttpPost("downloadFile")]
        private void DownloadFile(string fileId, string fileName, string destinationDirectory) {
            var service = GetService();
            var request = service.Files.Get(fileId);
            var stream = new MemoryStream();

            try {
                // Download the file
                request.Download(stream);
                stream.Position = 0;

                // Save the file to the destination directory
                var filePath = Path.Combine(destinationDirectory, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write)) {
                    stream.CopyTo(fileStream);
                }
            }
            catch (Exception ex) {
                Console.WriteLine($"An error occurred while downloading file '{fileName}': {ex.Message}");
            }
            finally {
                stream.Dispose();
            }
        }

        [HttpGet("model")]
        public IActionResult GetARModel(string masterFolderId, int subfolderNumber) {
            var service = GetService();
            try {
                // Get the webContentLink for the .gltf/.glb file in the specified subfolder
                string webContentLink = GetContentFile(masterFolderId, subfolderNumber);

                if (webContentLink != null) {
                    // Construct the dynamic link
                    var dynamicLink = $"https://drive.google.com/uc?id={webContentLink}&export=download";

                    // Return the dynamic link
                    return Ok(new { link = dynamicLink });
                }
                else {
                    return NotFound("No .gltf/.glb file found in the specified subfolder.");
                }
            }
            catch (Exception ex) {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("getContentFile")]
        public string GetContentFile(string masterFolderId, int subfolderNumber) {
            var service = GetService();
            try {
                // Find the subfolder with the specified number
                var subfolderName = subfolderNumber.ToString();
                var subfolder = GetSubfolderByName(masterFolderId, subfolderName);
                if (subfolder == null) {
                    Console.WriteLine($"Subfolder '{subfolderName}' not found in the master folder.");
                    return null;
                }

                // Retrieve the list of files in the subfolder
                var fileListRequest = service.Files.List();
                fileListRequest.Q = $"'{subfolder.Id}' in parents and (mimeType='model/gltf+json' or mimeType='model/gltf-binary')";
                fileListRequest.Fields = "files(webContentLink)";
                var fileList = fileListRequest.Execute().Files;

                // Find and return the webContentLink for the .gltf/.glb file in the subfolder
                var contentFile = fileList.FirstOrDefault();
                if (contentFile != null) {
                    return contentFile.WebContentLink;
                }
                else {
                    Console.WriteLine("No .gltf/.glb files found in the subfolder.");
                    return null;
                }
            }
            catch (Exception ex) {
                Console.WriteLine($"An error occurred while retrieving the content file webContentLink: {ex.Message}");
                return null;
            }
        }

        private Google.Apis.Drive.v3.Data.File GetSubfolderByName(string masterFolderId, string subfolderName) {
            var service = GetService();
            var fileListRequest = service.Files.List();
            fileListRequest.Q = $"'{masterFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='{subfolderName}'";
            fileListRequest.Fields = "files(id)";
            var fileList = fileListRequest.Execute().Files;
            return fileList.FirstOrDefault();
        }

        [HttpPost("shareDriveFolder")]
        public void ShareFolder(string folderId, string userEmail) {
            var service = GetService();
            try {
                // Create permission for the user with full access
                var permission = new Permission
                {
                    Type = "user",
                    Role = "writer", // Full acess
                    EmailAddress = userEmail
                };

                // Insert the permission
                service.Permissions.Create(permission, folderId).Execute();
                Console.WriteLine($"Folder shared with user {userEmail} successfully.");
            }
            catch (Exception ex) {
                Console.WriteLine($"An error occurred while sharing the folder with user {userEmail}: {ex.Message}");
            }
        }

        [HttpDelete("deleteDriveFolder")]
        public void DeleteFolder(string folderId) {
            var service = GetService();
            try {
                service.Files.Delete(folderId).Execute();
                Console.WriteLine("Folder deleted successfully.");
            }
            catch (Exception ex) {
                Console.WriteLine($"An error occurred while deleting the folder: {ex.Message}");
            }
        }

        [HttpDelete("deleteDriveFile")]
        public void DeleteFile(string fileId) {
            var service = GetService();
            var command = service.Files.Delete(fileId);
            var result = command.Execute();
        }
    }

}
