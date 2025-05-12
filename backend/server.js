require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.SK_STRIPE);
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

console.log('Webhook secret:', process.env.WH_STRIPE);


const app = express();
const YOUR_DOMAIN = 'http://localhost:3000';



app.post('/stripe-webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  // try {
     event = stripe.webhooks.constructEvent(request.body, sig, process.env.WH_STRIPE);
  // }
  // catch (err) {
  //   response.status(400).send(`Webhook Error: ${err.message}`);
  // }

  // Handle the event
  console.log(event);

  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      console.log('async_payment_failed');
      break;
      
    case 'checkout.session.async_payment_succeeded':
      console.log('async_payment_succeeded');
      break;
      
    case 'checkout.session.completed':
      console.log('checkout.session.completed');
      break;
      
    case 'checkout.session.expired':
      console.log('checkout.session.expired');
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});

app.use(cors());
app.use(bodyParser.json());

// Conexión a base de datos XAMPP (MySQL local)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'hikari_paper'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  const price = 2500;
  const idpedidoxd = 2;

const session = await stripe.checkout.sessions.create({
    
    customer_email: 'customer@example.com',
    submit_type: 'pay',
    billing_address_collection: 'auto',
    

    // shipping_address_collection: {
    //   allowed_countries: ['US', 'CA' , 'MX'],
    // },

    metadata: {
      idpedido: idpedidoxd

    },

    line_items: [
      {
        price_data: {
                currency: 'mxn',
                product_data: {
                    name: "Pedido Hikari Paper",
                },
                unit_amount: price,  
            },
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
