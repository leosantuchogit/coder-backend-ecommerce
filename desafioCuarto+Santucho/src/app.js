import Express from 'express'
import Handlebars from 'express-handlebars'
import RouterViews from './routes/views.router.js'
import RouterProducts from './routes/products.router.js'
import RouterCarts from './routes/carts.router.js'
import __dirname from './util.js'
import { Server } from 'socket.io'

const app = Express()
const PORT = process.env.PORT || 8080


/** Motor de plantilla Handlebars */
app.engine('handlebars', Handlebars.engine()) // Inicializamos el motor de plantilla
app.set('views', __dirname + '/views') // Indicamos donde estan las vistas
app.set('view engine', 'handlebars') // Indicamos que motor de plantillas usar

app.use(Express.json())
app.use(Express.urlencoded({extended: true}))
app.use(Express.static(__dirname + '/public'))


// Views
app.use('/', RouterViews) // Gestiona las vistas


// Apis
app.use('/api/products', RouterProducts)
app.use('/api/carts', RouterCarts)

app.use(function(req, res, next){
    console.log((`Url: [${req.url}] Time: ${new Date().toLocaleTimeString()}`));
    next() // pasa al proximo use
})

const httpServer = app.listen(PORT, () => console.log(`Server express is listening on port ${PORT}`))
const io = new Server(httpServer)

io.on('connection', socket => {
    console.log('New client connected');
    socket.on('productList', data => {
        io.emit('updatedPorducts', data)
    })
})