const express = require('express');
const axios = require('axios');
const wiki = require('wikijs').default;
const serverport = process.env.PORT || 3000;

const spaceApi = 'http://api.open-notify.org/astros.json'

const app = express();


// NAIVE API METHOD
/*
app.get('/api', async (req, res) => {

    await axios.get(spaceApi)
        .then(data => data.data.people)
        .then(async astronauts => {
            let state = {}
            for (astronaut of astronauts) {
                let astronautData = await wiki().page(astronaut['name']);
                let name = astronautData.title;
                let image = await astronautData.mainImage();
                let description = await astronautData.summary();
                state[astronautData.title] = {
                    name: name,
                    image: image,
                    description: description,
                }
            }
            console.log(state)
            return state;
        }).then(state => {
            //console.log(state)
            res.send(JSON.stringify(state))
            }
        )
})

*/

// CACHING METHOD

let state = {}

let getPeopleInSpace = async () => {
    await axios.get(spaceApi)
        .then(data => data.data.people)
        .then(async astronauts => {
            for (let astronaut of astronauts) {
                let astronautData = await wiki().page(astronaut['name']);
                let name = astronautData.title;
                let url = await astronautData.url();
                let craft = astronaut.craft;
                let image = await astronautData.mainImage();
                let description = await astronautData.summary();
                state[astronautData.title] = {
                    name: name,
                    url: url,
                    craft: craft,
                    image: image,
                    description: description,
                }
            }
        })
}

app.get('/api', async (req, res) => {
    res.send(JSON.stringify(state))
});

app.use(express.static('public'));

getPeopleInSpace();
setInterval(getPeopleInSpace, 24*3600*1000);

app.listen(serverport, async () => {
    console.log('server listening on port ' + serverport);
});