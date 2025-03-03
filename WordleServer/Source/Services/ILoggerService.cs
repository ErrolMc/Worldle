
namespace WordleServer.Logging
{
    public enum LogLevel
    {
        Log = 0,
        Warning = 1,
        Error = 2,
        None = 3
    }
    
    public interface ILoggerService
    {
        public void Log(string message, LogLevel level = LogLevel.Log);
    }
}