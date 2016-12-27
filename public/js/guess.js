$(document).ready(function () {

  /*
   * When the user is logged in, it's name is loaded in the "data" attribute of the "#loggedUser" element.
   * This name is then passed to the socket connection handshake query
   */
  var username;

  // socket used for real time games
  var socket = io();

  //socket used to broadcast live games on tv page
  var tvSocket = io('/guess');

  // socket used to broadcast events to monitoring page
  var monitorSocket = io('http://localhost:3000/monitor');

  $("#start").on('click', function () {
    socket.emit('join', '');
  });


  function message(m) {
    $('#messages').append(m + '<br/>');
  }
});

