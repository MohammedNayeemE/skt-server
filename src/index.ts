import dotenv from 'dotenv';
dotenv.config();
import express , {Express , Request , Response } from 'express';
import {Expo} from 'expo-server-sdk';
import cors from 'cors';
import {Server} from 'socket.io';
import {createServer} from 'http';
import {UserRoute} from '../router';
//import {Rooms} from '../lib/util.ts';
const PORT: number = parseInt(process.env.PORT || '6969');
const CLIENT_URL : string = process.env.CLIENT_URL || '*';
const app : Express = express();
const server = createServer(app);

const corsConfig = {
  origin :  CLIENT_URL ,
  methods : "GET,PUT,POST"
}
app.use(cors(corsConfig));
app.use(express.json());
app.use(UserRoute.BASE_ROUTE , UserRoute.router);
app.get('/' , (_ , res : Response) => { res.status(200).json({statusCode : 200 , msg : 'i am well and truly alive'}) } );

const io = new Server(server , {
  cors : {
    origin : CLIENT_URL , 
    credentials : true
  }
});

server.listen(PORT , () => { console.log(`[server]: <3 i am well and truly alive at ${PORT}`) });


let expo = new Expo();
//@ts-ignore
const pushNotification = async (pushTokens, message) => {
  let messages = [];
  
  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: 'default',
      body: message.body,
      data: message.data || {},
    });
  }
//@ts-ignore
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
};

io.on("connection" , (socket) => {
  console.log(`user connected : ${socket.id}`);
  socket.on('call_user', async ({ sender_id, receiver_id, pushToken }) => {
    const room = `room-${sender_id}-to-${receiver_id}`;
    socket.join(room);
    console.log(`User: ${sender_id} created and joined the room: ${room}`);

    // Send notification to receiver
    const notificationMessage = {
      body: `User ${sender_id} is calling you`,
      data: { room, sender_id }
    };
    
    await pushNotification([pushToken], notificationMessage);
  });
  socket.on('join_call' , ({sender_id , room_id , receiver_id}) => { 
     socket.join(room_id);
     console.log(`reciever : ${receiver_id} : joined the room`);
     io.to(room_id).emit('user_joined' , {user_id : receiver_id});
  });
  socket.on('send_msg' , ({msg , room_id}) => { io.to(room_id).emit('get_msg' , {user_id : socket.id , chat : msg}) });

  socket.on('disconnect' , () => { console.log(`user left ${socket.id}`) });

});





