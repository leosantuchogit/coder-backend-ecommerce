import Express from 'express'
import RouterProducts from './router/products.router.js'
import RouterCarts from './router/carts.router.js'

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({extended: true}))

app.use(function(req, res, next){
    console.log((`Url: [${req.url}] Time: ${new Date().toLocaleTimeString()}`));
    next() // pasa al proximo use
})

app.use('/api/products', RouterProducts)
app.use('/api/carts', RouterCarts)

app.listen(8080, () => console.log('Server express is listening on port 8080 ...'))