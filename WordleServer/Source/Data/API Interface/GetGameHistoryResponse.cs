using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class GetGameHistoryResponse
    {
        [JsonProperty("gameResults")] public List<GameResult> GameResults { get; set; }
    }
}