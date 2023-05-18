
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');


const userRoutes = require("./routers/userRoutes");
const reportRouter = require("./routers/reportsRouter");
const categoryRouter = require("./routers/categoryRouter");
const feedbackRouter = require("./routers/feedbackRouter");
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configure routes
app.use("/api/user", userRoutes);
app.use('/api/reports', reportRouter); 
app.use('/api/category', categoryRouter);
app.use('/api/feedback', feedbackRouter);



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

app.use('/public/uploads', express.static('./public/uploads'))


// Start server

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
