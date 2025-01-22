// Importar dependencias
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Variables de entorno
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const app = express();
const PORT = 3030;

// Configurar conexión a MySQL
const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});

// Configurar middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Inicializar la base de datos
const initDB = () => {
  db.query(`CREATE TABLE IF NOT EXISTS equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    yardas INT DEFAULT 0,
    puntos INT DEFAULT 0
  )`);

  db.query(`CREATE TABLE IF NOT EXISTS historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipo_id INT,
    yardas INT DEFAULT 0,
    puntos INT DEFAULT 0,
    fecha DATETIME,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE
  )`);

  db.query(`SELECT COUNT(*) AS count FROM equipos`, (err, results) => {
    if (err) {
      console.error("Error inicializando la base de datos:", err);
      return;
    }
    if (results[0].count === 0) {
      const equipos = ["Equipo 1", "Equipo 2", "Equipo 3", "Equipo 4", "Equipo 5"];
      equipos.forEach(nombre => {
        db.query(`INSERT INTO equipos (nombre) VALUES (?)`, [nombre]);
      });
    }
  });
};

initDB();

// Rutas principales
app.get('/', (req, res) => {
  db.query(`SELECT * FROM equipos`, (err, equipos) => {
    if (err) {
      console.error("Error obteniendo equipos:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.sendFile(path.resolve(__dirname, 'templates', 'index.html'));
  });
});

app.post('/sumar', (req, res) => {
  const { equipo_id, yardas } = req.body;

  db.query(`SELECT yardas FROM equipos WHERE id = ?`, [equipo_id], (err, results) => {
    if (err || results.length === 0) {
      console.error("Error obteniendo yardas del equipo:", err);
      res.status(400).send("Equipo no encontrado");
      return;
    }

    const actualYardas = results[0].yardas;
    const nuevaYarda = parseInt(actualYardas) + parseInt(yardas);
    let puntosExtra = 0;
    let sobranteYarda = nuevaYarda;

    if (nuevaYarda >= 100) {
      puntosExtra = Math.floor(nuevaYarda / 100) * 7;
      sobranteYarda = nuevaYarda % 100;
    }

    db.query(`UPDATE equipos SET yardas = ?, puntos = puntos + ? WHERE id = ?`,
      [sobranteYarda, puntosExtra, equipo_id], (updateErr) => {
        if (updateErr) {
          console.error("Error actualizando equipo:", updateErr);
          res.status(500).send("Error interno del servidor");
          return;
        }

        db.query(`INSERT INTO historial (equipo_id, yardas, puntos, fecha) VALUES (?, ?, ?, NOW())`,
          [equipo_id, yardas, puntosExtra], (histErr) => {
            if (histErr) {
              console.error("Error registrando historial:", histErr);
              res.status(500).send("Error interno del servidor");
              return;
            }
            res.redirect('/');
          });
      });
  });
});

// Rutas adicionales
app.post('/editar_nombre', (req, res) => {
  const { equipo_id, nuevo_nombre } = req.body;

  db.query(`UPDATE equipos SET nombre = ? WHERE id = ?`, [nuevo_nombre, equipo_id], (err) => {
    if (err) {
      console.error("Error actualizando nombre del equipo:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.redirect('/');
  });
});

app.post('/agregar_equipo', (req, res) => {
  const { nombre_equipo } = req.body;

  db.query(`INSERT INTO equipos (nombre) VALUES (?)`, [nombre_equipo], (err) => {
    if (err) {
      console.error("Error agregando equipo:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.redirect('/');
  });
});

app.post('/eliminar_equipo/:equipo_id', (req, res) => {
  const { equipo_id } = req.params;

  db.query(`DELETE FROM equipos WHERE id = ?`, [equipo_id], (err) => {
    if (err) {
      console.error("Error eliminando equipo:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.redirect('/');
  });
});

app.get('/historial', (req, res) => {
  db.query(`SELECT historial.fecha, equipos.nombre, historial.yardas, historial.puntos
            FROM historial
            INNER JOIN equipos ON historial.equipo_id = equipos.id
            ORDER BY historial.fecha DESC`, (err, registros) => {
    if (err) {
      console.error("Error obteniendo historial:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    db.query(`SELECT id, nombre FROM equipos`, (err, equipos) => {
      if (err) {
        console.error("Error obteniendo equipos:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.sendFile(path.resolve(__dirname, 'templates', 'historial.html'));
    });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
