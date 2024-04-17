const { Router } = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');  //utilizo la biblioteca "uuid" para poder generar el id
// const ProductManager = require('../../public/js/productManager');
const Products = require('../models/products.model');

// Products.products.find({}).then(docs => {
//     console.log('Productos encontrados:', docs);
// }).catch(err => {
//     console.error('Error al buscar productos:', err);
// });
const router = Router();

// const manager = new ProductManager(`${__dirname}/../FileProducts.json`)

// filtrar por cantidad de productos pasados por query
router.get('/', async (req, res) => {
    try {
        const prodFilter = req.query.prodFilter;
        let products;

        // Obtener todos los productos de la base de datos
        if (prodFilter) {
            const numberParse = parseInt(prodFilter, 10);
            if (numberParse <= 0 || isNaN(numberParse) || !prodFilter) {
                res.status(404).json({ message: 'Error el filtro de numero debe ser un numero mayor a 0 ' });
                return;
            } else {
                // Limitar la cantidad de productos devueltos según el filtro
                products = await Products.find({}).limit(numberParse);
            }
        } else {
            // Obtener todos los productos sin límite
            products = await Products.products.find({});
        }

        res.json(products);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta POST para agregar un producto al carrito
router.post('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const productToAdd = await Products.products.findOne({ id: pid });

        if (!productToAdd) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        let carrito;
        try {
            // Lee el carrito existente
            const carritoData = await fs.readFile(__dirname + '/../carrito.json', 'utf-8');
            carrito = JSON.parse(carritoData);
        } catch (error) {
            console.error('No se pudo leer el archivo carrito.json o no existe, creando uno nuevo.', error);
            // Si hay un error al leer el archivo, inicializa el carrito como un objeto vacío
            carrito = { id: 1, products: [] };
        }

        // Verificar si el carrito ya tiene productos
        if (!Array.isArray(carrito.products)) {
            // Si carrito.products no es un array, inicialízalo como un array vacío
            carrito.products = [];
        }

        // Verifica si el producto ya existe en el carrito
        const existingProductIndex = carrito.products.findIndex(product => product.id === pid);

        if (existingProductIndex !== -1) {
            // Si el producto ya existe, actualizar la cantidad
            carrito.products[existingProductIndex].quantity += 1;
        } else {
            carrito.products.push({
                id: productToAdd.id,
                title: productToAdd.title,
                description: productToAdd.description,
                price: productToAdd.price,
                thumbnail: productToAdd.thumbnail,
                code: productToAdd.code,
                stock: productToAdd.stock,
                quantity: 1
            });
        }

        await fs.writeFile(__dirname + '/../carrito.json', JSON.stringify(carrito, null, 2));

        // Responder con el carrito actualizado
        res.json({ status: 'success', carrito });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});



//Ruta GET x ID
router.get('/:cid', async (req,res)=>{
    const cid = parseInt(req.params.cid);
    const carritoData = await fs.promises.readFile(__dirname + '/../carrito.json', 'utf-8');
    const carrito = JSON.parse(carritoData);
    
    const prodFound = carrito.products.find(p=>p.id === cid)

    if(!prodFound){
        res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }else{
        res.json(prodFound)
    }
})


// Ruta POST para agregar mas de un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const carritoData = await fs.promises.readFile(__dirname + '/../carrito.json', 'utf-8');
        const carrito = JSON.parse(carritoData);
        if (carrito.id !== parseInt(cid)) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        // Convertir el `pid` a un tipo compatible con el `id` del carrito
        const productId = parseInt(pid);
        // Verificar si el producto ya está en el carrito
        const productIndex = carrito.products.findIndex(prod => prod.id === productId);

        if (productIndex !== -1) {
            carrito.products[productIndex].quantity += 1;
        } else {
            // Si el producto no está en el carrito, buscar el producto en la lista de productos
            const productsData = await fs.promises.readFile(`${__dirname}/../FileProducts.json`, 'utf-8');
            const products = JSON.parse(productsData);
            const productToAdd = products.find(product => product.id === productId);
            
            // Verificar si se encontró el producto
            if (!productToAdd) {
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
            }
            
            // Agregar el producto al arreglo de productos del carrito con cantidad 1
            carrito.products.push({ 
                id: productId, 
                title: productToAdd.title,
                description: productToAdd.description,
                price: productToAdd.price,
                quantity: 1 
            });
        }
        await fs.promises.writeFile(__dirname + '/../carrito.json', JSON.stringify(carrito, null, 2));
        res.json({ status: 'success', carrito });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Eliminar bucando en el carrito y por ID
router.delete('/:cid/product/:pid', async(req, res) => {
    try {
        const { cid, pid } = req.params;
        const carritoData = await fs.promises.readFile(`${__dirname}/../carrito.json`, 'utf-8');
        const carrito = JSON.parse(carritoData);
        if (carrito.id !== parseInt(cid)) {
            return res.status(404).json({ message: 'El carrito no fue encontrado' });
        }
        const index = carrito.products.findIndex(product => product.id === parseInt(pid));
        if (index === -1) {
            return res.status(404).json({ message: 'El producto no existe en el carrito' });
        }
        carrito.products.splice(index, 1);
        await fs.promises.writeFile(`${__dirname}/../carrito.json`, JSON.stringify(carrito, null, 2), 'utf-8');
        return res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// eliminar todos los productos de carrito
router.delete('/:cid', async (req,res)=>{
    try{const cid = parseInt(req.params.cid)
    const carritoData = await fs.promises.readFile(__dirname + '/../carrito.json', 'utf-8');
    const carrito = JSON.parse(carritoData);
    if (carrito.id !== parseInt(cid)) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }else{
        carrito.products =[];
        await fs.promises.writeFile(`${__dirname}/../carrito.json`, JSON.stringify(carrito, null, 2), 'utf-8');
        return res.status(200).json({ message: 'Productos eliminados del carrito' });
    }}catch (error) {
        console.error('Error al eliminar Todos los productos del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

// Cambiar la quantity del producto
router.put('/:cid/product/:pid', async(req,res)=>{
    try{
        quantity = parseInt(req.query.quantity)
        const { cid, pid } = req.params;
        const carritoData = await fs.promises.readFile(`${__dirname}/../carrito.json`, 'utf-8');
        const carrito = JSON.parse(carritoData);
        if (carrito.id !== parseInt(cid)) {
            return res.status(404).json({ message: 'El carrito no fue encontrado' });
        }const index = carrito.products.findIndex(product => product.id === parseInt(pid));
        if (index === -1) {
            return res.status(404).json({ message: 'El producto no existe en el carrito' });
        }
        if (quantity <= 0) {
            return res.status(400).json({ message: 'La cantidad debe ser mayor que cero' });
        }
            // Obtener el producto correspondiente al ID
            const productData = await fs.promises.readFile(`${__dirname}/../FileProducts.json`, 'utf-8');
            const products = JSON.parse(productData);
            const product = products.find(product => product.id === parseInt(pid));
            // Verificar si el producto existe
            if (!product) {
                return res.status(404).json({ message: 'El producto no existe' });
            }
        if (quantity > product.stock) {
            return res.status(400).json({ message: 'La cantidad supera el stock del producto' });
        }
        // Actualizar la cantidad del producto en el carrito
        carrito.products[index].quantity = quantity;

        await fs.promises.writeFile(`${__dirname}/../carrito.json`, JSON.stringify(carrito, null, 2));
        res.json({ status: 'success', carrito });
    }catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

module.exports = router;
