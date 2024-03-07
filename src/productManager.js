const fs = require('fs');

const fileProds = './FileProducts.json';

class ProductManager {
    static #ultimoId = 1;
    #products;

    async initialize(){
        this.#products = await this.readFile();
        if (this.#products.length > 0) {
            ProductManager.#ultimoId = Math.max(...this.#products.map(p => p.id)) + 1;
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || stock === null) {
            return console.log("Se encontraron datos vacíos, complételos para continuar!");        
        }

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
            await this.#updateFile()
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

    async updateProduct(updateProd){
        let prodFoundIdx = this.#products.findIndex(prod => prod.id === updateProd.id);
            if(updateProd < 0){
                throw  "Product not found";
            } // se pregunta si es mayor a 0 poruqe el "findIdx" devuelve un -1 en caso de que sea negativo
        
        const prodData = { ...this.#products[prodFoundIdx], ...updateProd }
        this.#products[prodFoundIdx] = prodData;
        await this.#updateFile()
    }


    async #updateFile() {
        await fs.promises.writeFile(fileProds, JSON.stringify(this.#products, null, '\t'));
    }
}


module.exports = ProductManager;

const main = async() => {
    try{
        const p = new ProductManager();
        await p.initialize() // carga los usuarios de file

        console.log(await p.readFile());
        
        await p.addProduct("Title", "Description", 100, "thumbnail", 111, 10);
        await p.addProduct("Title2", "Description2", 200, "thumbnail", 222, 10);
        await p.addProduct("Title3", "Description3", 300, "thumbnail", 333, 10);
        await p.addProduct("Title4", "Description4", 400, "thumbnail", 444, 10);
        await p.addProduct("Title5", "Description5", 500, "thumbnail", 555, 10);
        
        
        
        console.log(await p.readFile());
    }catch(err){
        console.error(err);
    }
}

main();
