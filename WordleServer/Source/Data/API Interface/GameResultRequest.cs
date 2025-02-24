using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class GameResultRequest
    {
        [JsonProperty("userID")] public string UserID { get; set; }
        [JsonProperty("wotd")] public string Wotd { get; set; }
        [JsonProperty("attempts")] public List<string> Attempts { get; set; }
        [JsonProperty("isWin")] public bool IsWin { get; set; }
    }
}