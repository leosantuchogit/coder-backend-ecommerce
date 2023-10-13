import Express from 'express'
import ProductManager from './ProductManager.js'

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({extended: true}))

// Endpoint: obtener productos by limit
app.get('/api/products', async (req, res) => {

    try {

        const productManager = new ProductManager('./myDBProducts.json')
        const limit = req.query?.limit 
        const products = await productManager.getProducts()

        console.log('limit es', (limit));
    
        if (!products) {
            return res.status(404).json({ error: 'Products not found' })
        }
    


        res.json((!limit) ? products: products.slice(0, limit))
        
    } catch (error) {
        res.status(500).json({error: 'Error to get products'})
    }
   

})

// Endpoint: obtener prodcuto by id
app.get('/api/products/:pid', async (req, res) => {

    try {

        const productManager = new ProductManager('./myDBProducts.json')
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

app.listen(8080, () => {console.log('Server Express listening on port 8080...');})