using Microsoft.AspNetCore.Mvc;
using MRInteractiveMural.Server.Models;
using MySqlConnector;
using System;
using System.Text.Json;

namespace MRInteractiveMural.Server.Controllers
{
    [Route("api")]
    [ApiController]
    public class ModelController : ControllerBase
    {

        [HttpGet("models")]
        public async Task<ActionResult<IEnumerable<ArtModels>>> GetModels()
        {
            List<ArtModels> models = new List<ArtModels>();
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            connection.Open();
            using var command = new MySqlCommand("SELECT id, modelName, labMemberID, modelFilePath, modelFileName from models order by id", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                models.Add(new ArtModels()
                {
                    id = (int)reader["id"],
                    modelName = reader["modelName"].ToString() ?? "",
                    labMemberID = (int)reader["labMemberID"],
                    modelFilePath = reader["modelFilePath"].ToString() ?? "",
                    modelFileName = reader["modelFileName"].ToString() ?? ""
                });
            }
            Response.Headers.Append("X-Total-Count", models.Count().ToString());
            Response.Headers.Append("Access-Control-Expose-Headers", "Content-Range");
            Response.Headers.Append("Content-Range", models.Count().ToString());
            connection.Close();
            return models;
        }

        [HttpGet("models/{modelId}")]
        public ActionResult<ArtModels> GetModelsFiltered(int modelId)
        {
            int id = modelId;
            ArtModels model = new ArtModels();
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            connection.Open();
            string query = $"SELECT id, modelName, labMemberID, modelFilePath, modelFileName from models where id = {id}";
            using var command = new MySqlCommand(query, connection);
            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                model = new ArtModels
                {
                    id = (int)reader["id"],
                    modelName = reader["modelName"].ToString() ?? "",
                    labMemberID = (int)reader["labMemberID"],
                    modelFilePath = reader["modelFilePath"].ToString() ?? "",
                    modelFileName = reader["modelFileName"].ToString() ?? "",
                };
            }

            connection.Close();
            return model;
        }

        [HttpPost("models")]
        public ArtModels AddModel(ArtModels model)
        {

            //JsonDocument doc = JsonDocument.Parse(jsonString);
            //JsonElement rawFile = doc.RootElement.GetProperty("rawFile");
            //doc = JsonDocument.Parse(rawFile.ToString());
            //JsonElement modelFileName = doc.RootElement.GetProperty("path");

            // Get the string value
            //string name = modelFileName.GetString();

            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            string query = @"INSERT INTO models (id, modelName, labMemberID, modelFilePath, modelFileName) values (@id, @modelName, @labMemberID, @modelFilePath, @modelFileName)";
            using var command = new MySqlCommand(query, connection);
            command.CommandText = query;
            command.Parameters.AddWithValue("@id", (int)model.id);
            command.Parameters.AddWithValue("@modelName", model.modelName);
            command.Parameters.AddWithValue("@labMemberID", model.labMemberID);
            command.Parameters.AddWithValue("@modelFilePath", model.modelFilePath);
            command.Parameters.AddWithValue("@modelFileName", model.modelFileName);
            connection.Open();
            command.ExecuteNonQuery();

            connection.Close();
            return model;
        }

        [HttpPut("models/{modelId}")]
        public ArtModels UpdateModel(ArtModels model)
        {
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            string query = $"UPDATE models SET modelName = @modelName, labMemberID = @labMemberID, modelFilePath = @modelFilePath, modelFileName = @modelFileName WHERE id = {model.id}";
            using var command = new MySqlCommand(query, connection);
            command.CommandText = query;
            command.Parameters.AddWithValue("@modelName", model.modelName);
            command.Parameters.AddWithValue("@labMemberID", model.labMemberID);
            command.Parameters.AddWithValue("@modelFilePath", model.modelFilePath);
            command.Parameters.AddWithValue("@modelFileName", model.modelFileName);
            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();
            return model;
        }

        [HttpDelete("models/{modelId}")]
        public void DeleteModel(int modelId)
        {
            int id = modelId;
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            string query = $"DELETE FROM models WHERE id = {id}";
            using var command = new MySqlCommand(query, connection);
            command.CommandText = query;
            command.Parameters.AddWithValue("@id", id);
            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();
            return;
        }






    }
}
