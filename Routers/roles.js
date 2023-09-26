const express = require("express");
const router = express.Router();
const pool = require("../connection")
const sql = require('pg')
const {v4:uuidv4 }  = require('uuid');


router.post('/role', async (req, res) => {

    const role_id = uuidv4();
    const role_name = req.body.role_name

    const query = {
        text:
          'INSERT INTO roles ( role_id, role_name) VALUES ($1, $2)',
        values: [role_id,role_name],
      };
  
    const Role = pool.query(query, async (err, result) => {
        if (err) throw (err)
        // console.log(result.length)
        if (result.length != 0) {
            res.status(200).send("Role created")
        }

        else {
        
            success = true;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success})


            await pool.query(insert_query, (err, result) => {
                if (err) throw (err)
                // console.log("--------> Created new Role")
                // console.log(result.insertId)
                res.status(200).send("Created Sucessfully !!!")
            })
        }
    })
});

router.get('/v1/role', (req, res) => {

    pool.query('select * from role ', (err, result) => {
        if (err) {
            res.send(err)
            console.log(err);
        }
        else {
            res.send(result)
            console.log(result);
        }
    })

});
module.exports = router;