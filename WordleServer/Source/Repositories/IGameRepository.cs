using WordleServer.Data;

namespace WordleServer.DB
{
    public interface IGameRepository
    {
        Task<bool> HasUserPlayedToday(string userID);
        Task SaveGameResult(GameResult result);
        Task<GameResult> GetTodaysGameResult(string userID);
        Task<List<GameResult>> GetUserGameHistory(string userID);
    }
}