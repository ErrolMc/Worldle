namespace WordleServer.Data
{
    public static class Constants
    {
        // constants (doesnt matter if other people see this stuff)
        public const string USERS_CONTAINER_NAME = "Users";
        public const string ELECTRON_APP_AUDIENCE = "WordleElectronApp";
        
        // environment variables (stuff that can be changed or is secret)
        public static string COSMOS_CONNECTION_STRING => Environment.GetEnvironmentVariable("COSMOS_CONNECTION_STRING");
        public static string COSMOS_DATABASE_NAME => Environment.GetEnvironmentVariable("COSMOS_DATABASE_NAME");
        public static string JWT_SIGNING_KEY => Environment.GetEnvironmentVariable("JWT_SIGNING_KEY");
        public static string API_URI => Environment.GetEnvironmentVariable("API_URI");
        public static string WEB_APP_URI => Environment.GetEnvironmentVariable("WEB_APP_URI");
        
        // other
        public static readonly List<string> AllowedAudiences = new List<string>
        {
            WEB_APP_URI,
            ELECTRON_APP_AUDIENCE,
        };
    }
}

