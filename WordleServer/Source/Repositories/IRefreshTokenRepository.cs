
using WordleServer.Data;

namespace WordleServer.DB
{
    public interface IRefreshTokenRepository
    {
        public Task<(RefreshTokenData data, RefreshTokenValidateState state)> ValidateRefreshToken(string token);
        public Task<bool> RemoveRefreshToken(string token);
        public Task<string> CreateRefreshToken(string userID, string audience);
        public Task<string> RotateRefreshToken(RefreshTokenData data);
    }
}