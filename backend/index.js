const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 4242;

app.use(express.json());
app.use(cors()); // Permitir peticiones desde Angular

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikari_paper'
});

db.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a la base de datos.');
});

// RUTA para obtener los productos
app.get('/api/productos', (req, res) => {
  const query = `
    SELECT p.id_producto AS id,
           p.nombre,
           p.precio,
           p.imagen,
           p.descripcion,
           p.tipo_producto AS tipoProducto,
           p.marca,
           p.cantidad AS cantidad
    FROM producto p
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).send('Error de servidor');
    } else {
      res.json(results);
    }
  });
});

//Crear Pedido

app.post('/procesar-pago', async (req, res) => {
  console.log('Body recibido:', req.body);
  const { carrito } = req.body;

  const usuarioId = "a21300624@ceti.mx"; // Temporal, luego lo obtendrás del token o sesión
  const estado = "no pagado";
  const fecha = new Date();
  console.log('Insertando pedido con estado:', estado);
  // Paso 0: Obtener dirección y cp del usuario
  const queryUsuario = `SELECT direccion, cp FROM usuario WHERE email = ?`;
  db.query(queryUsuario, [usuarioId], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error al obtener usuario:', err);
      return res.status(500).send('No se encontró el usuario');
    }

    const { direccion, cp } = results[0];

    // Paso 1: Insertar pedido
    const insertPedido = `
      INSERT INTO pedido (usuario, estado_pedido, subtotal, total, cp, direccion, fec_creacion)
      VALUES (?, ?, NULL, NULL, ?, ?, ?)
    `;
    db.query(insertPedido, [usuarioId, estado, cp, direccion, fecha], (err, result) => {
      if (err) {
        console.error('Error al insertar pedido:', err);
        return res.status(500).send('Error al insertar pedido');
      }

      const idPedido = result.insertId;
      let subtotalFinal = 0;

      const insertarProducto = (item, callback) => {
        const queryProducto = `SELECT precio FROM producto WHERE id_producto = ?`;
        db.query(queryProducto, [item.id_producto], (err, result) => {
          if (err || result.length === 0) return callback(err || 'Producto no encontrado');
          const precio = result[0].precio;
          const subtotal = precio * item.cantidad;
          subtotalFinal += subtotal;

          const insertDetalle = `
            INSERT INTO pedido_producto (id_pedido, id_producto, cantidad, precio, subtotal)
            VALUES (?, ?, ?, ?, ?)
          `;
          db.query(insertDetalle, [idPedido, item.id_producto, item.cantidad, precio, subtotal], callback);
        });
      };

      const insertarTodos = async () => {
        for (const item of carrito) {
          await new Promise((resolve, reject) => {
            insertarProducto(item, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        }

        const totalFinal = subtotalFinal * 1.16;

        const updatePedido = `
          UPDATE pedido SET subtotal = ?, total = ? WHERE id_pedido = ?
        `;
        db.query(updatePedido, [subtotalFinal, totalFinal, idPedido], (err) => {
          if (err) {
            console.error('Error al actualizar pedido:', err);
            return res.status(500).send('Error al actualizar totales');
          }

          
          res.status(200).json({ 
            mensaje: 'Pedido creado correctamente', 
            idPedido: idPedido,
            total: Math.ceil(totalFinal * 100)
          });
        });
      };

      insertarTodos().catch(err => {
        console.error('Error al insertar productos:', err);
        res.status(500).send('Error al insertar productos');
      });
    });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
