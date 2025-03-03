using Microsoft.AspNetCore.Mvc;
using WordleServer.Data;
using WordleServer.DB;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WordleServer.Logging;

namespace WordleServer.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILoggerService _logger;
        
        public AuthController(IUserRepository userRepository, ILoggerService logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginRequest request)
        {
            if (!Constants.AllowedAudiences.Contains(request.AudienceURI))
            {
                return BadRequest("Invalid audience");
            }
            
            if (await _userRepository.GetUserByUsernameAsync(request.Username) != null)
            {
                return BadRequest("Username already exists");
            }

            string userID = Guid.NewGuid().ToString();
            var user = new User()
            {
                ID = userID,
                UserID = userID,
                Username = request.Username,
                PasswordHash = HashPassword(request.Password),
            };
            
            if (!await _userRepository.CreateUserAsync(user))
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Unable to create user. Please try again later.");
            }
            
            _logger.Log($"User {user.Username} registered");
            return Ok("User created");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!Constants.AllowedAudiences.Contains(request.AudienceURI))
            {
                return BadRequest("Invalid audience");
            }
            
            var user = await _userRepository.GetUserByUsernameAsync(request.Username);

            if (user == null || !VerifyPasswordHash(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            // generate JWT token
            var token = GenerateJwtToken(user, request.AudienceURI);

            _logger.Log($"User {user.Username} logged in");
            return Ok(new LoginResponse() { UserID = user.UserID, Token = token });
        }
        
        private string GenerateJwtToken(User user, string audience)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.JWT_SIGNING_KEY));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // define token claims
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.ID),
                new Claim(JwtRegisteredClaimNames.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // create the token
            var token = new JwtSecurityToken(
                issuer: Constants.API_URI,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24), // Token expiration
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
        private static bool VerifyPasswordHash(string password, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
        
        private static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}

