const { Router } = require('express');
const fs = require('fs');

const router = Router();

router.post('/', async (req, res) => {
  try {
    // Leer el archivo FileProducts.json para obtener todos los productos disponibles
    const data = await fs.promises.readFile(__dirname + '/../FileProducts.json', 'utf-8');
    const products = JSON.parse(data);

    // Obtener el ID del producto y la cantidad deseada del cuerpo de la solicitud POST
    const { productId, quantity } = req.body;

    // Verificar si el producto con el ID especificado está disponible
    const product = products.find(product => product.id === productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Leer el archivo carrito.json para obtener el carrito actual
    let carrito = [];
    try {
      const carritoData = await fs.promises.readFile(__dirname + '/carrito.json', 'utf-8');
      carrito = JSON.parse(carritoData);
    } catch (error) {
      console.error('No se pudo leer el archivo carrito.json:', error);
    }

// Agregar el producto al carrito con la cantidad especificada
let carritoProd;
if (!Array.isArray(carrito.products)) {
  // Si carrito.products no es un array, inicialízalo como un array vacío
  carritoProd = {
    id: 1,
    products: []
  };
} else {
  // Si carrito.products es un array válido, úsalo normalmente
  carritoProd = {
    id: 1,
    products: [...carrito.products, nuevoProducto]
  };
}

    // Escribir el carrito actualizado de vuelta al archivo carrito.json
    await fs.promises.writeFile(__dirname + '/../carrito.json', JSON.stringify(carritoProd, null, 2));

    // Responder con el carrito actualizado
    res.json({ status: 'success', carrito: carritoProd });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

module.exports = router;
