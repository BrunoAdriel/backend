const { Router } = require('express');
const fs = require('fs');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const data = await fs.promises.readFile(__dirname + '/../FileProducts.json', 'utf-8');
    const products = JSON.parse(data);
    const { productId, quantity } = req.body;

    const product = products.find(product => product.id === productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    let carrito;

    try {
      const carritoData = await fs.promises.readFile(__dirname + '/carrito.json', 'utf-8');
      carrito = JSON.parse(carritoData);
    } catch (error) {
      console.error('No se pudo leer el archivo carrito.json o no existe, creando uno nuevo.', error);
      carrito = {
        id: Math.floor(Math.random() * 10000),
        products: []
      };
    }

    const nuevoProducto = {
      ...product,
      quantity: quantity
    };

    if (Array.isArray(carrito.products)) {
      carrito.products.push(nuevoProducto);
    } else {
      carrito.products = [nuevoProducto];
    }

    await fs.promises.writeFile(__dirname + '/carrito.json', JSON.stringify(carrito, null, 2));
    res.json({ status: 'success', carrito: carrito });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});


module.exports = router;
