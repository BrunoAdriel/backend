const fs = require('fs')
const express = require('express')
const handlebars = require('express-handlebars')
const prodCarro = require('./routes/prod.router')
const viewRouter = require('./routes/views.router')
const usersRouter = require('./routes/users.router')
// const { Server } = require('socket.io')
// app.use('/realTimeProducts', realTimeProducts)
// const homeRouter = require('./routes/home.router')

const app = express()

// Configuracion de HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

// setea la carpeta public como estatica
app.use(express.static(`${__dirname}/../../public`))

// Permitir el envio de informacion mediante Formularios y JSON 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Mostrar la pantalla de inicio
app.use('/', viewRouter)

// Mostrar el apartado de Register
app.use('/api/users', usersRouter)

// ---
// app.use('/register', viewRouter )

// Coneccion a "HOME"
// app.use('/home', homeRouter)

// Coneccion a "RealTimeProducts"
// app.use('/realTimeProducts', realTimeProducts)

// Coneccion WebSocket
// const wsServer = new Server(httpServer)

// app.set('ws', wsServer)

// envio de datos de prodCarro a el path
app.use('/api/carts', prodCarro)

app.get('/saludo',(req, res)=> {
    res.end('hola mundo desde express')
})

app.get('/products', async (req, res) => {
    // Lee el archivo y convierte el contenido de JSON a un objeto JavaScript
    const data = await fs.promises.readFile(__dirname + '/../../Backend/src/FileProducts.json', 'utf-8');
    let products = JSON.parse(data);
    
    // Si 'limit' es un número, limita la cantidad de productos devueltos
    const limit = parseInt(req.query.limit); 
    if (!isNaN(limit)) {
        products = products.slice(0, limit);
    }

    res.json(products);

});

app.get('/products/:pId', async (req, res) => {
    const pId = parseInt(req.params.pId);
    const data = await fs.promises.readFile(__dirname + '/../../Backend/src/FileProducts.json', 'utf-8');
    const products = JSON.parse(data);

    const productFound = products.find(p => p.id === pId);

    if (!productFound) {
        res.send({status: 'ERROR', message: 'Producto no encontrado'});
    } else {
        res.json(productFound);
    }
});

app.post('/products', async (req, res)=>{
  // chekea que los campos esten completos, sino devuelve el error400
const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
for (const field of requiredFields) {
    if (!req.body[field]) {
        return res.status(400).json({ status: 'error', message: `El campo '${field}' es obligatorio` });
    }
}

const data = await fs.promises.readFile(__dirname + '/../../Backend/src/FileProducts.json', 'utf-8');
const products = JSON.parse(data);

const newProd = req.body;

  // Asigna un nuevo ID al producto
const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
newProd.id = newId;
products.push(newProd);

  // Guarda el array actualizado de vuelta en el archivo
    await fs.promises.writeFile(__dirname + '/../../Backend/src/FileProducts.json', JSON.stringify(products, null, 2));

    res.json({ status: 'success', product: newProd });
})

app.put('/products/:pid', async (req, res)=>{
    const data = await fs.promises.readFile(__dirname + '/../../Backend/src/FileProducts.json', 'utf-8');
    let products = JSON.parse(data);
    const prodId = parseInt(req.params.pid);
    const prodData = req.body;
    delete prodData.id;

    const prodIdx = products.findIndex(product => product.id === prodId);

    if (prodIdx < 0 ) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

  // Actualiza los datos del producto y aseguramos del id sea el mismo 
    products[prodIdx] = { ...products[prodIdx], ...prodData, id:prodId };

    await fs.promises.writeFile(__dirname + '/../../Backend/src/FileProducts.json', JSON.stringify(products, null, 2));

    res.json({ status: 'success', product: products[prodIdx] });
})

app.delete('/products/:prodId', async (req, res)=>{
    const data = await fs.promises.readFile(__dirname + '/../../Backend/src/FileProducts.json', 'utf-8');
    let products = JSON.parse(data);
    const prodId = parseInt(req.params.prodId);
    const prodIdx = products.findIndex(product => product.id === prodId);

    if (prodIdx < 0) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

  // Elimina el producto con la cantidad que ponga despues de la "," en esa posicion
    products.splice(prodIdx, 1);

    await fs.promises.writeFile(__dirname + '/../../Backend/src/FileProducts.json', JSON.stringify(products, null, 2));

    res.json({ status: 'success', message: 'Producto eliminado correctamente' })
})




app.listen(8080, () =>{
    console.log('servidor listo!')
})