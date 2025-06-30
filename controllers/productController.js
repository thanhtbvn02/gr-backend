const { Op } = require("sequelize");
const Product = require("../models/productModel");
const productService = require("../services/productService");
const { uploadImage } = require("../utils/cloudinary");
const ImageService = require("../services/imageService");

const productController = {
  getAll: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  create: async (req, res) => {
    try {
      const productData = {
        name: req.body.name,
        unit: req.body.unit,
        price: req.body.price,
        description: req.body.description || "",
        uses: req.body.uses || "",
        how_use: req.body.how_use || "",
        side_effects: req.body.side_effects || "",
        notes: req.body.notes || "",
        preserve: req.body.preserve || "",
        stock: req.body.stock || 0,
        category_id: req.body.category_id,
      };

      const newProduct = await Product.create(productData);
      res.status(201).json({
        message: "Tạo sản phẩm thành công",
        product: newProduct,
      });
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({
        message: "Lỗi server khi tạo sản phẩm",
        error: err.message,
      });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    try {
      const [updated] = await Product.update(req.body, {
        where: { id },
      });

      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      res.json({ message: "Cập nhật thành công" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server khi cập nhật", error: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await Product.destroy({
        where: { id },
      });

      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      res.json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server khi xóa", error: err });
    }
  },

  getByCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const products = await productService.searchByCategory(id);
      res.json(products);
    } catch (err) {
      console.error("Error getting products by category:", err);
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  search: async (req, res) => {
    const { query } = req.query;
    try {
      const products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${query}%`,
          },
        },
      });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  updateStock: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const [updated] = await Product.update(
        { stock: quantity },
        { where: { id } }
      );

      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      res.json({ message: "Cập nhật tồn kho thành công" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật tồn kho", error: err });
    }
  },

  getPaginated: async (req, res) => {
    const { page, limit = 10, offset, include_image = true } = req.query;
    try {
      let queryOptions = {
        limit: parseInt(limit),
      };

      if (offset !== undefined) {
        queryOptions.offset = parseInt(offset);
      } else if (page !== undefined) {
        queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
      }

      const includeFirstImage =
        include_image === "true" || include_image === true;

      const products = await Product.findAndCountAll(queryOptions);

      if (products.rows.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      let productsWithImages = products.rows;

      if (includeFirstImage) {
        const productIds = productsWithImages.map((product) => product.id);

        const images = await productService.getFirstImagesForProducts(
          productIds
        );

        productsWithImages = productsWithImages.map((product) => {
          const productImage = images.find(
            (img) => img.product_id === product.id
          );
          return {
            ...product.toJSON(),
            image: productImage ? productImage.url : null,
          };
        });
      }

      const response = {
        total: products.count,
        products: productsWithImages,
      };

      if (page !== undefined) {
        response.pages = Math.ceil(products.count / parseInt(limit));
        response.currentPage = parseInt(page);
      }

      res.json(response);
    } catch (err) {
      console.error("Error getting paginated products:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  countAll: async (req, res) => {
    try {
      const count = await productService.count();
      res.json({ count });
    } catch (err) {
      console.error("Error counting all products:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  countByCategory: async (req, res) => {
    const { category_id } = req.params;
    try {
      const count = await productService.countByCategory(category_id);
      res.json({ count });
    } catch (err) {
      console.error("Error counting products by category:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  countByPriceRange: async (req, res) => {
    const { min, max } = req.query;
    try {
      const count = await Product.count({
        where: {
          price: {
            [Op.between]: [parseFloat(min), parseFloat(max)],
          },
        },
      });
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  createWithImage: async (req, res) => {
    try {
      const productData = {
        name: req.body.name,
        unit: req.body.unit,
        price: req.body.price,
        description: req.body.description || "",
        uses: req.body.uses || "",
        how_use: req.body.how_use || "",
        side_effects: req.body.side_effects || "",
        notes: req.body.notes || "",
        preserve: req.body.preserve || "",
        stock: req.body.stock || 0,
        category_id: req.body.category_id,
      };
      const newProduct = await Product.create(productData);
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileBuffer = file.buffer;
          const fileBase64 = `data:${
            file.mimetype
          };base64,${fileBuffer.toString("base64")}`;
          const uploadResult = await uploadImage(fileBase64);
          await ImageService.create(newProduct.id, uploadResult.url);
        }
      }
      res.status(201).json({
        message: "Tạo sản phẩm thành công",
        product: newProduct,
      });
    } catch (err) {
      console.error("Error creating product with image:", err);
      res.status(500).json({
        message: "Lỗi server khi tạo sản phẩm",
        error: err.message,
      });
    }
  },
  updateWithImages: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      unit,
      price,
      description,
      uses,
      how_use,
      side_effects,
      notes,
      preserve,
      stock,
      category_id,
    } = req.body;

    let images = req.body.images;
    if (typeof images === "string") images = [images];
    if (!images) images = [];

    try {
      let uploadedUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileBuffer = file.buffer;
          const fileBase64 = `data:${
            file.mimetype
          };base64,${fileBuffer.toString("base64")}`;
          const uploadResult = await uploadImage(fileBase64);
          uploadedUrls.push(uploadResult.url);
        }
      }

      const finalImageUrls = [...images.filter(Boolean), ...uploadedUrls];

      const [updated] = await Product.update(
        {
          name,
          unit,
          price,
          description,
          uses,
          how_use,
          side_effects,
          notes,
          preserve,
          stock,
          category_id,
        },
        { where: { id } }
      );
      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      const oldImages = await ImageService.getByProductId(id);
      const oldUrls = oldImages.map((img) => img.url);

      for (const img of oldImages) {
        if (!finalImageUrls.includes(img.url)) {
          await ImageService.remove(img.id);
        }
      }
      for (const url of finalImageUrls) {
        if (url && !oldUrls.includes(url)) {
          await ImageService.create(id, url);
        }
      }

      res.json({
        message: "Cập nhật sản phẩm và ảnh thành công!",
        images: finalImageUrls,
      });
    } catch (err) {
      console.error("Error updating product with images:", err);
      res.status(500).json({
        message: "Lỗi server khi cập nhật sản phẩm",
        error: err.message,
      });
    }
  },
};

module.exports = productController;
