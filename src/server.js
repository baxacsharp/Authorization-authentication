import express from "express"
import cors from "cors"
import db from "../src/DB/db.js"
import allFolders from "../src/allFolders/folders.js"
import listEndpoints from "express-list-endpoints"
const server = express()
const port = 5000

server.use(express.json())
server.use(cors())
server.use("/server", allFolders)

db.sync({ alter: true })
  .then(() => {
    server.listen(port, () => console.log("server is running: " + port))
    server.on("error", (error) =>
      console.info(" ❌ Server is not running due to : ", error)
    )
  })
  .catch((e) => console.log(e))
console.table(listEndpoints(server))
