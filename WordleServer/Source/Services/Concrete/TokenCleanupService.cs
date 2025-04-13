using WordleServer.DB;
using WordleServer.Logging;
using LogLevel = WordleServer.Logging.LogLevel;

namespace WordleServer.Services
{
    public class TokenCleanupService : IHostedService, IDisposable
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILoggerService _logger;
        private Timer _timer;

        public TokenCleanupService(IServiceScopeFactory scopeFactory, ILoggerService logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // run cleanup every 24 hours
            _timer = new Timer(DoCleanup, null, TimeSpan.Zero, TimeSpan.FromHours(24));
            return Task.CompletedTask;
        }

        private async void DoCleanup(object state)
        {
            try
            {
                using IServiceScope scope = _scopeFactory.CreateScope();
                
                var refreshTokenRepository = scope.ServiceProvider.GetRequiredService<IRefreshTokenRepository>();
                int deletedCount = await refreshTokenRepository.RemoveExpiredTokens();
                _logger.Log($"Cleaned up {deletedCount} expired refresh tokens", LogLevel.Log);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error during refresh token cleanup: {ex.Message}", LogLevel.Error);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
} 