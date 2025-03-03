using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class GameResult
    {
        [JsonProperty("id")] public string ID { get; set; }
        [JsonProperty("userid")] public string UserID { get; set; }
        [JsonProperty("dateplayed")] public DateTime DatePlayed { get; set; }
        [JsonProperty("wotd")] public string Wotd { get; set; }
        [JsonProperty("attempts")] public List<string> Attempts { get; set; }
        [JsonProperty("iswin")] public bool IsWin { get; set; }
    }
}