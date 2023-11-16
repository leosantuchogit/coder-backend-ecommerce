import { Router } from 'express'
import CartManager from '../managers/cartManager.js'
import ProductManager from '../managers/productManager.js'

const router = Router()

router.use(function(req, res, next) {
    console.log('Router: carts');
    next()
})

// Endpoint: obtener los productos de un carrito
router.get('/:cid', async (req, res) => {

    try {

        const cartManager = new CartManager('./src/data/myDBCart.json')
        const cartId = parseInt(req.params.cid)
        const products = await cartManager.getCartsById(cartId)

        if (!products) {
            return res.status(404).json({ error: 'Cart not found' })
        }
    
        res.json(products)
        
    } catch (error) {
        res.status(500).json({error: 'Error to get the product of the cart'})
    }
})

// Endpoint: agregar un nuevo carrito
router.post('/', async(req, res) => {
    
    try {
        const cartManager = new CartManager('./src/data/myDBCart.json')

        // Si esta todo OK, avanzo con el alta
        const cart = await cartManager.createCart()

        if (!cart) {
            return res.status(404).json({ error: 'Cart was not create' })
        }
    
        res.json(cart)
        
    } catch (error) {
        res.status(500).json({error: 'Error to create cart'})
    }


})

// Endpoint: agregar un producto al carrito
router.post('/:cid/product/:pid', async(req, res) => {
    
    try {

        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        const cartManager = new CartManager('./src/data/myDBCart.json')
        const productManager = new ProductManager('./src/data/myDBProducts.json')

        // Validaciones 
        if (!await cartManager.getCartsById(cartId)) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        if (!await productManager.getProductsById(productId)) {
            return res.status(404).json({ error: 'Product not found' })
        }

        // OK avanzo
        const cart = await cartManager.addProductToCart(cartId, productId)

        if (!cart) {
            return res.status(404).json({ error: 'Product was not add to cart' })
        }
    
        res.status(200).json(cart)
        
    } catch (error) {
        res.status(500).json({error: 'Error to add product to cart'})
    }


})


export default router