using WordleServer.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WordleServer.Auth.Concrete
{
    public class AuthService : IAuthService
    {
        public string GenerateJwtToken(User user, string audience)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.JWT_SIGNING_KEY));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // define token claims
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.ID),
                new Claim(JwtRegisteredClaimNames.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // create the token
            var token = new JwtSecurityToken(
                issuer: Constants.API_URI,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Constants.JWT_EXPIRATION_MINUTES),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool ValidatePassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}

