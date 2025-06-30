const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", productController.getAll);
router.get("/search", productController.search);
router.get("/category/:id", productController.getByCategory);
router.get("/paginated", productController.getPaginated);
router.get("/count", productController.countAll);
router.get("/count/category/:category_id", productController.countByCategory);
router.get("/count/price-range", productController.countByPriceRange);
router.get("/:id", productController.getById);

router.post("/", productController.create);
router.post(
  "/with-image",
  upload.array("images", 4),
  productController.createWithImage
);
router.put("/:id", productController.update);
router.put(
  "/update-with-images/:id",
  upload.array("images", 4),
  productController.updateWithImages
);
router.delete("/:id", productController.delete);

module.exports = router;
