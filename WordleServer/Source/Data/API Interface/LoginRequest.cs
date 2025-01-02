using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class LoginRequest
    {
        [JsonProperty("username")] public string Username { get; set; }
        [JsonProperty("password")] public string Password { get; set; }
        [JsonProperty("audienceURI")] public string AudienceURI { get; set; }
    }
}

