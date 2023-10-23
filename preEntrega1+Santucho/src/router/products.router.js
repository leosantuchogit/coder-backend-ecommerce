import { Router } from 'express'
import ProductManager from '../managers/productManager.js'

const router = Router()
const products = []

router.use(function(req, res, next) {
    console.log('Router: products');
    next()
})

// Endpoint: obtener productos by limit
router.get('/', async (req, res) => {

    try {

        const productManager = new ProductManager('./src/data/myDBProducts.json')
        const limit = req.query?.limit 
        const products = await productManager.getProducts()
    
        if (!products) {
            return res.status(404).json({ error: 'Products not found' })
        }

        res.json((!limit) ? products: products.slice(0, limit))
        
    } catch (error) {
        res.status(500).json({error: 'Error to get products'})
    }

}) 

// Endpoint: obtener prodcuto by id
router.get('/:pid', async (req, res) => {

    try {

        const productManager = new ProductManager('./src/data/myDBProducts.json')
        const productId = parseInt(req.params.pid)
        const products = await productManager.getProductsById(productId)

        if (!products) {
            return res.status(404).json({ error: 'Product not found' })
        }
    
        res.json(products)
        
    } catch (error) {
        res.status(500).json({error: 'Error to get the product'})
    }
   

})

// Endpoint: agregar un producto
router.post('/', async(req, res) => {
    
    try {
        const productManager = new ProductManager('./src/data/myDBProducts.json')
        const newProduct = req.body

        // Validaciones
        if (await productManager.validateProduct(newProduct)) {
            return res.status(500).json({ error: 'Some of the field is null' })
        }

        if (await productManager.existCodeOnAdd(newProduct.code)) {
            return res.status(500).json({ error: `The code ${newProduct.code} exist to the other` })
        }

        // Si esta todo OK, avanzo con el alta
        const product = await productManager.addProduct (
            newProduct.title, 
            newProduct.description, 
            newProduct.price, 
            newProduct.thumbnail, 
            newProduct.code, 
            newProduct.stock, 
            newProduct.status,
            newProduct.category
        )

        if (!product) {
            return res.status(500).json({ error: 'Product not found' })
        }
    
        res.json(product)
        
    } catch (error) {
        res.status(500).json({error: 'Error to add the product'})
    }


})

// Endpoint: actualizar un producto
router.put('/:pid', async(req, res) => {
    
    try {
        const productManager = new ProductManager('./src/data/myDBProducts.json')
        const productId = parseInt(req.params.pid)
        const updateProduct = req.body


        // Validaciones
        if (await productManager.validateProduct(updateProduct)) {
            return res.status(500).json({ error: 'Some of the field is null' })
        }

        if (await productManager.existCodeOnUpdate(updateProduct.code, productId)) {
            return res.status(500).json({ error: `The code ${req.body.code} exist to the other` })
        }

        const product = await productManager.updateProduct (
            productId,
            updateProduct.title, 
            updateProduct.description, 
            updateProduct.price, 
            updateProduct.thumbnail, 
            updateProduct.code, 
            updateProduct.stock, 
            updateProduct.category
        )

          // Ver como manejo los errores
          if (!product) {
            return res.status(500).json({ error: 'Product not found' })
        }
    
        res.json(product)
        
    } catch (error) {
        res.status(500).json({error: 'Error to get the product'})
    }


})

// Endpoint: eliminar un producto
router.delete('/:pid', async(req, res) => {
    
    try {
        const productManager = new ProductManager('./src/data/myDBProducts.json')
        const productId = parseInt(req.params.pid)
        const product = await productManager.deleteProduct (
            productId
        )

        if (!product) {
            return res.status(500).json({ error: 'Error to delete the product'})
        }
    
        res.status(200).json({OK: `The product ${ productId } was deleted succesfull`})
        
    } catch (error) {
        res.status(200).json({error: 'Error to delete the product'})
    }


})

export default router