const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.SK_STRIPE); // usa tu secret key real
const YOUR_DOMAIN = 'http://localhost:3000';

app.use(cors());
app.use(bodyParser.json());

// Conexión a base de datos XAMPP (MySQL local)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // si tienes contraseña agrégala
  database: 'hikari_paper'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  
const session = await stripe.checkout.sessions.create({
    customer_email: 'customer@example.com',
    submit_type: 'pay',
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA' , 'MX'],
    },
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price: 'price_1RNkl4RqfakOS0jgwNfeRm5a',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `http://localhost:4200/carrito`,
  });


  res.redirect(303, session.url);
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
