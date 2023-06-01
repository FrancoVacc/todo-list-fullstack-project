const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3');

const app = express();
const db = new sqlite.Database('./data/data.db', (err) => {
    if (err) return console.log(err);
});

//* middleware
app.use(bodyParser.json());

const routerTareas = express.Router()
const sql = 'SELECT ID_tareas, Nombre_tareas, Descripcion_tareas,(SELECT Nombre_importancia FROM importancia WHERE ID_importancia = tareas.ID_importancia ) AS importancia, Pendiente_tareas FROM tareas'

//? GET
routerTareas.get('/', (req, res) => {
    try {
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(300).json({ status: 300, error: err, success: false })

            if (rows.length === 0) return res.status(404).json({ status: 404, error: "NO DATA FOUNDED", success: false })

            return res.json({ stuatus: 200, tareas: rows, success: true })
        })
    } catch (error) {
        res.status(500).json({ status: 500, error, success: false })
    }
})

//? GET pendiente - no pendientes
routerTareas.get('/pendientes/:pendientes', (req, res) => {
    const { pendientes } = req.params;
    try {
        if (pendientes < '0' || pendientes > '1') return res.status(404).json({ status: 404, error: "NO DATA FOUNDED", success: false })

        let query = sql + ' WHERE Pendiente_tareas = ?';
        db.all(query, [pendientes], (err, rows) => {
            if (err) return res.status(300).json({ status: 300, error: err, success: false })

            if (rows.length == 0) return res.status(404).json({ status: 404, error: "NO DATA FOUNDED", success: false })

            return res.json({ status: 200, data: rows, success: true })
        })
    } catch (error) {
        res.status(500).json({ status: 500, error, success: false })
    }
})

//?GET - Muy importante - regular - no importante
routerTareas.get('/importancia/:importancia', (req, res) => {
    const { importancia } = req.params;
    console.log(importancia)
    try {
        if (importancia === "muy importante" || importancia === "regular" || importancia === "no importante") {
            const query = sql + ' WHERE importancia = ?';
            db.all(query, [importancia], (err, rows) => {
                if (err) return res.status(300).json({ status: 300, error: err, success: false })
                if (rows.length == 0) return res.status(404).json({ status: 404, error: "NO DATA FOUNDED", success: false })

                return res.json({ status: 200, data: rows, success: true })
            })
        }


    } catch (error) {
        res.status(500).json({ status: 500, error, success: false })
    }
})

//? POST - nueva tarea
routerTareas.post('/', (req, res) => {
    const { nombre, descripcion, importancia, pendiente } = req.body;
    console.log(req.body)
    const query = 'INSERT INTO tareas (Nombre_tareas, Descripcion_tareas, ID_importancia, Pendiente_tareas) VALUES (?,?,?,?)'
    try {
        if (!req.body) return res.status(500).json({ status: 500, error: "NO DATA TO LOAD", success: false })

        if (nombre === " " || !nombre || importancia < 1 || importancia > 3 || !importancia || descripcion === " " || !descripcion || pendiente < 0 || pendiente > 1 || !pendiente) return res.status(500).json({ status: 500, error: "SOME INFORMATION IS MISSING OR INCORRECT", success: false })

        db.run(query, [nombre, descripcion, importancia, pendiente], (err) => {
            if (err) return res.status(500).json({ status: 500, error: err, success: false });

            return res.json({ status: 200, message: "DATA ACEPTED", success: true })

        })


    } catch (error) {
        res.status(500).json({ status: 500, error, success: false })
    }
})
module.exports = routerTareas