var utils = rootRequire('./utils/utils');
var gamePlay = rootRequire('./games/gamePlay');

var gamesSocket;
var userCount = 0;

var waiting = {
  guess: null,
  picture: null
};
var games = {};

module.exports = {
  create: function (io) {
    gamesSocket = io.of('/games');
    gamesSocket.on('connection', function (socket) {
      userCount++;

      console.log('connected to games socket');

      socket.on('find-opponent', function (data) {
        var player = {name: data.name, socket: socket};
        if (data.game == 2) {
          if (waiting.picture != null) {
            var players = [
              waiting.picture,
              player
            ];

            waiting.picture = null;
            startGame(players, data.game);

          } else {
            waiting.picture = player;
            socket.emit('wait', {});
          }

        } else {
          if (waiting.guess != null) {
            var players = [
              waiting.guess,
              player
            ];

            waiting.guess = null;
            startGame(players, data.game);

          } else {
            waiting.guess = player;
            socket.emit('wait', {});
          }

        }
      });

      socket.on('find-opponent-cancelled', function (data) {
        if (data.game == 1) {
          if (waiting.guess != null && waiting.guess.socket == socket) {
            console.log("find opponent cancelled");
            waiting.guess = null;
          }
        } else {
          if (waiting.picture != null && waiting.picture.socket == socket) {
            console.log("find opponent cancelled");
            waiting.picture = null;
          }
        }

      });

      socket.on('new-move', function (data) {
        console.log('new move ' + data.index);
        socket.broadcast.to(data.room).emit('new-move', data);
      });

      socket.on('win', function (data) {
        socket.broadcast.to(data.room).emit('win', data);
      });

      socket.on('resign', function (data) {
        var room = data.room;
        if (room in games) {
          socket.broadcast.to(room).emit('player-resigned', {});
          games[room].players[0].socket.leave(room);
          games[room].players[1].socket.leave(room);
          delete games[room];
        }

      });
      socket.on('disconnect', function () {
        console.log("disconntecte");
        for (var room in games) {
          var game = games[room];
          for (var p in game.players) {
            var player = game.players[p];
            if (player.socket === socket) {
              socket.broadcast.to(room).emit('opponent-disconnected');
              delete games[room];
            }
          }
        }
      });
    });
  }
};

function startGame(players, gameId) {
  var room = utils.randomString(10);

  players.forEach(function (player) {
    player.socket.join(room);
  });

  var gameData = null;
  if (gameId == 1) {
    gameData = gamePlay.getGuessData();
  } else {
    gameData = gamePlay.getPictureData();
  }
  var data = {
    room: room,
    game: gameId,
    players: players.map(function (item) {
      return {name: item.name};
    }),
    data: gameData
  };

  games[room] = {
    room: room,
    players: players
  };

  gamesSocket.to(room).emit('start-game', data);
}