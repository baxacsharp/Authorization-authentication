import express from "express"
import { Authors, Blogs, Comments } from "../../DB/db.js"
import { basicMiddleware } from "../AuthSecurity/authSecurity.js"
import createError from "http-errors"
const router = express.Router()

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Authors.findAll(
        { include: Blogs },
        { include: Comments }
      )
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .post(async (req, res, next) => {
    try {
      // pre-save function.... with your req.body

      const data = await Authors.hashAndSave(req.body)
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Authors.findByPk(req.params.id, {
        attributes: ["id", "username", "avatar", "createdAt", "updatedAt"],
      })
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .put(basicMiddleware, async (req, res, next) => {
    try {
      const author = await Authors.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      })
      res.send("Updated successfully", author)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .delete(basicMiddleware, async (req, res, next) => {
    try {
      const author = await Authors.destroy({ where: { id: req.params.id } })
      res.send("Deleted successfully")
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })

export default router
