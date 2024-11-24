using WordleServer.Data;

namespace WordleServer.DB
{
    public interface IUserRepository
    {
        public Task<User> GetUserByIdAsync(string id);
        public Task<User> GetUserByUsernameAsync(string username);
        public Task<bool> CreateUserAsync(User user);
    }
}

