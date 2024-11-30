using WordleServer.Data;

namespace WordleServer.DB
{
    public interface IGameRepository
    {
        Task<bool> HasUserPlayedToday(string userID);
        Task SaveGameResult(GameResult result);
    }
}