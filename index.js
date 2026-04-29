import express from "express";
import cors from "cors";
import { join, __dirname } from "./src/utils/index.js";
//import userRoutes from "./routes/user.route.js";
import productsRoutes from "./src/routes/products.route.js";
import rutasLog from "./src/routes/auth.route.js";
import 'dotenv/config';
//import { authentication } from "./src/middleware/authentication.js"

//settings
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  //origin: ['http://localhost:3000', 'https://entrega-final-tt-react-js.vercel.app'], // dominios permitidos
  origin: ['https://localhost:3000', 'https://e-commerce-cero-huella.vercel.app'], // Permitir solicitudes desde cualquier origen (no recomendado para producción)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],                  // métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],          // cabeceras permitidas
  exposedHeaders: ['Content-Length'],                         // cabeceras visibles al cliente
  credentials: true,                                          // habilitar credenciales
  maxAge: 600,                                                // cache preflight
  optionsSuccessStatus: 204                                   // respuesta preflight exitosa
};

app.use(cors(corsOptions));


// middlewares
app.use(express.json());
app.use(express.static(join(__dirname, "public")));
// Middleware para poder leer datos enviados desde formularios HTML (POST)
// Convierte el formato application/x-www-form-urlencoded en un objeto JS accesible en req.body
// "extended: true" permite interpretar objetos complejos y anidados usando la librería 'qs'
app.use(express.urlencoded({ extended: true }));

//Rutas de autenticacion
app.use("/api", rutasLog);
//app.use(authentication);// eSTA LINEA ES PARA USAR EL MIDDLEWARE DE AUTENTICACION GLOBALMENTE


// Middleware personalizado que se ejecuta en cada petición al servidor
// Sirve para hacer seguimiento y depuración de las solicitudes que recibe el server
app.use((req, res, next) => {
  // Muestra en consola la URL solicitada y el método utilizado (GET, POST, etc.)
  console.log(`Request URL: ${req.url} - Method: ${req.method}`);
  // Después llama a next() para que continúe el flujo hacia el siguiente middleware o ruta
  next();
});

//routes
app.get("/", (req, res) => {
  res.json({ title: "Home Page Bienvenidos" });
});
//app.use("/api/users", userRoutes);
app.use("/api", productsRoutes);



// ERROR HANDLER 404 - NOT FOUND
app.use((req, res, next) => {
  res.status(404).json({ error: -2, description: `Ruta ${req.originalUrl}  No Encontrada` });
  next();  
});

//listeners

//app.set("PORT", 3000); // UNA FORMA DE EXPRESS DE SETEAR UN PUERTO FIJO
// app.listen(app.get("PORT"), () => {
//   console.log(`Server on port http://localhost:${app.get("PORT")}`);
// });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});