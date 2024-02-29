using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace MRInteractiveMural.Server.Models
{
    public class Members
    {
        [ValidateNever]
        public int id { get; set; }
        public string name { get; set; }
        public string number { get; set; }
        public string email { get; set; }
        public string notes { get; set; }
        public string role { get; set; }
    }
}
