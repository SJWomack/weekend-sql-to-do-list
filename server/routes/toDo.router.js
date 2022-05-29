const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//handles get request, grabs all tasks from db and sends to client
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "tasks" ORDER BY "category";';

    pool.query(queryText)
        .then((result) => {
            console.log('get success', result);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('err in get', err);
            res.sendStatus(500);
        })
})

//takes data sent from client and inserts in to new db row
router.post('/', (req, res) => {
    let newTask = req.body;
    console.log('adding new task', newTask);

    let queryText = `INSERT INTO "tasks" ("task", "category")
                     VALUES ($1, $2);`
    pool.query(queryText, [newTask.task, newTask.category])
        .then(result => {
            console.log('post success')
            res.sendStatus(201)
        })
        .catch(err => {
            console.log('post failed', err);
            res.sendStatus(500);
        })
})

//deletes db row with specified id
router.delete('/:id', (req, res) => {
    let taskId = req.params.id;
    console.log('in delete', taskId);

    const sqlQuery = `
        DELETE FROM "tasks"
        WHERE "id" = $1;
    `;
    const sqlParams = [
        taskId,
    ];

    pool.query(sqlQuery, sqlParams)
        .then(() => {
            res.sendStatus(204);
        })
        .catch((err) => {
            console.log(`DELETE failed: ${err}`);
            res.sendStatus(500);
        });

});

//updates completed status and completion date
//for db item at specified id
router.put('/:id', (req, res) => {
    const sqlQuery = `
        UPDATE "tasks"
        SET "date_completed" = $2, "completion" = $3
        WHERE id = $1;
    `;
    const sqlParams = [
        req.params.id,
        req.body.date,
        true
    ];

    pool.query(sqlQuery, sqlParams)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(`PUT failed, ${err}`);
            res.sendStatus(500);
        });
});




module.exports = router;