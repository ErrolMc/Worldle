var builder = DistributedApplication.CreateBuilder(args);

#pragma warning disable ASPIRECOSMOSDB001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
var cosmos = builder.AddAzureCosmosDB("cosmos")
    .RunAsPreviewEmulator(
        c => c.WithLifetime(ContainerLifetime.Persistent) // Keep the emulator docker container running across runs
              .WithDataExplorer(51234) // Expose the data explorer on port 51234
              .WithDataVolume()); // Persist data across runs
#pragma warning restore ASPIRECOSMOSDB001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

var databaseName = "wordle";
var db = cosmos.AddCosmosDatabase(databaseName);

db.AddContainer("users", "/id");
db.AddContainer("games", "/id");
db.AddContainer("refreshtokens", "/id");

var jwtSigningKeyParameter = builder.AddParameter("JwtSigningKey", secret: true);
var server = builder.AddProject<Projects.WordleServer>("wordleserver")
    .WithReference(db)
    .WaitFor(db)
    .WithEnvironment("JWT_SIGNING_KEY", jwtSigningKeyParameter)
    .WithEnvironment("COSMOS_DATABASE_NAME", databaseName);

builder.AddNpmApp("client", "../wordleclient", "dev")
    .WithReference(server)
    .WaitFor(server);

builder.Build().Run();
