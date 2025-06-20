using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using WordleServer.Data;
using WordleServer.Logging;
using LogLevel = WordleServer.Logging.LogLevel;
using User = WordleServer.Data.User;

namespace WordleServer.DB
{
    public class UserRepository : IUserRepository
    {
        private readonly Container _container;
        private readonly ILoggerService _logger;

        public UserRepository(CosmosClient cosmosClient, ILoggerService logger)
        {
            _logger = logger;
            _container = cosmosClient.GetDatabase(Constants.COSMOS_DATABASE_NAME)
                .GetContainer(Constants.USERS_CONTAINER_NAME);
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            try
            {
                ItemResponse<User> resp = await _container.ReadItemAsync<User>(id, new PartitionKey(id));
                return resp.Resource;
            }
            catch (Exception e)
            {
                _logger.Log($"GetUserByIdAsync Exception : {e.Message}", LogLevel.Error);
                return null;
            }
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            try
            {
                IQueryable<User> query = _container.GetItemLinqQueryable<User>().Where(u => u.Username == username);
                FeedIterator<User> iterator = query.ToFeedIterator();
                FeedResponse<User> users = await iterator.ReadNextAsync();

                if (users.Count == 0)
                    return null;
                return users.First();
            }
            catch (Exception e)
            {
                _logger.Log($"GetUserByUsernameAsync Exception : {e.Message}", LogLevel.Error);
                return null;
            }
        }

        public async Task<bool> CreateUserAsync(User user)
        {
            try
            {
                ItemResponse<User> resp = await _container.CreateItemAsync(user, new PartitionKey(user.ID));
                return resp != null;   
            }
            catch (Exception e)
            {
                _logger.Log($"CreateUserAsync Exception : {e.Message}", LogLevel.Error);
                return false;
            }
        }
    }
}

