const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
/*toThousand es una funcion que convierte a string x mil cuando supera los 3 digitos*/

const controller = {
	index: (req, res) => {
		const visited = products.filter(product => product.category == 'visited');
		const inSale = products.filter(product => product.category == 'in-sale');
		res.render('index',{visited: visited, inSale: inSale, toThousand});
	},
	search: (req, res) => {
		//Obtener la informacion del formulario
		let keywords = req.query.keywords;

		//Filtrar los productos con la palabra buscada
		let results = products.filter(product =>{
			return product.name.toLowerCase().includes(keywords.toLowerCase());
		})

		res.render('results',{results: results, keywords, toThousand});
	},
};

module.exports = controller;
