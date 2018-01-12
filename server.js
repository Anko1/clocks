const express = require('express');
const mongoS = require('mongoose');
const bodyPr = require('body-parser');
const cors = require('cors');
const api = require('./routes/index.js');
const hbs = require('hbs');
const fs = require('fs');

const {server: port} = require('./configs/dev.js');

const CLOCKS = require('./hardcode/clocks.json');

hbs.registerHelper('if_even', function (conditional, options) {
    if ((conditional % 2) === 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

const app = express();

// mongoS.connect("mongodb://localhost:27017/clocls");
// mongoS.connection.on('error', (err) => {
//     console.log(err);
// });

const partialsDir = __dirname + '/public/views/partials';

const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
    const matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
        return;
    }
    const name = matches[1];
    const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
    hbs.registerPartial(name, template);
});

app
    .use(express.static('public'))
    .use(cors())
    .use(bodyPr.urlencoded({extended: false}))
    .use(bodyPr.json())
    // SET
    .set('view engine', 'hbs')
    // GET
    .get('/', (req, res) => {
        res.render(__dirname + '/public/views/index.hbs', {
            clocks: CLOCKS
        });
    })
    .get('/man', (req, res) => {
        res.render(__dirname + '/public/views/man.hbs', {
            clocks: CLOCKS
        });
    })
    .get('/woman', (req, res) => {
        res.render(__dirname + '/public/views/woman.hbs', {
            clocks: CLOCKS
        });
    })
    //TODO remove from here in future :)
    .get('/clock-view/:id', (req, res) => {
        const {id} = req.params;

        res.render(__dirname + '/public/views/clock.hbs', {
            clock: CLOCKS[id]
        });
    })
    .post('/get-cart', (req, res) => {
        const ids = JSON.parse(req.body.clocks)

        // const answer = CLOCKS.filter((clock, i) => {
        //     const clockId = clock.id;
        //
        //     return CLOCKS[clockId]
        // });

        const answer = ids.map(clock => {
            clock.clockInfo = CLOCKS[clock.id]

            return clock
        });

        // console.log(answer);

        res.send(answer);
    })
    .get('/buy-cart', (req, res) => {
        const ids = req.query.clocks.split(',').map(n => parseInt(n));

        res.status(200).send('ALL FINE!');
    })
    .get('/clock/:id', (req, res) => {
        const {id} = req.params;

        res.send(CLOCKS[id]);
    })
    .get('/buy-form', (req, res) => {
        res.render(__dirname + '/public/views/buy.hbs')
    })
    .post('/submit-cart', (req, res) => {
        const cart = req.body.cart;
        console.log(cart);

        res.status(200).end()
    })
    // USE
    .use('/api', api)
    .use((err, req, res, next) => {

        if (err.name === "CustomError") {
            res.status(err.statusCode || 200);

            if (err) {
                res.json({
                    error: true,
                    code: err.statusCode || 500,
                    message: err.message
                });
            }
            next();
        }
    });

app.listen(port, () => {
    console.log('Server started!')
});
