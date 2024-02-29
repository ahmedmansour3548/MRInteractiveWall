using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace MRInteractiveMural.Server.Models
{
    public class ArtModels
    {
        [ValidateNever]
        public int id { get; set; }
        public string modelName { get; set; }
        public string labMemberName { get; set; }
        public string modelFilePath { get; set; }
        public string modelFolderPath { get; set; }
    }
}
