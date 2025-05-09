require('dotenv').config();
const express=require('express');
const cors =require('cors');
const path =require('path');
const connectDB = require('./config/db');

const authRoutes=require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes');
const taskRoutes=require('./routes/taskRoutes');
const reportRoutes=require('./routes/reportRoutes');

const app= express();

app.use(
    cors({
        origin:process.env.CLIENT_URL || '*',
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders:['Content-Type','Authorization'],
    })
)

connectDB();

app.use(express.json());

app.use(authRoutes);
app.use(userRoutes)
app.use(taskRoutes)
app.use(reportRoutes)

app.use("/Uploads",express.static(path.join(__dirname,"Uploads")));


app.get('/', (req, res) => {
    res.json({ message: "welcome in back end" });
});

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on port  http://localhost:${PORT}`));
