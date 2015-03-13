var socket = io('http://localhost:8080');

socket.on('move', function (data) {
  console.log(data);
});

socket.on('down', function (data) {
  console.log(data);
});
