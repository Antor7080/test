const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


const userRoutes = require("./routers/userRoutes");
const reportRouter = require("./routers/reportsRouter");
const categoryRouter = require("./routers/categoryRouter");
dotenv.config();
const app = express();


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


// Configure routes
app.use("/api/user", userRoutes);
app.use('/api/reports', reportRouter); 
app.use('/api/category', categoryRouter);



// serve static assets 
app.use('/public/uploads', express.static('./public/uploads'))


// Start server

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
