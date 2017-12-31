$(function () {
  //Creating new game
  $('#createGame').click(function(){
    switchView("start", "signin");
  });

  //Joining existing game
  $('#joinGame').click(function(){
    socket.emit('rooms'); //Ask for rooms list
    switchView("start", "rooms");
  });

  //Leaving current game
  $('#leave').click(function(){
    game.leave(); //Tell server to leave the room
    switchView("pungame", "start"); //Show the start screen
  });

  //Upon a room button being clicked
  $('#rooms').delegate(".room", "click", function(){
    var username = $('#rooms > input').val();
    var room = $(this).html();

    game.join(username, room);
    switchView("rooms", "pungame"); //Show game and hide rooms list
  });

  //Function to show game after sign-in
  $('#signin').submit(function(e){
    e.preventDefault(); //Prevent page refresh
    switchView("signin", "pungame"); //Make pungame visible

    var username = $('#signin input:eq(0)').val();
    var room = $('#signin input:eq(1)').val();
    game.join(username, room); //Send username and room to server
  });

  //Upon sending a pun
  $('#puninput').submit(function(e){
    e.preventDefault(); //Don't refresh the page
    game.sendPun(); //Send the pun to the server
    return false;
  });

  //Upon receiving a pun from the server
  socket.on('pun', function(username, msg) {
    game.show("<p>"+username+" said: </p>"+msg);
  });

  //Upon receiving message that a user has disconnected
  socket.on('user disconnected', function(username){
    game.show("<p>"+username+" has disconnected. </p>");
  });

  //Upon receiving message that a user has left
  socket.on('leave game', function(username){
    game.show("<p>"+username+" has left the game. </p>");
  });

  //Upon receiving message that a new user has joined
  socket.on('new user', function(username){
    game.show("<p>"+username+" has joined. </p>");
  });

  //Upon receiving the rooms list
  socket.on('rooms', function(rooms){
    $('#rooms p:gt(0)').remove();
    rooms.forEach((room)=>{
       $('#rooms').append("<p> <button class='room'>" + room + "</button> </p>")
    });

    //Clear rooms list if empty
    if (rooms.length == 0)
      $('#rooms').append("<p>No one's playing right now... Make a new game!</p>");
  });
});
