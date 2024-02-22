const fs = require('fs');
const path = require('path');

const fileProds = path.resolve(__dirname, './FileProducts.json');

class ProductManager {
    static #ultimoId = 1;
    #products;

    constructor() {
        this.#products = [];
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || stock === null) {
            return console.log("Se encontraron datos vacíos, complételos para continuar!");        }

        if (this.#products.some(product => product.code === code)) {
            return console.log("Este código ya existe!");
        }

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: this.#getProdId()
        };

        this.#products.push(product);

        try {
            await fs.promises.writeFile(fileProds, JSON.stringify(this.#products, null, '\t'));
        } catch (err) {
            console.log("Error al guardar el documento:", err);
        }
    }

    async readFile() {
        try{
            const prodFileContent = await fs.promises.readFile(fileProds, 'utf-8')
            return JSON.parse(prodFileContent)
        } catch (err){
            return []
        }
    }

    #getProdId() {
        const id = ProductManager.#ultimoId;
        ProductManager.#ultimoId++;
        return id;
    }

    getProducts() {
        return this.#products;
    }

    getProductById(id) {
        const product = this.#products.find(prod => prod.id === id);
        if (!product) {
            return "Product not found";
        }
        return product;
    }
}

const main = async() => {
    try{
        const p = new ProductManager();
        console.log(await p.readFile());
        
        await p.addProduct("Title", "Description", 100, "thumbnail", 123, 10);
        console.log(await p.readFile()); // Reading after adding the product
    }catch(err){
        console.error(err);
    }
}

main()

// try{
//     const p = new ProductManager();
//     console.log( await p.readFile())
    
//     await p.addProduct("Title", "Description", 100, "thumbnail", 123, 10);
// }catch{

// }

// const product = new ProductManager();
// await product.addProduct("Title", "Description", 100, "thumbnail", 123, 10);
// await product.readFile()

export default ProductManager;
