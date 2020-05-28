# Scrum Poker

Rebuilding https://scrum-poker.org/ with ASP.NET, Angular and SignalR.


## Purpose

This project aims at demonstrating the use of the Angular frontend framework in conjunction with Microsoft ASP.NET as backend 
and Microsoft SignalR as the WebSocket-based communication system. It also demonstrates CI/CD using GitHub Actions as well as 
direct deployment to an Azure App Service instance. 

This is a training project developed at ZEISS Digital Innovation.

## Installation

This project was built and tested using Microsoft .NET Core 3.1.101 on Windows 10.

### Using Visual Studio 2019

Simply open the `scrum_poker.sln` solution and start the app using IIS Express.

### Build and publish manually

1. Run `dotnet restore` to install all backend dependencies.
2. Run `dotnet build --no-restore [--configuration Release]` to build the app.
3. Run `dotnet publish [-c Release] -o <YourDeploymentDirectory>` to
    * Install Angular frontend dependencies
    * Build the Angular client app
    * Make the finished app available in the `<YourDeploymentDirectory>` directory
