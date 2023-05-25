
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');
const path = require("path");


const userRoutes = require("./routers/userRoutes");
const reportRouter = require("./routers/reportsRouter");
const categoryRouter = require("./routers/categoryRouter");
const feedbackRouter = require("./routers/feedbackRouter");
const chatRouter = require("./routers/chatRouter");
const messageRouter = require("./routers/messageRouter");
const notificationRoutes = require("./routers/notificationRoutes");
dotenv.config();
const app = express();

const options = {
  swaggerDefinition: {
    info: {
        title: 'GUB Reporting System',
        version: '1.0.0',
    },
    
  },
  apis: ['./routers/*.js'], // files containing annotations as above
  
}
const swaggerSpec = swaggerJsdoc(options);

// Connect to MongoDB
mongoose.set("strictQuery", false);
const URI = process.env.MONGO_CONNECTION_STRING
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB ')
})

// Configure middleware
app.use(cors());
app.use(express.json());
app.use('/public/uploads', express.static('./public/uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configure routes
app.use("/api/user", userRoutes);
app.use('/api/reports', reportRouter); 
app.use('/api/category', categoryRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use("/api/notification", notificationRoutes);



// serve static assets 
/**
 * @swagger
 * /public/uploads:
 * get:
 * description: Use to request all customers
 * responses: 
 * '200':
 * description: A successful response
 * 
 */

// app.use('/public/uploads', express.static('./public/uploads'))
app.use(express.static(path.join(__dirname, "../clint/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname,"../", "clint","build", "index.html"));
});

// Start server

app.get('/', (req, res) => {
    res.send('Hello World!')
})
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Sockets are in action");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData.name, "connected");
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });
  socket.on("new message", (newMessage) => {
    console.log("new message", newMessage);
    var chat = newMessage.chatId;
 
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      
      if (socket.connected) {
        socket.in(user._id).emit("message received", newMessage);
      }
    });
  
    socket.on("typing", (room) => {
      console.log({room})
      console.log("typing");
      socket.in(room).emit("typing");
    });
    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});