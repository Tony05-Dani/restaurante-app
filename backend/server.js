const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()

const http = require('http')
const { Server } = require('socket.io')

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())
app.use(express.json())

// SOCKET.IO

io.on('connection', (socket) => {

  console.log('Usuario conectado')

})

// CONEXIÓN MYSQL

const db = mysql.createConnection({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT

})

db.connect((err) => {

  if (err) {

    console.log('Error de conexión:', err)

  } else {

    console.log('MySQL conectado')

  }

})

// RUTA PRINCIPAL

app.get('/', (req, res) => {

  res.send('Servidor funcionando')

})

// OBTENER PRODUCTOS

app.get('/productos', (req, res) => {

  const sql = 'SELECT * FROM productos'

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err)

      return res.status(500).json(err)

    }

    res.json(result)

  })

})

// OBTENER PEDIDOS

app.get('/pedidos', (req, res) => {

  const sql = 'SELECT * FROM pedidos ORDER BY fecha DESC'

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err)

      return res.status(500).json(err)

    }

    res.json(result)

  })

})
// ACTUALIZAR ESTADO PEDIDO

app.put('/pedidos/:id', (req, res) => {

  const { id } = req.params

  const { estado } = req.body

  const sql = `
    UPDATE pedidos
    SET estado = ?
    WHERE id = ?
  `

  db.query(

    sql,

    [estado, id],

    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json(err)

      }

      res.json({

        mensaje: 'Estado actualizado'

      })

    }

  )

})

// CREAR PRODUCTO

app.post('/productos', (req, res) => {

  const {
    nombre,
    descripcion,
    precio,
    imagen,
    categoria
  } = req.body

  const sql = `
    INSERT INTO productos
    (nombre, descripcion, precio, imagen, categoria)
    VALUES (?, ?, ?, ?, ?)
  `

  db.query(

    sql,

    [
      nombre,
      descripcion,
      precio,
      imagen,
      categoria
    ],

    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json(err)

      }

      res.json({

        mensaje: 'Producto creado correctamente'

      })

    }

  )

})

// GUARDAR PEDIDOS

app.post('/pedidos', (req, res) => {

  const { mesa, carrito } = req.body

  const total = carrito.reduce(

    (acc, item) =>
      acc + item.precio * item.cantidad,

    0

  )

  const sqlPedido = `
  
    INSERT INTO pedidos (mesa, total, estado)
    
    VALUES (?, ?, ?)
  
  `

  db.query(

    sqlPedido,

    [mesa, total, 'Pendiente'],

    (err, result) => {

      if (err) {

        console.log(err)

        return res.status(500).json(err)

      }

      const pedidoId = result.insertId

      carrito.forEach((item) => {

        const sqlDetalle = `
        
          INSERT INTO detalle_pedido
          
          (pedido_id, producto_id, cantidad, subtotal)
          
          VALUES (?, ?, ?, ?)
        
        `

        db.query(

          sqlDetalle,

          [
            pedidoId,
            item.id,
            item.cantidad,
            item.precio * item.cantidad
          ]

        )

      })

      io.emit('nuevoPedido', {
  id: pedidoId,
  mesa,
  carrito,
  total,
  estado: 'Pendiente'
})

      res.json({

        mensaje: 'Pedido guardado'

      })

    }

  )

})

// SERVIDOR

const PORT = 3000

server.listen(PORT, () => {

  console.log(`Servidor corriendo en puerto ${PORT}`)

})