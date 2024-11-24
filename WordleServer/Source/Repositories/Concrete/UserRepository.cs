using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using WordleServer.Data;
using User = WordleServer.Data.User;

namespace WordleServer.DB
{
    public class UserRepository : IUserRepository
    {
        private readonly Container _container;

        public UserRepository(Database database)
        {
            _container = database.GetContainer(Constants.USERS_CONTAINER_NAME);
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
                Console.WriteLine($"GetUserByIdAsync Exception : {e.Message}");
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
                Console.WriteLine($"GetUserByUsernameAsync Exception : {e.Message}");
                return null;
            }
        }

        public async Task<bool> CreateUserAsync(User user)
        {
            try
            {
                ItemResponse<User> resp = await _container.CreateItemAsync(user, new PartitionKey(user.Id));
                return resp != null;   
            }
            catch (Exception e)
            {
                Console.WriteLine($"CreateUserAsync Exception : {e.Message}");
                return false;
            }
        }
    }
}

