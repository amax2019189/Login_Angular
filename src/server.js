import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import usersRoutes from './routes/users.js';

const app = express();

// Esto evita que express genere identificadores de caché / para que no me tire un error 304
app.set('etag', false);
// Esto evita mostrar información que puede llegar a ser sensible mas adelante / me dice que trabaje con express
app.set('x-powered-by', false);

// Esto me dice que el navegador no guardara información como datos del usuario, informacion privada
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend-login' });
});

const port = process.env.PORT || 3000;

export const server = app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
