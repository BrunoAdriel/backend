

class ProductManager {
    
    #inicioId = 1
    #products
    #title
    #description
    #price
    #thumbnail
    #code
    #stock

        constructor(){
            
            this.#products = []
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
        }
        
        #getProdId(){
            const id = this.#inicioId
            this.#inicioId += 1
            return id
            }
        
        getProducts(){return this.#products}
        
        getTitle(){return this.#title}

        getDescription(){return this.#description}

        getPrice(){return this.#price}

        getThumnail(){return this.#thumbnail}

        getCode(){return this.#code}

        getStock(){return this.#stock}

        getProductById(num){
            const identiId = this.#products.find(e => e.id === num )
        }
        
        addProduct(CampCode){
            const prodAAgregar = this.#products.find(e => e.code === CampCode)
            const campoVacio = this.#products.some(prod => {
                // compruba que ninguno de los campos este vacio
                return Object.values(prod).some(value => value===null || value === undefined || value === "" ) 
            })
        
            if(prodAAgregar){ 
            console.log("el codigo del producto ya se encunetra registrado") 
            return }
            
            if(campoVacio){
                this.#products.forEach((el) => el.value = null )
            console.log("Un campo se encuentra vacio!")
            }
        
            console.log("Se agrego el producto!!")
        }

}


export default ProductManager