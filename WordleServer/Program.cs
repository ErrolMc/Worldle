using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Azure.Cosmos;
using Microsoft.IdentityModel.Tokens;
using WordleServer.Auth;
using WordleServer.Auth.Concrete;
using WordleServer.Data;
using WordleServer.DB;
using WordleServer.Logging;
using WordleServer.Logging.Concrete;
using WordleServer.Services;
using LogLevel = WordleServer.Logging.LogLevel;

namespace WordleServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            builder.AddServiceDefaults();
            IServiceCollection services = builder.Services;

            // Add services to the container.
            services.AddControllers();
            services.AddAuthorization();
            services.AddDataProtection();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IGameRepository, GameRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            
            // services
            services.AddScoped<IAuthService, AuthService>();
            services.AddSingleton<ILoggerService>(new ConsoleLogger(LogLevel.Log));
            services.AddHostedService<TokenCleanupService>();

            // Cosmos DB registration from the Aspire client package
            // It registers CosmosClient as a singleton service
            // And also wires up Telemetry for Cosmos DB, which you can see in Aspire Dashboard (Traces)
            builder.AddAzureCosmosClient(Constants.COSMOS_DATABASE_NAME);

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
                    corsBuilder.WithOrigins(Constants.WEB_APP_URI, Constants.ELECTRON_APP_URI)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            
            WebApplication app = builder.Build();
            
            app.MapDefaultEndpoints();

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

            app.MapControllers();

            app.Run();
        }
    }
}
