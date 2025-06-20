namespace WordleServer.Data
{
    public static class Constants
    {
        // constants (doesnt matter if other people see this stuff)
        public const string USERS_CONTAINER_NAME = "users";
        public const string GAMES_CONTAINER_NAME = "games";
        public const string REFRESH_TOKENS_CONTAINER_NAME = "refreshtokens";
        public const string ELECTRON_APP_AUDIENCE = "WordleElectronApp";
        public const string ELECTRON_APP_URI = "http://localhost:5173";
        public const string WEB_APP_URI = "https://localhost:7080";

        // environment variables (stuff that can be changed or is secret)
        public static string COSMOS_DATABASE_NAME => Environment.GetEnvironmentVariable("COSMOS_DATABASE_NAME");
        public static string JWT_SIGNING_KEY => Environment.GetEnvironmentVariable("JWT_SIGNING_KEY");
        public static string API_URI => Environment.GetEnvironmentVariable("API_URI");
        
        // token expirations
        public const int JWT_EXPIRATION_MINUTES = 15;
        public const int REFRESH_TOKEN_EXPIRATION_DAYS = 7;
        
        // other
        public static readonly List<string> AllowedAudiences = new List<string>
        {
            WEB_APP_URI,
            ELECTRON_APP_AUDIENCE,
        };
    }
}

