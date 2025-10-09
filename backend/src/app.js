import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"

const app = express()

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieparser())


//Routes Import 
import userRouter from "./routes/user.routes.js"
import organisationRouter from "./routes/organisation.routes.js"
import membershipRouter from "./routes/membership.routes.js"
import categoryRouter from "./routes/category.routes.js"
import itemRouter from "./routes/item.routes.js"


//Routes Declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/organisations", organisationRouter)
app.use("/api/v1/memberships", membershipRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/items", itemRouter)

export { app }