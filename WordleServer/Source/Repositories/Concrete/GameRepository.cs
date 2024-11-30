using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using WordleServer.Data;

namespace WordleServer.DB
{
    public class GameRepository : IGameRepository
    {
        private readonly Container _container;

        public GameRepository(Database database)
        {
            _container = database.GetContainer(Constants.GAMES_CONTAINER_NAME);
        }

        public async Task<bool> HasUserPlayedToday(string userID)
        {
            DateTime today = DateTime.UtcNow.Date;

            IQueryable<GameResult> query = _container.GetItemLinqQueryable<GameResult>().Where(r => r.UserID == userID && r.DatePlayed == today);
            FeedIterator<GameResult> iterator = query.ToFeedIterator();

            while (iterator.HasMoreResults)
            {
                FeedResponse<GameResult> response = await iterator.ReadNextAsync();
                if (response.Count > 0)
                {
                    return true;
                }
            }

            return false;
        }

        public async Task SaveGameResult(GameResult result)
        {
            await _container.CreateItemAsync(result, new PartitionKey(result.UserID));
        }
    }
}