namespace WordleServer.Logging.Concrete
{
    public class ConsoleLogger : ILoggerService
    {
        private readonly LogLevel _minLogLevel;
        
        public ConsoleLogger(LogLevel minLogLevel)
        {
            _minLogLevel = minLogLevel;
        }
        
        public void Log(string message, LogLevel level = LogLevel.Log)
        {
            if (level < _minLogLevel)
                return;
            
            Console.WriteLine($"({level}): {message}");
        }
    }
}