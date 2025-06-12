require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.SK_STRIPE);
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const http = require('http');

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



async function llamarStripe(idPedido, price, res) {
  const session = await stripe.checkout.sessions.create({
    customer_email: 'customer@example.com',
    submit_type: 'pay',
    billing_address_collection: 'auto',
    metadata: { idpedido: idPedido },
    line_items: [{
      price_data: {
        currency: 'mxn',
        product_data: { name: "Pedido Hikari Paper" },
        unit_amount: price
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `http://localhost:4200/carrito?status=success`,
    cancel_url: `http://localhost:4200/carrito?status=cancel`,

  });

  res.redirect(303, session.url);
}


app.post('/create-checkout-session', async (req, res) => {
  console.log('Body recibido en /create-checkout-session:', req.body);

  const postData = JSON.stringify(req.body);

  const options = {
    hostname: 'localhost',
    port: 4242,
    path: '/procesar-pago',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    }
  };

  const proxy = http.request(options, (dbres) => {
    let body = '';

    dbres.on('data', chunk => {
      body += chunk;
    });

    dbres.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('Respuesta de /procesar-pago:', data);

        if (dbres.statusCode === 200) {

          
          const session = await stripe.checkout.sessions.create({
            customer_email: req.body.email,
            submit_type: 'pay',
            billing_address_collection: 'auto',
            metadata: { idpedido: data.idPedido },
            line_items: [{
              price_data: {
                currency: 'mxn',
                product_data: { name: "Pedido Hikari Paper" },
                unit_amount: data.total
              },
              quantity: 1
            }],
            mode: 'payment',
            success_url: `http://localhost:4200/carrito?status=success`,
            cancel_url: `http://localhost:4200/carrito?status=cancel`,
          });

          console.log('Respuesta de /procesar-pago:', session.url);

          res.status(200).json({
            stripe_link: session.url
          });

          // res.redirect(303, session.url);


          //llamarStripe(data.idPedido, data.total, res);


          //res.status(200).json({ mensaje: 'Procesado con éxito' });
        } else {
          res.status(500).json({ error: 'Error al procesar el pago' });
        }
      } catch (err) {
        res.status(500).json({ error: 'Respuesta inválida del backend' });
      }
    });
  });

  proxy.on('error', (error) => {
    console.error('Error reenviando petición:', error);
    res.status(500).json({ error: 'Fallo al reenviar la petición' });
  });

  proxy.write(postData); // ✅ Envía el JSON
  proxy.end();           // ✅ Termina la petición
});


app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
