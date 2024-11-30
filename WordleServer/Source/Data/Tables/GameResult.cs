using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class GameResult
    {
        [JsonProperty("id")] public string ID { get; set; }
        [JsonProperty("userid")] public string UserID { get; set; }
        [JsonProperty("dateplayed")] public DateTime DatePlayed { get; set; }
        [JsonProperty("wotd")] public string WordOfTheDay { get; set; }
        [JsonProperty("guesses")] public int Guesses { get; set; }
        [JsonProperty("iswin")] public bool IsWin { get; set; }
    }
}