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
/*app.get('/api/productos', (req, res) => {
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
*/
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


const crypto = require('crypto');

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const query = `SELECT * FROM usuario WHERE email = ? AND password = ?`;
  db.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error del servidor');
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const usuario = results[0];
    res.status(200).json({ 
      mensaje: 'Login exitoso', 
      email: usuario.email, 
      rol: usuario.rol 
    });

    //res.status(200).json({ mensaje: 'Login exitoso', usuario: results[0].email });
  });
});

app.post('/api/register', (req, res) => {
  const { nombre, apellido, email, password, direccion, cp } = req.body;

  if (!nombre || !apellido || !email || !password || !direccion || !cp) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const checkEmailQuery = 'SELECT * FROM usuario WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    if (results.length > 0) return res.status(409).json({ error: 'El correo ya está registrado' });

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const insertQuery = `
      INSERT INTO usuario (nombre, apellido, email, password, direccion, cp, rol)
      VALUES (?, ?, ?, ?, ?, ?, 'usuario')
    `;

    db.query(insertQuery, [nombre, apellido, email, hashedPassword, direccion, cp], (err) => {
      if (err) return res.status(500).json({ error: 'No se pudo registrar' });

      return res.status(201).json({ mensaje: 'Registro exitoso', email: email, rol: 'cliente' });
    });
  });
});

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dafely306@gmail.com',
    pass: 'motq dqcg mnjc himc'   
  }
});

app.post('/api/reset-password', (req, res) => {
  const { email, nuevaPassword } = req.body;

  if (!email || !nuevaPassword) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const hashedPassword = crypto.createHash('sha256').update(nuevaPassword).digest('hex');

  const updateQuery = `UPDATE usuario SET password = ? WHERE email = ?`;
  db.query(updateQuery, [hashedPassword, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar contraseña' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Correo no registrado' });
    }

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  });
});

app.post('/api/recuperar-contrasena', (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email requerido' });

  const resetLink = `http://localhost:4200/cambiopassword?email=${encodeURIComponent(email)}`;

  const mailOptions = {
    from: 'dafely306@gmail.com',
    to: email,
    subject: 'Recuperar contraseña',
    html: `<div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>¿Olvidaste tu contraseña?</h2>
      <p>Haz clic en el siguiente enlace para restablecerla:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Cambiar contraseña
      </a>
      <p style="margin-top: 20px;">Si tú no solicitaste este correo, puedes ignorarlo.</p>
    </div>
  `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar correo:', error);
      return res.status(500).json({ error: 'No se pudo enviar el correo' });
    }

    res.json({ mensaje: 'Correo enviado exitosamente' });
  });
});

app.delete('/api/productos/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM producto WHERE id_producto = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      res.status(500).send('Error al eliminar el producto');
    } else {
      res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    }
  });
});

// Endpoint para obtener tipos de producto
app.get('/api/tipos_producto', (req, res) => {
  const query = `SELECT id_tipo, tipo FROM tipo_producto`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener tipos de producto:', err);
      return res.status(500).send('Error del servidor');
    }
    res.json(results);
  });
});

// Endpoint para obtener productos con filtros
app.get('/api/productos', (req, res) => {
  // Leer filtros desde query params
  const { inStock, tipoProducto, marca } = req.query;

  // Construir query dinámico según filtros
  let condiciones = [];
  let params = [];

  if (inStock === 'true') {
    condiciones.push('p.cantidad > 0');
  }

  if (tipoProducto) {
    condiciones.push('p.tipo_producto = ?');
    params.push(tipoProducto);
  }

  if (marca) {
    condiciones.push('p.marca = ?');
    params.push(marca);
  }

  let query = `
    SELECT p.id_producto AS id,
           p.nombre,
           p.precio,
           p.imagen,
           p.descripcion,
           p.tipo_producto AS tipoProducto,
           p.marca,
           p.cantidad
    FROM producto p
  `;

  if (condiciones.length > 0) {
    query += ' WHERE ' + condiciones.join(' AND ');
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json('Error del servidor');
    }
    res.json(results);
  });
});


app.post('/api/productos', (req, res) => {
  //console.log('Body recibido:', req.body); // <-- Añade esto
  const { tipoProducto, nombre, descripcion, precio, imagen, marca, cantidad } = req.body;
  const query = `INSERT INTO producto (tipo_producto, nombre, descripcion, precio, imagen, marca, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [tipoProducto, nombre, descripcion, precio, imagen, marca, cantidad], (err, result) => {
    if (err) {
      console.error('Error al guardar producto:', err);
      return res.status(500).send('Error al guardar');
    }
    res.status(200).json({ mensaje: 'Producto guardado' });
  });
});

app.put('/api/productos/:id', (req, res) => {
  const { tipoProducto, nombre, descripcion, precio, imagen, marca, cantidad } = req.body;
  const id = req.params.id;
  const query = `
    UPDATE producto 
    SET tipo_producto = ?, nombre = ?, descripcion = ?, precio = ?, imagen = ?, marca = ?, cantidad = ?
    WHERE id_producto = ?`;
  db.query(query, [tipoProducto, nombre, descripcion, precio, imagen, marca, cantidad, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar producto:', err);
      return res.status(500).send('Error al actualizar');
    }
    res.status(200).json({ mensaje: 'Producto actualizado con éxito' });
  });
});

/*app.post('/restar-stock', (req, res) => {
  const productos = req.body.productos; // [{ id_producto, cantidad }, ...]
  
  productos.forEach(async (p) => {
    await db.query(`
      UPDATE producto
      SET cantidad = cantidad - ?
      WHERE id = ?`, [p.cantidad, p.id_producto]
    );
  });

  res.json({ message: 'Stock actualizado' });
});*/

app.post('/resta-stock', (req, res) => {
  
  const productos = req.body.productos; // Array con objetos { id_producto, cantidad }
  console.log('Productos que se mandan al backend:', productos);
  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'No se enviaron productos para restar stock' });
  }

  // Función para procesar cada producto secuencialmente
  const procesarProducto = (index) => {
    if (index >= productos.length) {
      // Terminamos todo
      return res.json({ mensaje: 'Stock actualizado correctamente' });
    }

    const p = productos[index];

    // Primero obtener cantidad actual
    db.query(`SELECT cantidad FROM producto WHERE id_producto = ?`, [p.id_producto], (err, results) => {
      if (err) {
        console.error('Error al consultar producto:', err);
        return res.status(500).json({ error: 'Error interno al consultar producto' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: `Producto con id ${p.id_producto} no encontrado` });
      }

      const cantidadActual = results[0].cantidad;

      if (cantidadActual < p.cantidad) {
        return res.status(400).json({ error: `No hay suficiente stock para el producto id ${p.id_producto}` });
      }

      // Restar la cantidad
      db.query(
        `UPDATE producto SET cantidad = cantidad - ? WHERE id_producto = ?`,
        [p.cantidad, p.id_producto],
        (err, result) => {
          if (err) {
            console.error('Error al actualizar stock:', err);
            return res.status(500).json({ error: 'Error interno al actualizar stock' });
          }

          // Continuar con siguiente producto
          procesarProducto(index + 1);
        }
      );
    });
  };

  procesarProducto(0);
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
