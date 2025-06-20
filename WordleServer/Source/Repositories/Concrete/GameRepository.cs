using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using WordleServer.Data;

namespace WordleServer.DB
{
    public class GameRepository : IGameRepository
    {
        private readonly Container _container;

        public GameRepository(CosmosClient cosmosClient)
        {
            _container = cosmosClient.GetDatabase(Constants.COSMOS_DATABASE_NAME)
                .GetContainer(Constants.GAMES_CONTAINER_NAME);
        }

        public async Task<bool> HasUserPlayedToday(string userID)
        {
            return await GetTodaysGameResult(userID) != null;
        }

        public async Task SaveGameResult(GameResult result)
        {
            await _container.CreateItemAsync(result, new PartitionKey(result.UserID));
        }
        
        public async Task<GameResult> GetTodaysGameResult(string userID)
        {
            DateTime today = DateTime.UtcNow.Date;

            IQueryable<GameResult> query = _container.GetItemLinqQueryable<GameResult>().Where(r => r.UserID == userID && r.DatePlayed == today);
            FeedIterator<GameResult> iterator = query.ToFeedIterator();
            FeedResponse<GameResult> response = await iterator.ReadNextAsync();
            
            if (response.Count > 0)
                return response.First();
            
            return null;
        }

        public async Task<List<GameResult>> GetUserGameHistory(string userID)
        {
            IQueryable<GameResult> query = _container.GetItemLinqQueryable<GameResult>()
                .Where(r => r.UserID == userID)
                .OrderByDescending(r => r.DatePlayed);  // most recent games first
    
            FeedIterator<GameResult> iterator = query.ToFeedIterator();
            var results = new List<GameResult>();
    
            while (iterator.HasMoreResults)
            {
                FeedResponse<GameResult> response = await iterator.ReadNextAsync();
                results.AddRange(response);
            }
    
            return results;
        }
    }
}