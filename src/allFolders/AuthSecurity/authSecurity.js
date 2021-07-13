import createError from "http-errors"
import atob from "atob"
import { Blogs, Authors, Comments } from "../../DB/db.js"

export const basicMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createError(401, "You arenot authorized yet"))
  } else {
    const decoded = atob(!req.headers.authorization).split(" ")[1]
    const [username, password] = decoded.split(":")
    console.log(username)
    console.log(password)
    const author = await [Authors, Blogs, Comments].checkCredentials(
      username,
      password
    )
    if (author) {
      req.author = author
    } else {
      next(createError(401, "Username or password is incorrect"))
    }
  }
}
