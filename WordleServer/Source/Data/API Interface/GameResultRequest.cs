using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class GameResultRequest
    {
        [JsonProperty("userID")] public string UserID { get; set; }
        [JsonProperty("guesses")] public int Guesses { get; set; }
        [JsonProperty("wordOfDayPlayed")] public string WordOfDayPlayed { get; set; }
        [JsonProperty("isWin")] public bool IsWin { get; set; }
    }
}