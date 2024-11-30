namespace WordleServer.Data
{
    public class GameResultRequest
    {
        public string UserID { get; set; }
        public int Guesses { get; set; }
        public string WordOfDayPlayed { get; set; }
        public bool IsWin { get; set; }
    }
}