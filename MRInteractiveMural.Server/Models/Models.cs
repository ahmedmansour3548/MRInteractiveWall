using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.OpenApi.Any;
using System.Text.Json.Nodes;

namespace MRInteractiveMural.Server.Models
{
    public class ArtModels
    {
        [ValidateNever]
        public int id { get; set; }
        public string modelName { get; set; } = "";
        public int labMemberID { get; set; }
        public string modelFilePath { get; set; } = "";
        public string fileName { get; set; } = "";
        public JsonValue fileImport { get; set; } = null;
    }
}
