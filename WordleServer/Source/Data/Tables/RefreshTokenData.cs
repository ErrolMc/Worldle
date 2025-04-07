using Newtonsoft.Json;

namespace WordleServer.Data
{
    public enum RefreshTokenValidateState
    {
        Success = 0,
        CantFindToken,
        TokenExpired,
    }
    
    public class RefreshTokenData
    {
        [JsonProperty("id")] public string ID { get; set; }
        [JsonProperty("token")] public string Token { get; set; }
        [JsonProperty("expiry")] public DateTime Expiry { get; set; }
        [JsonProperty("userid")] public string UserID { get; set; }
        [JsonProperty("audience")] public string Audience { get; set; }
    }
}