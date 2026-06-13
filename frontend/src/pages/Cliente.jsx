import { useEffect, useState } from 'react'
import axios from 'axios'

function Cliente() {

  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [mesa, setMesa] = useState('')

  useEffect(() => {

    axios.get('http://localhost:3000/productos')
      .then((res) => {
        setProductos(res.data)
      })
      .catch((err) => {
        console.log(err)
      })

  }, [])

  const agregarCarrito = (producto) => {

    const existe = carrito.find(
      item => item.id === producto.id
    )

    if (existe) {

      const nuevoCarrito = carrito.map(item =>

        item.id === producto.id
          ? {
              ...item,
              cantidad: item.cantidad + 1
            }
          : item

      )

      setCarrito(nuevoCarrito)

    } else {

      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad: 1
        }
      ])

    }

  }

  const disminuirCantidad = (id) => {

    const item = carrito.find(
      producto => producto.id === id
    )

    if (item.cantidad === 1) {

      const nuevoCarrito = carrito.filter(
        producto => producto.id !== id
      )

      setCarrito(nuevoCarrito)

    } else {

      const nuevoCarrito = carrito.map(
        producto =>
          producto.id === id
            ? {
                ...producto,
                cantidad: producto.cantidad - 1
              }
            : producto
      )

      setCarrito(nuevoCarrito)

    }

  }

  const vaciarCarrito = () => {

    const confirmar = window.confirm(
      '¿Desea vaciar todo el carrito?'
    )

    if (confirmar) {
      setCarrito([])
    }

  }

  const enviarPedido = async () => {

    if (!mesa) {
      alert('Ingrese número de mesa')
      return
    }
    if (mesa < 1 || mesa > 20) {
  alert('La mesa debe estar entre 1 y 20')
  return
}

    if (carrito.length === 0) {
      alert('El carrito está vacío')
      return
    }

    try {

      await axios.post(
        'http://localhost:3000/pedidos',
        {
          mesa,
          carrito
        }
      )

      alert(`
Pedido enviado correctamente

Mesa: ${mesa}

Gracias por elegir Almarea Restaurante
      `)

      setCarrito([])
      setMesa('')

    } catch (error) {

      console.log(error)

      alert('Error al enviar pedido')

    }

  }

  const total = carrito.reduce(
    (acc, item) =>
      acc + item.precio * item.cantidad,
    0
  )

  const totalItems = carrito.reduce(
    (acc, item) =>
      acc + item.cantidad,
    0
  )

  return (

    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen p-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-3xl shadow-lg mb-8 text-center">

        <img
          src="/img/Logo.jpeg"
          alt="Logo Almarea"
          className="w-36 h-36 mx-auto mb-4 object-cover rounded-full border-4 border-white shadow-2xl"
        />

        <div className="mb-4">
          <span className="bg-white text-red-600 px-5 py-2 rounded-full font-bold shadow">
            📱 Menú Digital QR
          </span>
        </div>

        <div className="flex justify-center gap-4 mb-4 flex-wrap">

          <span className="bg-green-500 text-white px-4 py-2 rounded-full">
            🟢 Sistema Activo
          </span>

          <span className="bg-white text-red-600 px-4 py-2 rounded-full">
            🪑 Mesa: {mesa || 'Sin seleccionar'}
          </span>

        </div>

        <h1 className="text-4xl font-bold">
          Almarea Restaurante
        </h1>

        <p className="mt-2 text-lg">
          Realiza tu pedido de forma rápida desde tu mesa
        </p>

      </div>

      {/* ESTADÍSTICAS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold text-lg">
            🍽️ Productos
          </h3>

          <p className="text-2xl font-bold text-red-600">
            {productos.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold text-lg">
            🛒 Artículos
          </h3>

          <p className="text-2xl font-bold text-red-600">
            {totalItems}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold text-lg">
            💰 Total
          </h3>

          <p className="text-2xl font-bold text-green-600">
            ${total.toFixed(2)}
          </p>
        </div>

      </div>

      {/* MESA */}

      <div className="bg-white p-6 rounded-3xl shadow-xl mb-8">

        <h2 className="text-2xl font-bold mb-4">
          🪑 Identificación de Mesa
        </h2>

        <p className="text-gray-500 mb-4">
          Ingrese el número de mesa para enviar correctamente su pedido.
        </p>

        <input
          type="number"
          min = "1"
          max = "20"
          placeholder="Ejemplo: 5"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          className="
            w-full
            p-4
            border-2
            border-red-200
            rounded-xl
            focus:outline-none
            focus:border-red-500
            text-lg
          "
        />

      </div>

      {/* CARRITO */}

      <div className="bg-white p-6 rounded-3xl shadow-xl mb-10">

        <h2 className="text-3xl font-bold mb-6">
          🛒 Carrito de Compras
        </h2>

        {carrito.length === 0 ? (

          <p className="text-center text-gray-500 py-6">
            🛒 Aún no has agregado productos al pedido
          </p>

        ) : (

          carrito.map((item) => (

            <div
              key={item.id}
              className="flex justify-between items-center border-b py-3"
            >

              <div>

                <p className="font-bold">
                  {item.nombre}
                </p>

                <div className="flex items-center gap-2 mt-2">

                  <button
                    onClick={() => disminuirCantidad(item.id)}
                    className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                  >
                    ➖
                  </button>

                  <span className="font-bold text-lg min-w-[30px] text-center">
                    {item.cantidad}
                  </span>

                  <button
                    onClick={() => agregarCarrito(item)}
                    className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                  >
                    ➕
                  </button>

                </div>

              </div>

              <p className="font-bold text-red-600">
                ${(item.precio * item.cantidad).toFixed(2)}
              </p>

            </div>

          ))

        )}

        <div className="mt-6 text-right">

          <h3 className="text-3xl font-bold text-green-600">
            Total: ${total.toFixed(2)}
          </h3>

        </div>

        {carrito.length > 0 && (

          <button
            onClick={vaciarCarrito}
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              font-bold
              py-3
              rounded-xl
              w-full
              mt-4
              transition-all
              duration-300
            "
          >
            🗑️ Vaciar Carrito
          </button>

        )}

        <button
          onClick={enviarPedido}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl mt-6 w-full text-lg transition-all duration-300"
        >
          ✅ Confirmar Pedido
        </button>

        <p className="text-center text-gray-500 mt-3">
          Su pedido será enviado directamente a cocina.
        </p>

      </div>

      {/* PRODUCTOS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {productos.map((producto) => (

          <div
            key={producto.id}
            className="
              bg-white
              rounded-3xl
              overflow-hidden
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-2
              hover:scale-105
              transition-all
              duration-300
            "
          >

            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">

              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                {producto.categoria}
              </span>

              <h2 className="text-2xl font-bold mt-3">
                {producto.nombre}
              </h2>

              <p className="text-gray-500 mt-2">
                {producto.descripcion}
              </p>

              <div className="flex justify-between items-center mt-5">

                <span className="text-red-600 text-2xl font-bold">
                  ${producto.precio}
                </span>

                <button
                  onClick={() => agregarCarrito(producto)}
                  className="
                    bg-red-600
                    hover:bg-red-700
                    hover:scale-110
                    transition-all
                    duration-300
                    text-white
                    px-5
                    py-2
                    rounded-xl
                  "
                >
                  Agregar
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      <footer className="text-center mt-12 text-gray-600">

        <p>
          Almarea Restaurante © 2026
        </p>

        <p>
          Sistema de pedidos digitales mediante código QR
        </p>

      </footer>

    </div>

  )

}

export default Cliente