const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
const projectStore = {
    searchs: []
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('client'));


app.post('/search-by-zip', (req, res) => {
    if(parseInt(req.body.cod) === 200) {
        projectStore.searchs.push({ data: req.body, time: new Date(Date.now()).toDateString()});
    }
    res.send(req.body);
})

app.get('/searchs', (req, res) => {
    res.send(projectStore.searchs)
})



app.listen(PORT, () => console.log(`Running in port ${PORT}`))