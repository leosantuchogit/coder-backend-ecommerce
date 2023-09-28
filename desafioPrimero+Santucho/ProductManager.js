class ProductManager {
    #error
    #products
    constructor () {
       this.#products = [],
       this.#error 
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {

        // Valido que campos tengas datos 
        if (!this.#validateValues(title, description, price, thumbnail, code, stock)) {
                console.log(this.#error);
                return false
                
        }

        // Valido que ya no exista el code
        if (this.#existCode(code)) {
            console.log(this.#error);
            return false
        }

        const id = this.#getNextId()
        const titleTrim = title.trim()
        const descriptionTrim = description.trim()
        
        const product = {
            id, 
            titleTrim, 
            descriptionTrim, 
            price, 
            thumbnail, 
            code, 
            stock
        }

        this.#products.push(product)

        console.log(`Producto ${id} se agregó correctamente`);
    }

    getProducts = () => {
        return this.#products
    }

    getProductById = (id) => {
        const product = this.#products.find(product => product.id == id) || 'Not found'
        return product
    }

    #getNextId = () => {
        let count = this.#products.length

        return (count === 0) ? 1 : this.#products[count - 1].id + 1 
    }

    #validateValues = (title, description, price, thumbnail, code, stock) => {
        if (!title || title.trim().length === 0) {      
            this.#error = 'El producto debe contener un titulo'
            return false
        }

        if (!description || description.trim().length === 0) {      
            this.#error = 'El producto debe contener una descripcion'
            return false
        }

        if (!price || price <= 0) {      
            this.#error = 'El precio debe contener un valor mayor a 0'
            return false
        }

        if (!thumbnail || thumbnail.trim().length === 0) {      
            this.#error = 'El producto debe contener una url para la imagen'
            return false
        }

        if (!code || code <= 0) {      
            this.#error = 'El codigo del producto debe contener un valor mayor a 0'
            return false
        }

        if (!stock || stock < 0) {      
            this.#error = 'El producto debe contener un valor de stock mayor o igual a 0'
            return false
        }

        return true

    }

    #existCode = (code) => {
        const exist = (this.#products.some(product => product.code === code)) 
        
       if (exist) {
            this.#error = `El code ${code} ya existe para un producto`
            return true
       } 
       
    }
    
   
}


// Test cases

const pm = new ProductManager()

// Agrego producto. Resultado OK
pm.addProduct('Manzana', 'Manzanas rojas de estación', 600, 'image.jpg', 1001, 30)

// Agrego producto con espacios en blancos. Resultado: OK
pm.addProduct('   Pera  ', '  Peras rojas de huerta organica    ', 750, 'imag.jpg', 1002, 10)

// Agrego producto con "Code" repetido: Resultado: NO
 pm.addProduct('Uvas', 'Uvas', 500, 'image.jpg', 1001, 50)

// Agrego productos con valores incorrectos: Resultado: NO 
pm.addProduct('Banana', 'Banana de Brasil', 0, 'image.jpg', 1003, 50)
pm.addProduct('Banana', 'Banana de Ecuador', 500, 'image.jpg', 1004, -1)
pm.addProduct('', 'Zanahorias organicas', 500, 'image.jpg', 1005, -1)

// Listar productos
console.log(pm.getProducts());


// Buscar productos: Resultado OK (deberia traer el producto Pera)
console.log(pm.getProductById(2))

// Buscar productos: not found
console.log(pm.getProductById(99));
