using WordleServer.Data;

namespace WordleServer.Auth
{
    public interface IAuthService
    {
        string GenerateJwtToken(User user, string audience);
        string HashPassword(string password);
        bool ValidatePassword(string password, string hashedPassword);
    }
}