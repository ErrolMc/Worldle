using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Azure.Cosmos;
using Microsoft.IdentityModel.Tokens;
using WordleServer.Data;
using WordleServer.DB;

namespace WordleServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            IServiceCollection services = builder.Services;
        
            // Add services to the container.
            services.AddAuthorization();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            
            services.AddScoped<IUserRepository, UserRepository>();
            
            services.AddSingleton<Database>((s) =>
            {
                var cosmosClient = new CosmosClient(Constants.COSMOS_CONNECTION_STRING);
                return cosmosClient.GetDatabase(Constants.COSMOS_DATABASE_NAME);
            });
            
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Constants.API_URI,
                        ValidAudiences = Constants.AllowedAudiences,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.JWT_SIGNING_KEY))
                    };
                });
            
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(corsBuilder =>
                {
                    corsBuilder.WithOrigins(Constants.WEB_APP_URI)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            
            WebApplication app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors();
            app.UseHttpsRedirection();
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.Run();
        }
    }
}
