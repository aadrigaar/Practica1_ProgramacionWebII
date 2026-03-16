const ProductService = require('../services/productService');

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.query.name);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  async createProduct(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      
      const { nombre, precio, imagenUrl, imagen: imagenBody } = req.body;
      let imagen = req.file ? req.file.filename : null;
      if (!imagen && imagenUrl) imagen = imagenUrl;
      if (!imagen && imagenBody) imagen = imagenBody;
      
      const product = await ProductService.createProduct({ nombre, precio, imagen });
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear producto' });
    }
  }

  async updateProduct(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      const data = { ...req.body };
      if (data.imagenUrl && !data.imagen) data.imagen = data.imagenUrl;
      delete data.imagenUrl;
      const product = await ProductService.updateProduct(req.params.id, data);
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }

  async deleteProduct(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      await ProductService.deleteProduct(req.params.id);
      res.json({ message: 'Producto eliminado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
}

module.exports = new ProductController();
