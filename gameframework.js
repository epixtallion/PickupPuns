//Variables/aliases for interacting with the game
var game = {};
var socket = io(); //Server connection variable
game.timer, game.username, game.userlist, game.state;


//Functions for interacting with the game
game.leave = function(){
  //Leave game
  game.username = '';
  $('#punlist').empty(); //Clear the message list
  socket.emit('leave game');
}, game.join = function(username, room){
  //Join game
  game.username = username;
  socket.emit('join game', room, username);
}, game.sendPun = function(){
  //Send pun to the server
  socket.emit('pun', $('#puninput textarea').val());
  $('#text').val('');
}, game.show = function(message){
  //Show message in list
  $('#punlist').append("<li>"+message+"</li>");
  $('#punlist').scrollTop($('#punlist').prop('scrollHeight'));
}


//Functions for interacting with the document

//Switch currently visible view
function switchView(hideBlock, showBlock){
  $("#"+showBlock).show();
  $("#"+hideBlock).hide();
}
$(function(){
  //Handle timer display
  setInterval(function(){
    if(game.timer > 0) game.timer--; //Tick down timer

    //Show timer in the game
    $('#timer').html(Math.floor(game.timer/60) + ' minutes '+game.timer%60+' seconds left');
    if(game.timer == 0)
      $('#timer').html('Time\'s up!');
  }, 1000);

  //Textarea submitting snippet
  $("#text").keypress(function (e) {
    if(e.which == 13 && !e.shiftKey) {
        $(this).closest("form").submit();
        e.preventDefault();
        return false;
    }
  });
});
