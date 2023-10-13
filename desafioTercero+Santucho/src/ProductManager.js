import fs from 'fs'

export default class ProductManager {
    #format
    constructor(path) {
        this.path = path
        this.#format = 'utf-8'
    }

    getProducts = async () => {
        try {
            const products = await fs.promises.readFile(this.path, this.#format)
            
            if (products.length > 0)  return JSON.parse(products)
            
            return []

        } catch (error) {
            console.log(error);
            return []
        }
    }

    getProductsById = async (id) => {
        try {
            const products = await this.getProducts()
            
            return products.find(product => product.id == id) || 'Not found'

        } catch (error) {
            console.log(error);
            return []
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        try {

            const products = await this.getProducts()
            const id = (products.length  === 0) ? 1 : products[products.length - 1].id + 1  // autoincremental
            const newProduct = {
                id,
                title, 
                description,
                price, 
                thumbnail, 
                code, 
                stock 
            }


            // Validaciones
            if (await this.#validateProduct(newProduct)) return console.log('Algunos de los campos es null');
            if (await this.#existCode(code)) return console.log(`El code ${code} ya existe para un producto`);

            products.push(newProduct)

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
           
            return newProduct

            
        } catch (error) {
            console.log(error);
        }
    }

    deleteProduct = async (id) => {
        try {


            const products = await this.getProducts()
            
            if (products.some(product => product.id == id)) {
                const productsFilter = products.filter(product => product.id !== id)
            
          
                // el arrays de productos ahora ya no tiene el item borrado
                await fs.promises.writeFile(this.path, JSON.stringify(productsFilter))
    
                console.log(`El producto ${id} ha sido eliminado`);
                return true
                
            } else {
                console.log(`El producto ${id} no se han encontrado`);
                return false 

            }

          

        } catch (error) {
            console.log(error);
        }
    }

    updateProduct = async (id, title, description, price, thumbnail, code, stock) => {
        try {

            const products = await this.getProducts()
            const updateProduct = {
                id, 
                title, 
                description, 
                price, 
                thumbnail, 
                code, 
                stock
            }


            // Validaciones
            if (!this.#existProduct) return console.log(`El producto ${id} a actualizar no existe`);
            if (await this.#validateProduct(updateProduct)) return console.log('Algunos de los campos es null');
            if (await this.#existCode(code)) return console.log(`El code ${code} ya existe para un producto`);


            // Todo bien, actualizo
            const productsUpdated = products.map(product => product.id === id ? { ...product, 
                id: id, 
                title: title, 
                description: description, 
                price: price, 
                thumbnail: thumbnail, 
                code: code, 
                stock: stock
            } : product)


            await fs.promises.writeFile(this.path, JSON.stringify(productsUpdated, null, "\t"));


            console.log(`El producto ${id} ha actualizado correctamente`);
            return updateProduct
         
        } catch (error) {
            console.log(error);
        }
    }

    #validateProduct = async (product) => {
        const values = Object.values(product)

        return (values.some(item => item === null)) 

    }

    #existProduct = async (products, IdUpdateProduct) => {
        return (products.some(product => product.id === IdUpdateProduct))
    }

    #existCode = async (code) => {

        const products = await this.getProducts()

        
        return (products.some(product => product.code === code))
       
    }

}
