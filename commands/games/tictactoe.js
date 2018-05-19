const config = require(__basedir + '/config.json');

const commando = require("discord.js-commando");
const mysql = require('mysql');
const con = require(__basedir + '/db_helper');

const TTT = require(__basedir + '/classes/games/ttt');

let games = [];

class TicTacToeCommand extends commando.Command {

  constructor(client) {
    super(client, {
      name: 'ttt',
      group: 'games',
      memberName: 'ttt',
      description: 'Play a game of Tic Tac Toe with the "start" argument',
      args: [{
          key: 'field',
          prompt: 'Must be "start" or a number from 1 to 9',
          type: 'string',
          default: 'start'
        }

      ]
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    if (args.field == "start") {
      // Ein Spiel erstellen oder beitreten
      let foundGame = false;

      for (let game of games) {
        if (game.players[0].user.id == message.member.id) {
          foundGame = true;
          break;
        }

        if (game.players.length == 2) {
          if (game.players[1].user.id == message.member.id) {
            foundGame = true;
            break;
          }
        }
      }

      let joined = false;
      let joinedGame = null;
      if (foundGame == true) {
        message.reply("You already started a game.");
      } else {

        for (let game of games) {
          if (game.players.length == 1) {
            game.players.push(message.member);
            joined = true;
            joinedGame = game;
            break;
          }
        }

        if (joined == true) {
          message.reply(`You joined ${joinedGame.players[0].user.username}'s game`);

          let starter = Math.round(Math.random()) + 1;
          joinedGame.cur = starter;


          //<@ID>
          message.reply(`The game is ready <@${joinedGame.players[0].user.id}>(X) <@${joinedGame.players[1].user.id}>(O)\n\nYou start <@${joinedGame.players[joinedGame.cur-1].user.id}>.\nChoose a number from 1 to 9 with ${config.bot.prefix}ttt 1-9
\`\`\`
1   |   2   |   3
_       _       _

4   |   5   |   6
_       _       _

7   |   8   |   9
\`\`\`
                    `);

        } else {
          games.push(new TTT(message.member));
          message.reply("You created a new game of Tic Tac Toe.\nWaiting for opponent...");
        }

      }
    } else if (args.field == "delete") {
      if (games.length > 0) {
        for (var i = 0, l = games.length; i < l; i++) {
          if (games[i].players[0].user.id == message.member.id) {
            games.splice(i, 1);
            message.reply("You successfully deleted your game.");
          }
        }
      } else {
        message.reply("There is no game running right now.");
      }
    } else {
      for (let game of games) {
        // ist dieser spieler in einem spiel
        if (game.players.length == 1) {
          if (game.players[0].user.id == message.member.id) {
            message.reply("You are still waiting for an opponent!");
          }
        } else if (game.players.length == 2) {
          if (game.players[game.cur - 1].user.id == message.member.id) {
            let ret = game.setField(args.field);
            if (ret == true) {
              message.reply("You've set a field.");
              message.channel.send(`
\`\`\`
${(game.fields[0][0] != 0)?((game.fields[0][0] == 2)?'O':'X'):' '}   |   ${(game.fields[0][1] != 0)?((game.fields[0][1] == 2)?'O':'X'):' '}   |   ${(game.fields[0][2] != 0)?((game.fields[0][2] == 2)?'O':'X'):' '}
_       _       _

${(game.fields[1][0] != 0)?((game.fields[1][0] == 2)?'O':'X'):' '}   |   ${(game.fields[1][1] != 0)?((game.fields[1][1] == 2)?'O':'X'):' '}   |   ${(game.fields[1][2] != 0)?((game.fields[1][2] == 2)?'O':'X'):' '}
_       _       _

${(game.fields[2][0] != 0)?((game.fields[2][0] == 2)?'O':'X'):' '}   |   ${(game.fields[2][1] != 0)?((game.fields[2][1] == 2)?'O':'X'):' '}   |   ${(game.fields[2][2] != 0)?((game.fields[2][2] == 2)?'O':'X'):' '}
\`\`\`

                            `);
              let winner = game.check();
              if (winner === false) {
                message.channel.send(`<@${game.players[game.cur-1].user.id}> It's your turn now.`);
              } else if (winner == -1) {
                message.channel.send(`<@${game.players[0].user.id}> <@${game.players[1].user.id}> It's a draw!`);
                for (var i = 0, l = games.length; i < l; i++) {
                  if (games[i].players[0].user.id == message.member.id || games[i].players[1].user.id == message.member.id) {
                    games.splice(i, 1);
                  }
                }

              } else {
                message.channel.send(`<@${game.players[winner-1].user.id}> won the game. Congratulations!`);
                for (var i = 0, l = games.length; i < l; i++) {
                  if (games[i].players[0].user.id == message.member.id || games[i].players[1].user.id == message.member.id) {
                    games.splice(i, 1);
                  }
                }
              }

            } else {
              message.reply("invalid field");
            }
          } else {
            message.reply("It's not your turn!");
          }
        }
      }
    }
    message.channel.stopTyping(true);
  }
}

module.exports = TicTacToeCommand;