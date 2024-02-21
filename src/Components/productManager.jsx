class ProductManager{

    static #uiltimoId = 1;
    #products

    constructor(){
        this.#products =[];
    }

    addProduct(title, description, price, thumbnail, code, stock){
        const prodAAgregar = this.#products.find(e => e.code === code)

        if((!title || !description  || !price  || !thumbnail  || !code)  && (stock !== null)){
            return console.log("Se encontraron datos vacios, completelos para continuar!")
        }
        if(prodAAgregar){ return console.log("Este codigo ya existe!")}
    
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: this.#getProdId()
        }
        this.#products.push(product)
    
    }
    
    #getProdId(){
        const id= ProductManager.#uiltimoId;
        ProductManager.#uiltimoId ++ ;
        return id
    }
    
    getProducts(){return this.#products}

    getTitle(){return this.#products.map(product => product.title)}

    getProductById(id){
        const idProd = this.#products.find(e => e.id === id);
        if(!idProd){
            console.log("Not Found")
        }else{
            console.log(`Encontrado Titulo : ${this.getTitle()}`)
        }
    }
}

const manager = new ProductManager(); 
manager.addProduct("title","Lorem2", 3000, "asdasd", 123, 2)
manager.addProduct("title2","Lorem3", 4000, "asdasd", 122, 0)
console.log(manager.getProducts())

export default ProductManager