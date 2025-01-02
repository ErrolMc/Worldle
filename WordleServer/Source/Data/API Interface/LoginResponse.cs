using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class LoginResponse
    {
        [JsonProperty("userID")] public string UserID { get; set; }
        [JsonProperty("token")] public string Token { get; set; }
    }
}