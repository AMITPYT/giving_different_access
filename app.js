const express = require("express");
require("./connection");
const Role = require("./Routers/roles");
const User = require("./Routers/signup");
const Access = require("./Routers/access")


const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());


app.use(Role, User, Access)



app.listen(port, () => {
    console.log(`connection is setup at localhost:${port}`)
})