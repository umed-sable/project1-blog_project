

const express = require('express');
const router = express.Router();
const midW = require("../Middleware/Auth")

const authorController= require("../controllers/authorController")
const blogController = require("../controllers/blogController")


router.post("/authors", authorController.createAuthor)

router.post("/blogs",midW.verifyUser,blogController.createBlog)
router.get("/blogs/:userId",midW.verifyUser,blogController.getBlogs)


router.put("/blogs/:blogId",midW.authorization, blogController.updateBlogs)
router.delete("/blogs/:blogId",midW.authorization,blogController.deleteById)


router.delete("/blogs",blogController.DeleteBy_QueryParams)

router.post("/login",authorController.loginAuthor)

module.exports = router;