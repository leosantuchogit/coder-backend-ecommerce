
const socket = io()

const form = document.getElementById('form')
const productsTable = document.querySelector('#productsTable')
const tbody = productsTable.querySelector('#tbody')


// Add new product 
form.addEventListener('submit', async (e) => {
    e.preventDefault()

    try {

        const product = {
            title: document.querySelector('#title').value,
            description: document.querySelector('#description').value,
            price: document.querySelector('#price').value,
            code: document.querySelector('#code').value,
            category: document.querySelector('#category').value,
            stock: document.querySelector('#stock').value,
        }
    
        const res = await fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    
        console.log('product', product);
       
 

        const result = await res.json()
        // Verifico si se eliminó correctamente
        if (res.status === 200) {

            console.log('Product added');

            // Todo OK, obtengo la lista de productos 
            const res = await fetch('/api/products/')
            const result = await res.json()

            console.log('result', result);

            // Emito la lista de productos actualizado
            socket.emit('productList', result)

            // Limpio el form
            document.querySelector('#title').value = ''
            document.querySelector('#description').value = ''
            document.querySelector('#price').value = ''
            document.querySelector('#code').value = ''
            document.querySelector('#category').value = ''
            document.querySelector('#stock').value = ''
        }

              
    } catch (error) {
        console.log(error)
    }
})


// Delete product
const deleteProduct = async (id) => {
    try {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        })
        const result = await res.json()

        // Verifico si se eliminó correctamente
        if (res.status === 200) {

            console.log('Product removed');

            // Todo OK, obtengo la lista de productos 
            const res = await fetch('/api/products/')
            const result = await res.json()

            // Emito la lista de productos actualizado
            socket.emit('productList', result)
        }

    } catch (error) {
        console.log(error)
    }
}

socket.on('updatedProducts', products => {      
    tbody.innerHTML = ''

    console.log('products', products);

    products.forEach(item => {              
        const tr = document.createElement('tr')
        
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.code}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>
                <button onclick='deleteProduct(${item.id})' id='btnDelete'>Eliminar</button>
            </td>
        `
        tbody.appendChild(tr)
    })
}) 