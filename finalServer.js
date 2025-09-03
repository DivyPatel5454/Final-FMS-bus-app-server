const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let pins = [];
let busChanges = [];
let busMessages = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);


    socket.emit('loadPins', pins);
    socket.emit('loadBusChanges', busChanges);
    socket.emit('loadBusMessages', busMessages);


    socket.on('addPin', (pin) => {
        pins.push(pin);
        io.emit('updatePins', pins);


        setTimeout(() => {
            pins = pins.filter(p => p.id !== pin.id);
            io.emit('updatePins', pins);
            console.log(`Pin ${pin.id} removed after 1 hour.`);
        }, 60 * 60 * 1000);
    });


    socket.on('deletePin', (id) => {
        pins = pins.filter(p => p.id !== id);
        io.emit('updatePins', pins);
    });


    socket.on('addBusChange', (change) => {
        busChanges.push(change);
        io.emit('updateBusChanges', busChanges);
    });
    

    socket.on('deleteBusChange', (id) => {
        busChanges = busChanges.filter(c => c.id !== id);
        io.emit('updateBusChanges', busChanges);
    });
    

    socket.on('addBusMessage', (message) => {
        busMessages.push(message);
        io.emit('updateBusMessages', busMessages);


        setTimeout(() => {
            busMessages = busMessages.filter(m => m.id !== message.id);
            io.emit('updateBusMessages', busMessages);
            console.log(`Message ${message.id} removed after 1 hour.`);
        }, 60 * 60 * 1000);
    });
    

    socket.on('deleteBusMessage', (id) => {
        busMessages = busMessages.filter(m => m.id !== id);
        io.emit('updateBusMessages', busMessages);
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});