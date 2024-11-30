using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class User
    {
        [JsonProperty("id")] public string ID { get; set; }
        [JsonProperty("userid")] public string UserID { get; set; }
        [JsonProperty("username")] public string Username { get; set; }
        [JsonProperty("passwordhash")] public string PasswordHash { get; set; }
    }
}
