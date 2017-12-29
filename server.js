const express = require('express');
const mongoS  = require('mongoose');
const bodyPr  = require('body-parser');
const cors 	  = require('cors');
const api 	  = require('./routes/index.js');

const { server: port } = require('./configs/dev.js');

const app = express();

mongoS.connect("mongodb://localhost:27017/clocls");
mongoS.connection.on('error', (err) => {
    console.log(err);
});

app
	.use(express.static('public'))
	.use(cors())
	.use(bodyPr.json())
	// SET
	.set('view engine', 'hbs')
	// GET
	.get('/', (req, res) => {
		res.render(__dirname + '/index.hbs', {
			logo: 'LogoName'
		});
	})
	// USE
	.use('/api', api)
	.use((err, req, res, next) => {

        if(err.name == "CustomError") {
            res.status(err.statusCode || 200);
            
            if(err) {
                res.json({
                    error: true,
                    code: err.statusCode || 500,
                    message: err.message
                });
            }
            next();
        }
    })

app.listen(port, () => {console.log('Sever started!')});