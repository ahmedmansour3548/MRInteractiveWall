using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using MRInteractiveMural.Server.Models;
using MySqlConnector;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;


namespace MRInteractiveMural.Server.Controllers
{
    [Route("")]
    [ApiController]
    public class MemberController : ControllerBase
    {

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<Members>>> GetUsers()
        {
            List<Members> members = new List<Members>();
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            connection.Open();
            using var command = new MySqlCommand("SELECT id, name, number, email, notes, role from members order by id", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                members.Add(new Members()
                {
                    id = (int)reader["id"],
                    name = reader["name"].ToString() ?? "",
                    number = reader["number"].ToString() ?? "",
                    email = reader["email"].ToString() ?? "",
                    notes = reader["notes"].ToString() ?? "",
                    role = reader["role"].ToString() ?? ""
                });
            }
            Response.Headers.Append("X-Total-Count", members.Count().ToString());
            Response.Headers.Append("Access-Control-Expose-Headers", "Content-Range");
            Response.Headers.Append("Content-Range", members.Count().ToString());
            connection.Close();
            return members;
        }

        [HttpGet("users/{userId}")]
        public ActionResult<Members> GetUsersFiltered(int userId)
        {
            int id = userId;
            Members member  = new Members();
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            connection.Open();
            string query = $"SELECT id, name, number, email, notes, role from members where id = {id}";
            using var command = new MySqlCommand(query, connection);
            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                member = new Members
                {
                    id = (int)reader["id"],
                    name = reader["name"].ToString() ?? "",
                    number = reader["number"].ToString() ?? "",
                    email = reader["email"].ToString() ?? "",
                    notes = reader["notes"].ToString() ?? "",
                    role = reader["role"].ToString() ?? ""
                };
            }

            connection.Close();
            return member;
        }

        [HttpPost("users")]
        public Members AddUser(Members member)
        {
            
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            string query = @"INSERT INTO members (id, name, number, email, notes, role) values (@id, @name, @number, @email, @notes, @role)";
            using var command = new MySqlCommand(query, connection);
            command.CommandText = query;
            command.Parameters.AddWithValue("@id", (int)member.id);
            command.Parameters.AddWithValue("@name", member.name);
            command.Parameters.AddWithValue("@number", member.number);
            command.Parameters.AddWithValue("@email", member.email);
            command.Parameters.AddWithValue("@notes", member.notes);
            command.Parameters.AddWithValue("@role", member.role);
            connection.Open();
            command.ExecuteNonQuery();

            connection.Close();
            return member;
        }

        [HttpPut("users/{userId}")]
        public Members UpdateUser(Members member)
        {
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            string query = $"UPDATE members SET name = @name, number = @number, email = @email, notes = @notes, role = @role WHERE id = {member.id}";
            using var command = new MySqlCommand(query, connection);
            command.CommandText = query;
            command.Parameters.AddWithValue("@name", member.name);
            command.Parameters.AddWithValue("@number", member.number);
            command.Parameters.AddWithValue("@email", member.email);
            command.Parameters.AddWithValue("@notes", member.notes);
            command.Parameters.AddWithValue("@role", member.role);
            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();
            return member;
        }

        [HttpDelete("users/{userId}")]
        public void DeleteUser(int userId)
        {
            int id = userId;
            using var connection = new MySqlConnection(ApplicationSettings.RepositoryConnectionString);
            string query = $"DELETE FROM members WHERE id = {id}";
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
