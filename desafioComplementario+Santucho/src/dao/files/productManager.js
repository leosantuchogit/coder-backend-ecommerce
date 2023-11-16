import fs, { stat } from 'fs'

export default class ProductManager {
    #format
    constructor(path) {
        this.path = path
        this.#format = 'utf-8'
    }

    getProducts = async () => {
        try {


            console.log(this.path);
            
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
            
            return products.find(product => product.id == id) //|| 'Not found'

        } catch (error) {
            console.log(error);
            return []
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock, category) => {
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
                stock, 
                status: true, // default value
                category
            }


            // Validaciones
            // if (await this.validateProduct(newProduct)) return 'Some of the field is null'
            // if (await this.existCode(code)) return `The code ${code} exist to the other product`

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
                await fs.promises.writeFile(this.path, JSON.stringify(productsFilter, null, "\t"))
    
                return true
                
            } else {

                return false 

            }

          

        } catch (error) {
            console.log(error);
        }
    }

    updateProduct = async (id, title, description, price, thumbnail, code, stock, status, category) => {
        try {

            const products = await this.getProducts()
            const updateProduct = {
                id, 
                title, 
                description, 
                price, 
                thumbnail, 
                code, 
                stock, 
                status, 
                category
            }



            // Todo bien, actualizo
            const productsUpdated = products.map(product => product.id === id ? { ...product, 
                id: id, 
                title: title, 
                description: description, 
                price: price, 
                thumbnail: thumbnail, 
                code: code, 
                stock: stock, 
                status: status, 
                category: category
            } : product)


            await fs.promises.writeFile(this.path, JSON.stringify(productsUpdated, null, "\t"));


            console.log(`El producto ${id} ha actualizado correctamente`);
            return updateProduct
         
        } catch (error) {
            console.log(error);
        }
    }

    validateProduct = async (validarproduct) => {

        // Creo una copia del objeto para la eliminar las propery que no se validan
        const objectToValidate = Object.assign({}, validarproduct);
        delete objectToValidate.thumbnail 

        const values = Object.values(objectToValidate)

        return (values.some(item => item === null)) 
    }

    existCodeOnAdd = async (code) => {

        const products = await this.getProducts()

        
        return (products.some(product => product.code === code))
       
    }

    existCodeOnUpdate = async (code, id) => {
        const products = await this.getProducts()
        const productsFilter = products.filter(product => product.id !== id)

        console.log('Products:', products);
        console.log('ProductsFilter:', productsFilter);
        
        return (productsFilter.some(p => p.code === code))
       
    }

}
