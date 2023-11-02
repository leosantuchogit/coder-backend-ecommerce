import fs, { stat } from 'fs'

export default class CartManager {
    #format
    constructor(path) {
        this.path = path
        this.#format = 'utf-8'
    }

    getCarts = async () => {
        try {

            
            const carts = await fs.promises.readFile(this.path, this.#format)
            
            if (carts.length > 0)  return JSON.parse(carts)
            
            return []

        } catch (error) {
            console.log(error);
            return []
        }
    }

    getCartsById = async (cartId) => {
        try {
            const carts = await this.getCarts()
        
            return carts.find(cart => cart.id == cartId) 

        } catch (error) {
            console.log(error);
            return []
        }
    }

    createCart = async () => {
        try {

            const carts = await this.getCarts()
            const id = (carts.length  === 0) ? 1 : carts[carts.length - 1].id + 1  // autoincremental
            const newCart = {
                id,
                products:[]
            }

            carts.push(newCart)

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
           
            return newCart

            
        } catch (error) {
            console.log(error);
        }
    }

    addProductToCart = async (cartId, productId) => {
        try {

            const carts = await this.getCarts() // obentgo todos los carts
            const cart = await this.getCartsById(cartId) // obtengo el carrito by id
            const product = cart.products.find(product => product.productId === productId) // busco el producto en carrito
            
    

            if (!product) {
                // No exist el producto, lo agrego
                cart.products.push({ productId: productId, quantity: 1 })
    
            } else {

                // El producto existe, le agrego cantidad
                product.quantity++
            }

     
            // Busco el cart y los actulizo
            const cartIndex = carts.findIndex(cart => cart.id === cartId)
     
            carts[cartIndex] = cart
            
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

            return cart

            
        } catch (error) {
            console.log(error);
        }
    }

}
