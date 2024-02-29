using MySqlConnector;
using MRInteractiveMural.Server.Models;
using System;

var builder = WebApplication.CreateBuilder(args);
ApplicationSettings.RepositoryConnectionString = builder.Configuration["ConnectionStrings:Default"];
builder.Services.AddMySqlDataSource(builder.Configuration["ConnectionStrings:Default"]);
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; 
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("https://raw.githack.com",
                "https://localhost:5173",
                "https://localhost:5174",
                "https://localhost:7121/","*")
            .WithHeaders("*")
            .WithMethods("*");
        });
});
var app = builder.Build();


app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
