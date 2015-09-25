module.exports = function(app, server){

  ////////////////////////////////////
  // Socket.IO setup
  ////////////////////////////////////
  var Beacons = require('./models/beacons');

  var devices = {};

  var io = require('socket.io')(server);

  // http://stackoverflow.com/questions/8467784/sending-a-message-to-a-client-via-its-socket-id
  io.on('connection', function(socket) {
      console.log('=> a user connected', socket.id);

      // socket.join('global');

      /////////////////
      // Handle Devices
      /////////////////
      socket.on('device.ack', function(payload){
          // console.log('DEVICE ACK', payload);

          devices[socket.id].deviceId = payload.uuid;

          //TODO: Query user by deviceid. Store it in current users.
          //send update to clients.
          var deviceData = {
              deviceId: payload.uuid,
              socketId: socket.id
          };
          socket.broadcast.emit('device.connected', deviceData);
      });

      /////////////////
      // Handle Beacons
      /////////////////
      socket.on('ble.ack', function(payload){
          console.log('BLE ACK', payload);
          socket.broadcast.emit('device.connected', {
              deviceId: 'payload.uuid',
              socketId: socket.id
          });
      });

      socket.on('ble.range', function(payload){
          // console.log('ble.range', payload);
          socket.broadcast.emit('ble.inrange', payload);
          //TODO: Make this for realz
          Beacons.savePing(payload);
      });


      socket.on('disconnect', function(){
          console.log('=> DISCONNECT', devices[socket.id].deviceId);
          io.sockets.emit('device.disconnected', {
              deviceId: devices[socket.id].deviceId
          });
      });

      devices[socket.id] = {
          socket: socket
      };
  });

  app.io = io;
};
