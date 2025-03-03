using Microsoft.AspNetCore.Mvc;
using WordleServer.Data;
using WordleServer.DB;
using WordleServer.Logging;
using LogLevel = WordleServer.Logging.LogLevel;

namespace WordleServer.Controllers
{
    [ApiController]
    [Route("api/game")]
    public class GameController : ControllerBase
    {
        private readonly ILoggerService _logger;
        private readonly IGameRepository _gameRepository;
        
        public GameController(IGameRepository gameRepository, ILoggerService logger)
        {
            _logger = logger;
            _gameRepository = gameRepository;
        }
        
        [HttpGet("wotd")]
        public async Task<IActionResult> GetWordOfTheDay()
        {
            string wotd = WordList.GetWordOfTheDay();
            return Ok(await Task.FromResult(wotd));
        }
        
        [HttpPost("report")]
        public async Task<IActionResult> ReportResult([FromBody] GameResultRequest request)
        {
            try
            {
                if (request.Wotd != WordList.GetWordOfTheDay())
                {
                    return BadRequest("Invalid Word of the Day reported");
                }

                bool hasPlayedAlready = await _gameRepository.HasUserPlayedToday(request.UserID);

                if (hasPlayedAlready)
                {
                    return BadRequest("Already played today");
                }

                await _gameRepository.SaveGameResult(new GameResult()
                {
                    ID = Guid.NewGuid().ToString(),
                    UserID = request.UserID,
                    DatePlayed = DateTime.UtcNow.Date,
                    WordOfTheDay = request.Wotd,
                    Attempts = request.Attempts,
                    IsWin = request.IsWin
                });

                _logger.Log($"Reported {request.Wotd} for {request.UserID}, success: {request.IsWin}");
                return Ok("Result reported");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error reporting result: {ex.Message}", LogLevel.Error);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured while reporting the result");
            }
        }
        
        [HttpGet("has-played")]
        public async Task<IActionResult> HasUserPlayedToday([FromQuery] string userID)
        {
            try
            {
                GameResult gameResult = await _gameRepository.GetTodaysGameResult(userID);

                return Ok(new HasUserPlayedResponse { HasPlayed = gameResult != null, GameResult = GameResultSmall.FromGameResult(gameResult)});
            }
            catch (Exception ex)
            {
                _logger.Log($"Error checking if user played today: {ex.Message}", LogLevel.Error);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while checking if the user played");
            }
        }
        
        [HttpGet("game-history")]
        public async Task<IActionResult> GameHistory([FromQuery] string userID)
        {
            try
            {
                List<GameResult> gameResults = await _gameRepository.GetUserGameHistory(userID);

                return Ok(new GetGameHistoryResponse() { GameResults = gameResults });
            }
            catch (Exception ex)
            {
                _logger.Log($"Error getting game history: {ex.Message}", LogLevel.Error);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while getting game history");
            }
        }
    }
}