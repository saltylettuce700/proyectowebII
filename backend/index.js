const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 4242;

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
           COALESCE(i.cantidad, 0) AS cantidad
    FROM producto p
    LEFT JOIN inventario i ON i.producto = p.id_producto
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
