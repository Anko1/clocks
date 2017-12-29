const express = require('express');
const PORT = 8888;

const server = express();

server.use(express.static('public'));

server.set('view engine', 'hbs');

server.get('/', (req, res) => {
	res.render(__dirname + '/index.hbs', {
											 logo: 'LogoName'
										 });
});

server.get('/clock/:id', (req, res) => {
	res.render(__dirname + '/clock.hbs', {
											 id: req.params.id
										 });
});

server.listen(PORT, () => {console.log('Server started!')});