const express=require('express')
const dotenv=require('dotenv').config()
const cors = require("cors");
const dbConnect=require('./config/DB/dbConfig')
const {notFound , errorHandler} = require('./middlewares/errorHandler')
const userRoutes = require('./routes/userRoute')
const shopRoutes = require('./routes/shopRoute')
const banerRoutes = require('./routes/bannerRoutes')

const app=express() 

// Middleware
app.use(express.json())

//cors
app.use(cors());

// verify the server ready by using default endpoint if necessary;
app.get('/', (req, res) => {
	res.send('REST APIs  KMAMS');
});

// User's Route
app.use('/api/users',userRoutes)

// Shop Routes
app.use('/api/shop',shopRoutes)

// Banner Routes
app.use('/api/banner',banerRoutes)

// Error Handler
app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 5000
app.listen(PORT, console.log(`Server is Running ${PORT}`))

