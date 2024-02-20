class ProductManager {
    
    
    #inicioId = 1
    #products = []

    constructor(title, description, price, thumbnail, code, stock){
        this.propiedadesProducts(title, description, price, thumbnail, code, stock);
    }

    propiedadesProducts(title, description, price, thumbnail, code, stock){
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
        console.log(product)
    }
    
    #getProdId(){
        const id = this.#inicioId
        this.#inicioId += 1
        return id
    }
    
    getProducts(){return this.#products.map(product => JSON.stringify(product))}

    getTitle(){return this.#products.map(product => product.title)}

    getDescription(){return this.#products.map(product => product.description)}

    getPrice(){return this.#products.map(product => product.price)}

    getThumnail(){return this.#products.map(product => product.thumbnail)}

    getCode(){return this.#products.map(product => product.code)}

    getStock(){return this.#products.map(product => product.stock)}

    getProductById(id){
        const idProd = this.#products.find(e => e.id === id);
        if(!idProd){
            console.log("Not Found")
        }else{
            console.log(`Encontrado Titulo : ${this.getTitle()}`)
        }
    }
    
    addProduct(CampCode){
        const prodAAgregar = this.#products.find(e => e.code === CampCode)
        const campoVacio = this.#products.some(prod => {
            // comprueba que ninguno de los campos esté vacío
            return Object.values(prod).some(value => value === null || value === undefined || value === "")
        })
    
        if(prodAAgregar){ 
            console.log("El código del producto ya se encuentra registrado") 
            return 
        }
        
        if(campoVacio){
            this.#products.forEach((el) => el.value = null )
            console.log("Un campo se encuentra vacío!")
            return;
        }
    
        console.log("Se agregó el producto!!");
    }
    
}

const p = new ProductManager("title","Lorem2", 3000, "asdasd", 123, 2)
// const p2 = new ProductManager("title2","Lorem2", 300,"asdd",123, 1)
console.log(`producto: ${p.getProducts()}`)
// console.log(`se guardo ${p.addProduct()}`)
// console.log(`se guardo ${p2.addProduct()}`)

export default ProductManager
