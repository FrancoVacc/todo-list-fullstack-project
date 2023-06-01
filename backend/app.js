const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3');

const app = express();
const db = new sqlite.Database('./data/data.db', (err) => {
    if (err) return console.log(err);
});

const PORT = 3000

//* middleware
app.use(bodyParser.json());

//* Router
const routerTareas = require('./router/tareas.js')

app.use('/api/tareas', routerTareas)


//?GET "/"
app.get("/api", (req, res) => {
    try {
        res.json({
            status: 200,
            message: "Api lista visite /api/tareas",
            success: true
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            error,
            success: false
        })
    }
})



app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});