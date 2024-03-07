const fs = require('fs')
const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: true }))

app.get('/saludo',(req, res)=> {
  res.end('hola mundo desde express')
})

app.get('/products', async (req, res) => {
    // Lee el archivo y convierte el contenido de JSON a un objeto JavaScript
    const data = await fs.promises.readFile(__dirname + '/FileProducts.json', 'utf-8');
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
  const data = await fs.promises.readFile(__dirname + '/FileProducts.json', 'utf-8');
  const products = JSON.parse(data);
  
  const productFound = products.find(p => p.id === pId);

    if (!productFound) {
      res.send({status: 'ERROR', message: 'Producto no encontrado'});
    } else {
      res.json(productFound);
    }
});




app.listen(8080, () =>{
  console.log('servidor listo!')
})
