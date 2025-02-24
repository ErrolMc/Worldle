using Newtonsoft.Json;

namespace WordleServer.Data
{
    public class GameResultSmall
    {
        [JsonProperty("wotd")] public string Wotd { get; set; }
        [JsonProperty("attempts")] public List<string> Attempts { get; set; }
        [JsonProperty("isWin")] public bool IsWin { get; set; }

        public static GameResultSmall FromGameResult(GameResult gameResult)
        {
            if (gameResult == null)
                return null;

            return new GameResultSmall()
            {
                Wotd = gameResult.WordOfTheDay,
                Attempts = gameResult.Attempts,
                IsWin = gameResult.IsWin
            };
        }
    }
}
