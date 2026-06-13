import { useEffect, useState } from 'react'

function Admin() {

  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])

  const [nuevoProducto, setNuevoProducto] = useState({

    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria: ''

  })

  useEffect(() => {

    obtenerProductos()
    obtenerPedidos()

  }, [])

  const obtenerProductos = async () => {

    try {

      const response = await fetch(
        'http://localhost:3000/productos'
      )

      const data = await response.json()

      setProductos(data)

    } catch (error) {

      console.log(error)

    }

  }

  const obtenerPedidos = async () => {

    try {

      const response = await fetch(
        'http://localhost:3000/pedidos'
      )

      const data = await response.json()

      setPedidos(data)

    } catch (error) {

      console.log(error)

    }

  }

  const actualizarEstado = async (

    id,
    estado

  ) => {

    try {

      await fetch(

        `http://localhost:3000/pedidos/${id}`,

        {

          method: 'PUT',

          headers: {

            'Content-Type': 'application/json'

          },

          body: JSON.stringify({

            estado

          })

        }

      )

      obtenerPedidos()

    } catch (error) {

      console.log(error)

    }

  }

  const guardarProducto = async (e) => {

    e.preventDefault()

    try {

      await fetch(

        'http://localhost:3000/productos',

        {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json'

          },

          body: JSON.stringify(

            nuevoProducto

          )

        }

      )

      setNuevoProducto({

        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        categoria: ''

      })

      obtenerProductos()

      alert('Producto agregado')

    } catch (error) {

      console.log(error)

    }

  }

  return (

    <div style={{ padding: '20px' }}>

      <h1>Panel Administrador</h1>

      <hr />

      <h2>Agregar Producto</h2>

      <form onSubmit={guardarProducto}>

        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              nombre: e.target.value
            })
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              descripcion: e.target.value
            })
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              precio: e.target.value
            })
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="URL Imagen"
          value={nuevoProducto.imagen}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              imagen: e.target.value
            })
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Categoría"
          value={nuevoProducto.categoria}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              categoria: e.target.value
            })
          }
        />

        <br /><br />

        <button type="submit">

          Guardar Producto

        </button>

      </form>

      <hr />

      <h2>Pedidos</h2>

      <table border="1" cellPadding="10">

        <thead>

          <tr>

            <th>ID</th>
            <th>Mesa</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {pedidos.map((pedido) => (

            <tr key={pedido.id}>

              <td>{pedido.id}</td>

              <td>{pedido.mesa}</td>

              <td>${pedido.total}</td>

              <td>{pedido.estado}</td>

              <td>

                <button
                  onClick={() =>
                    actualizarEstado(
                      pedido.id,
                      'Preparando'
                    )
                  }
                >
                  Preparando
                </button>

                {' '}

                <button
                  onClick={() =>
                    actualizarEstado(
                      pedido.id,
                      'Entregado'
                    )
                  }
                >
                  Entregado
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <hr />

      <h2>Productos</h2>

      <table border="1" cellPadding="10">

        <thead>

          <tr>

            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>

          </tr>

        </thead>

        <tbody>

          {productos.map((producto) => (

            <tr key={producto.id}>

              <td>{producto.id}</td>

              <td>{producto.nombre}</td>

              <td>${producto.precio}</td>

              <td>{producto.categoria}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}

export default Admin