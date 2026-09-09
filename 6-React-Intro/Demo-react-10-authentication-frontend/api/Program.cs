using Microsoft.EntityFrameworkCore;
using MyShop.DAL;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Events;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using MyShop.Models;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = // Prevents circular reference exceptions
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi(); // 2. Native .NET OpenAPI Support

builder.Services.AddDbContext<ItemDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("ItemDbContextConnection"));
});

builder.Services.AddDbContext<AuthDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("AuthDbContextConnection"));
});

builder.Services.AddIdentity<AuthUser, IdentityRole>()
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // Set to true in production
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true, // Validate the token issuer is correct
        ValidateAudience = true, // Validate the token reciepient is correct 
        ValidateLifetime = true, // Validate the token has not expired
        ValidateIssuerSigningKey = true, // Validate the JWT signature
        ValidIssuer = builder.Configuration["Jwt:Issuer"], // Reading the issuer of the token
        ValidAudience = builder.Configuration["Jwt:Audience"], // Reading the audience for the token
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not found in configuration.") // Reading the key from the configuration
        ))
    };
    // options.Events = new JwtBearerEvents
    // {
    //     OnMessageReceived = context =>
    //     {
    //         var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
    //         Console.WriteLine($"OnMessageReceived - Token: {token}");
    //         return Task.CompletedTask;
    //     },
    //     OnTokenValidated = context =>
    //     {
    //         Console.WriteLine("OnTokenValidated: SUCCESS");
    //         return Task.CompletedTask;
    //     },
    //     OnAuthenticationFailed = context =>
    //     {
    //         Console.WriteLine($"OnAuthenticationFailed: {context.Exception.Message}");
    //         Console.WriteLine($"Exception Type: {context.Exception.GetType().Name}");
    //         if (context.Exception.InnerException != null)
    //         {
    //             Console.WriteLine($"Inner Exception: {context.Exception.InnerException.Message}");
    //         }
    //         return Task.CompletedTask;
    //     },
    //     OnChallenge = context =>
    //     {
    //         Console.WriteLine($"OnChallenge: {context.Error} - {context.ErrorDescription}");
    //         return Task.CompletedTask;
    //     }
    // };    
});

builder.Services.AddCors(options => // CORS Policy for React Frontend Integration
{
    options.AddPolicy("CorsPolicy", policy =>
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost") // Allows any port on localhost
              .AllowAnyMethod().AllowAnyHeader().AllowCredentials());
});

builder.Services.AddScoped<IItemRepository, ItemRepository>();

var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Warning()
    .WriteTo.File($"Logs/api_{DateTime.Now:yyyyMMdd_HHmmss}.log");

var logger = loggerConfiguration.CreateLogger();
builder.Logging.AddSerilog(logger);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    DBInit.Seed(app);
    app.MapOpenApi(); // Serve modern OpenAPI document endpoint (/openapi/v1.json)
    app.MapScalarApiReference(); // Serve Scalar Interactive API Documentation UI (/scalar/v1)
}

app.MapStaticAssets();
app.UseCors("CorsPolicy");

// app.Use(async (context, next) =>
// {
//     if (context.Request.Headers.TryGetValue("Authorization", out var authHeader))
//     {
//         var headerValue = authHeader.FirstOrDefault();
//         if (headerValue?.StartsWith("Bearer ") == true)
//         {
//             var token = headerValue.Substring("Bearer ".Length).Trim();

//             // Decode the token to see its contents (without verification)
//             var handler = new JwtSecurityTokenHandler();
//             var jsonToken = handler.ReadJwtToken(token);

//             Console.WriteLine($"--> Token Issuer: {jsonToken.Issuer}");
//             Console.WriteLine($"--> Token Audience: {jsonToken.Audiences.FirstOrDefault()}");
//             Console.WriteLine($"--> Token Expiry: {jsonToken.ValidTo}");
//             Console.WriteLine($"--> Current Time: {DateTime.UtcNow}");
//             Console.WriteLine($"--> Config Issuer: {builder.Configuration["Jwt:Issuer"]}");
//             Console.WriteLine($"--> Config Audience: {builder.Configuration["Jwt:Audience"]}");
//         }
//     }
//     await next.Invoke();
// });

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();