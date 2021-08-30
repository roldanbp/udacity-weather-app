const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
const projectData = {};
const searchsList = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('client'));


app.post('/search-by-zip', (req, res) => {
    const time = new Date(Date.now()).toDateString();
    if(parseInt(req.body.cod) === 200) {
        searchsList.push({ data: req.body, time, feelings: req.body.feelings});
        projectData.searchs = searchsList;
    }
    res.send({time, ...req.body});
})

app.get('/searchs', (req, res) => {
    res.send(projectData.searchs)
})



app.listen(PORT, () => console.log(`Running in port ${PORT}`))