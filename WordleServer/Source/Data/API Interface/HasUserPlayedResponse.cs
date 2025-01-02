using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class HasUserPlayedResponse
    {
        [JsonProperty("hasPlayed")] public bool HasPlayed { get; set; }
    }
}