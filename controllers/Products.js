import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

export const getProduct = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await ProductModel.findAll({
        attributes: ["uuid", "name", "price"],
        include: [{ model: UserModel, attributes: ["name", "email"] }],
      });
    } else {
      response = await ProductModel.findAll({
        attributes: ["uuid", "name", "price"],
        where: {
          userId: req.userId,
        },
        include: [{ model: UserModel, attributes: ["name", "email"] }],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = (req, res) => {
  // Implementasi fungsi ini untuk mengambil satu produk berdasarkan ID
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await ProductModel.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Product Created Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = (req, res) => {
  // Implementasi fungsi ini untuk mengupdate produk yang ada di database
};

export const deleteProduct = (req, res) => {
  // Implementasi fungsi ini untuk menghapus produk dari database
};
