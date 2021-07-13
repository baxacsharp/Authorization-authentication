import express from "express";
import { Blogs, Comments, category } from "../../DB/db.js";
import createError from "http-errors";
const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Blogs.findAll({ include: [Comments, category] });
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .post(async (req, res, next) => {
    try {
      const data = await Blogs.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Blogs.findByPk(req.params.id);
      res.send("Data send successfully");
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .put(async (req, res, next) => {
    try {
      const author = await Blogs.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      });
      res.send("Updated successfully", author);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .delete(async (req, res, next) => {
    try {
      const author = await Blogs.destroy({ where: { id: req.params.id } });
      res.send("Deleted successfully");
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });

export default router;
