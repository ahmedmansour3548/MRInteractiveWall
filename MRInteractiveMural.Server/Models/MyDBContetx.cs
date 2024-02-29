using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace MRInteractiveMural.Server.Models
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        public DbSet<Members> Members { get; set; }
    }
}
