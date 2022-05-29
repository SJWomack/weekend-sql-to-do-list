const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

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

})





module.exports = router;