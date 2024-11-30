using Microsoft.AspNetCore.Mvc;
using WordleServer.Data;
using WordleServer.DB;

namespace WordleServer.Controllers
{
    [ApiController]
    [Route("api/game")]
    public class GameController : ControllerBase
    {
        private readonly IGameRepository _gameRepository;
        
        public GameController(IGameRepository gameRepository)
        {
            _gameRepository = gameRepository;
        }
        
        [HttpGet("wotd")]
        public async Task<IActionResult> GetWordOfTheDay()
        {
            return Ok(await Task.FromResult(WordList.GetWordOfTheDay()));
        }
        
        [HttpPost("report")]
        public async Task<IActionResult> ReportResult([FromBody] GameResultRequest request)
        {
            try
            {
                if (request.WordOfDayPlayed != WordList.GetWordOfTheDay())
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
                    DatePlayed = DateTime.UtcNow,
                    WordOfTheDay = request.WordOfDayPlayed,
                    Guesses = request.Guesses,
                    IsWin = request.IsWin
                });

                return Ok("Result reported");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reporting result: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured while reporting the result");
            }
        }
        
        [HttpGet("has-played")]
        public async Task<IActionResult> HasUserPlayedToday([FromQuery] string userID)
        {
            try
            {
                bool hasPlayed = await _gameRepository.HasUserPlayedToday(userID);

                return Ok(new HasUserPlayedResponse { HasPlayed = hasPlayed });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking if user played today: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while checking if the user played");
            }
        }
    }
}