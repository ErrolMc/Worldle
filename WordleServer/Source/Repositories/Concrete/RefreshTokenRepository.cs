using System.Security.Cryptography;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using WordleServer.Data;

namespace WordleServer.DB
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly Container _container;

        public RefreshTokenRepository(Database database)
        {
            _container = database.GetContainer(Constants.REFRESH_TOKENS_CONTAINER_NAME);
        }

        public async Task<(RefreshTokenData data, RefreshTokenValidateState state)> ValidateRefreshToken(string token)
        {
            string tokenHash = HashToken(token);
            IQueryable<RefreshTokenData> query = _container.GetItemLinqQueryable<RefreshTokenData>().Where(r => r.TokenHash == tokenHash);
            FeedIterator<RefreshTokenData> iterator = query.ToFeedIterator();
            FeedResponse<RefreshTokenData> response = await iterator.ReadNextAsync();

            if (response.Count == 0)
                return (null, RefreshTokenValidateState.CantFindToken);

            RefreshTokenData refreshToken = response.First();
            if (refreshToken.Expiry > DateTime.UtcNow)
                return (refreshToken, RefreshTokenValidateState.Success);

            await _container.DeleteItemAsync<RefreshTokenData>(refreshToken.ID, new PartitionKey(refreshToken.ID));
            return (null, RefreshTokenValidateState.TokenExpired);
        }

        public async Task<bool> RemoveRefreshToken(string token)
        {
            string tokenHash = HashToken(token);
            IQueryable<RefreshTokenData> query = _container.GetItemLinqQueryable<RefreshTokenData>().Where(r => r.TokenHash == tokenHash);
            FeedIterator<RefreshTokenData> iterator = query.ToFeedIterator();
            FeedResponse<RefreshTokenData> response = await iterator.ReadNextAsync();

            if (response.Count == 0)
                return false;

            RefreshTokenData refreshToken = response.First();
            await _container.DeleteItemAsync<RefreshTokenData>(refreshToken.ID, new PartitionKey(refreshToken.ID));
            return true;
        }

        public async Task<string> CreateRefreshToken(string userID, string audience)
        {
            string rawToken = GenerateTokenString();
            RefreshTokenData refreshToken = new RefreshTokenData
            {
                ID = Guid.NewGuid().ToString(),
                TokenHash = HashToken(rawToken),
                UserID = userID,
                Expiry = DateTime.UtcNow.AddDays(Constants.REFRESH_TOKEN_EXPIRATION_DAYS),
                Audience = audience
            };

            await _container.CreateItemAsync(refreshToken, new PartitionKey(refreshToken.ID));
            return rawToken;
        }

        public async Task<string> RotateRefreshToken(RefreshTokenData data)
        {
            string rawToken = GenerateTokenString();
            data.TokenHash = HashToken(rawToken);
            data.Expiry = DateTime.UtcNow.AddDays(Constants.REFRESH_TOKEN_EXPIRATION_DAYS);

            await _container.ReplaceItemAsync(data, data.ID, new PartitionKey(data.ID));
            return rawToken;
        }

        public async Task<int> RemoveExpiredTokens()
        {
            IQueryable<RefreshTokenData> query = _container.GetItemLinqQueryable<RefreshTokenData>()
                .Where(r => r.Expiry <= DateTime.UtcNow);

            FeedIterator<RefreshTokenData> iterator = query.ToFeedIterator();
            int deletedCount = 0;

            while (iterator.HasMoreResults)
            {
                FeedResponse<RefreshTokenData> response = await iterator.ReadNextAsync();
                foreach (RefreshTokenData token in response)
                {
                    await _container.DeleteItemAsync<RefreshTokenData>(
                        token.ID,
                        new PartitionKey(token.ID)
                    );
                    deletedCount++;
                }
            }

            return deletedCount;
        }

        private static string GenerateTokenString()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }

        private static string HashToken(string token)
        {
            byte[] hash = SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(hash);
        }
    }
}
