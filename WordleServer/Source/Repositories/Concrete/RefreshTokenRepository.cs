using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using WordleServer.Data;
using Microsoft.AspNetCore.DataProtection;

namespace WordleServer.DB
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly Container _container;
        private readonly IDataProtectionProvider _dataProtectionProvider;

        public RefreshTokenRepository(Database database, IDataProtectionProvider dataProtectionProvider)
        {
            _container = database.GetContainer(Constants.REFRESH_TOKENS_CONTAINER_NAME);
            _dataProtectionProvider = dataProtectionProvider;
        }
        
        public async Task<(RefreshTokenData data, RefreshTokenValidateState state)> ValidateRefreshToken(string token)
        {
            IQueryable<RefreshTokenData> query = _container.GetItemLinqQueryable<RefreshTokenData>().Where(r => r.Token == token);
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
            IQueryable<RefreshTokenData> query = _container.GetItemLinqQueryable<RefreshTokenData>().Where(r => r.Token == token);
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
            RefreshTokenData refreshToken = new RefreshTokenData
            {
                ID = Guid.NewGuid().ToString(),
                Token = GenerateTokenString(userID),
                UserID = userID,
                Expiry = DateTime.UtcNow.AddDays(Constants.REFRESH_TOKEN_EXPIRATION_DAYS),
                Audience = audience
            };

            await _container.CreateItemAsync(refreshToken, new PartitionKey(refreshToken.ID));
            return refreshToken.Token;
        }

        public async Task<string> RotateRefreshToken(RefreshTokenData data)
        {
            data.Token = GenerateTokenString(data.UserID);
            data.Expiry = DateTime.UtcNow.AddDays(Constants.REFRESH_TOKEN_EXPIRATION_DAYS);
            
            await _container.ReplaceItemAsync(data, data.ID, new PartitionKey(data.ID));
            return data.Token;
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

        private string GenerateTokenString(string userID)
        {
            IDataProtector protector = _dataProtectionProvider.CreateProtector("RefreshToken");
            string newToken = protector.Protect($"{userID}:{DateTime.UtcNow.Ticks}");
            
            return newToken;
        }
    }
}