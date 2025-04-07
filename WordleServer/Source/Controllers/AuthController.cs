using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using WordleServer.Data;
using WordleServer.DB;
using WordleServer.Auth;
using WordleServer.Logging;
using LoginRequest = WordleServer.Data.LoginRequest;
using LogLevel = WordleServer.Logging.LogLevel;

namespace WordleServer.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILoggerService _logger;
        
        public AuthController(IAuthService authService, IRefreshTokenRepository refreshTokenRepository,
            IUserRepository userRepository, ILoggerService logger)
        {
            _authService = authService;
            _refreshTokenRepository = refreshTokenRepository;
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
                PasswordHash = _authService.HashPassword(request.Password),
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

            if (user == null || !_authService.ValidatePassword(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            // generate JWT token
            var token = _authService.GenerateJwtToken(user, request.AudienceURI);
            
            // generate refresh token
            var refreshToken = await _refreshTokenRepository.CreateRefreshToken(user.UserID, request.AudienceURI);

            _logger.Log($"User {user.Username} logged in");
            return Ok(new LoginResponse() { UserID = user.UserID, Token = token, RefreshToken = refreshToken });
        }

        [HttpPost("refresh")]
        [Authorize]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            try
            {
                (RefreshTokenData tokenData, RefreshTokenValidateState state) =
                    await _refreshTokenRepository.ValidateRefreshToken(request.RefreshToken);

                if (state != RefreshTokenValidateState.Success)
                {
                    return BadRequest("Couldn't refresh token");
                }

                User user = await _userRepository.GetUserByIdAsync(tokenData.UserID);
                if (user == null)
                {
                    await _refreshTokenRepository.RemoveRefreshToken(request.RefreshToken);
                    return Unauthorized("User not found");
                }

                string newTokenRefreshToken = await _refreshTokenRepository.RotateRefreshToken(tokenData);
                string newJwtToken = _authService.GenerateJwtToken(user, tokenData.Audience);

                return Ok(new LoginResponse() { UserID = user.UserID, Token = newJwtToken, RefreshToken = newTokenRefreshToken });
            }
            catch (Exception ex)
            {
                _logger.Log($"Error when refreshing token: {ex.Message}", LogLevel.Error);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured while refreshing token");
            }
        }
    }
}

