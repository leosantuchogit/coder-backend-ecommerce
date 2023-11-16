import ProductManager from '../managers/productManager.js'
import Express from "express";

const router = Express.Router()

// Render: product list
router.get('/', async (req, res) => {
    try {

        const productManager = new ProductManager('./src/data/myDBProducts.json')
        const products = await productManager.getProducts()
    
        if (!products) {
            return res.status(404).json({ error: 'Products not found' })
        }

        res.render('home', { products })
        
    } catch (error) {
        res.status(500).json({error: 'Error to get products'})
    }

})

// Render: real time products 
router.get('/realTimeProducts', async (req, res) => {
    try {

        const productManager = new ProductManager('./src/data/myDBProducts.json')
        const products = await productManager.getProducts()
    
        if (!products) {
            return res.status(404).json({ error: 'Products not found' })
        }

        res.render('realTimeProducts', { products })
        
    } catch (error) {
        res.status(500).json({error: 'Error to get products'})
    }

})

export default router