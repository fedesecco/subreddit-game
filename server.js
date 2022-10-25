import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import morgan from "morgan"
//db and auth
import connectDB from "./db/connect.js"
//routers
import authRouter from "./routes/authRoutes.js"
import jobsRouter from "./routes/jobsRoutes.js"
//middlewares
import erroreHandlerMiddleWare from "./middleware/error-handler.js"
import notFoundMiddleWare from "./middleware/not-found.js"

if (process.env.NODE_ENV != "production"){
    app.use(morgan("dev"))
}
app.use(express.json())

app.get("/api/v1", (req,res)=>{
    res.send(`Welcome on port ${port}!`)
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", jobsRouter)

app.use(notFoundMiddleWare)
app.use(erroreHandlerMiddleWare)
const port = process.env.PORT || 5000




const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, ()=>{
            console.log(`server is listening on port ${port}...`);
        })
    }
    catch(error){
        console.log(error);
    }
}

start()