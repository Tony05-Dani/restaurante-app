import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

function Cocina() {

  const [pedidos, setPedidos] = useState([])

  useEffect(() => {

    const manejarPedido = (pedido) => {

      setPedidos((prev) => {

        const existe = prev.find(
          p => p.id === pedido.id
        )

        if (existe) return prev

        return [...prev, pedido]

      })

    }

    socket.on('nuevoPedido', manejarPedido)

    return () => {

      socket.off('nuevoPedido', manejarPedido)

    }

  }, [])

  const entregarPedido = (id) => {

    const nuevosPedidos = pedidos.filter(
      pedido => pedido.id !== id
    )

    setPedidos(nuevosPedidos)

  }

  return (

    <div className="bg-slate-900 min-h-screen p-8">

      <div className="bg-red-600 text-white p-6 rounded-3xl mb-8">

        <h1 className="text-5xl font-bold">
          👨‍🍳 Panel de Cocina
        </h1>

        <p className="mt-2">
          Pedidos en tiempo real
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white p-5 rounded-2xl">

          <h3 className="font-bold text-gray-500">
            Pedidos Pendientes
          </h3>

          <p className="text-4xl font-bold text-red-600">
            {pedidos.length}
          </p>

        </div>

      </div>

      {pedidos.length === 0 ? (

        <div className="bg-white p-10 rounded-3xl text-center">

          <h2 className="text-3xl text-gray-500">
            🍽️ No hay pedidos pendientes
          </h2>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {pedidos.map((pedido) => (

            <div
              key={pedido.id}
              className="bg-white rounded-3xl p-6 shadow-xl"
            >

              <div className="flex justify-between items-center">

                <h2 className="text-3xl font-bold text-red-600">
                  🪑 Mesa {pedido.mesa}
                </h2>

                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
                  Pendiente
                </span>

              </div>

              <hr className="my-4" />

              {pedido.carrito.map((item, index) => (

                <div
                  key={index}
                  className="flex justify-between py-2"
                >

                  <span>
                    {item.nombre}
                  </span>

                  <span>
                    x {item.cantidad}
                  </span>

                </div>

              ))}

              <div className="mt-4">

                <p className="text-2xl font-bold text-green-600">
                  Total: ${pedido.total.toFixed(2)}
                </p>

              </div>

              <button
                onClick={() => entregarPedido(pedido.id)}
                className="
                  w-full
                  mt-5
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  py-3
                  rounded-xl
                  font-bold
                "
              >
                ✅ Pedido Entregado
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}

export default Cocina