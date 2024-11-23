const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const {validationResult} = require('express-validator');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	list: (req, res) => {
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		res.render('products', {products: products, toThousand: toThousand});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const product = products.find(p => p.id == req.params.id);
		if (product) {
			return res.render('detail',{product: product, toThousand: toThousand});
		}else {
			// Redirige a la vista de error con la información necesaria
			return res.status(404).render('error', {
				message: 'Product not found',
				error: {
					status: 404,
					stack: 'Product not found',
				},
				path: req.path,
			});
		}
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {

		//let {name, price, discount, category, description} = req.body;

		let result = validationResult(req)

		if (result.isEmpty()) {

			const newProduct = {
				id: Date.now(),
				name: req.body.name,
				price: req.body.price,
				discount: req.body.discount,
				category: req.body.category,
				description: req.body.description,
				image: req.file?.filename || '/images/products/default-img.png'
				//fiel? se conoce como opcional janet, nos permiter usar algo siempre que exista
			}

			//Agregmos el nuevo producto al listado
			products.push(newProduct);
			//Convertimos a jason el objeto a javascript
			let productsJSON = JSON.stringify(products, null, ' ');
			//Procedimiento para cargarlo en el JSON
			fs.writeFileSync(productsFilePath, productsJSON)

			res.redirect('/products');
		} else {

			console.log(result.mapped());

			res.render('product-create-form', {
				old: req.body, 
				error: result.mapped()
			})
		}
	},

	// Update - Form to edit
	edit: (req, res) => {
		//Obtener los datos de producto a editar
		let productEdit = products.find(product => product.id == req.params.id);
		//Renderizar la vista con los datos
		if(productEdit){
			res.render('product-edit-form',{productEdit})
		}else {
			// Redirige a la vista de error con la información necesaria
			return res.status(404).render('error', {
				message: 'Product not found',
				error: {
					status: 404,
					stack: 'Product not found',
				},
				path: req.path,
			});
		}
		
	},
	// Update - Method to update
	update: (req, res) => {
		
		//Obtener los datos de producto a update
		let id = req.params.id;
		let productUpdate = products.find(product => product.id == id)

		// Comprobar si hay una nueva imagen
		if (req.file) {
			// Eliminar la imagen anterior
			fs.unlinkSync(path.join(__dirname,'../../public/images/products/',productUpdate.image))
			// Asignar la nueva imagen al producto
			productUpdate.image = req.file.filename;
		}

		//Modificamos el producto
		if(productUpdate){
			productUpdate.name = req.body.name || productUpdate.name
			productUpdate.price = req.body.price || productUpdate.price
			productUpdate.discount = req.body.discount || productUpdate.discount
			productUpdate.category = req.body.category || productUpdate.category
			productUpdate.description = req.body.description || productUpdate.description

			//Convertir a JSON y re-escribir el json de productos
			fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))
			//El tercer parametr, es decir el 2, representa la identacion

			res.redirect('/products')

		}else {
			// Redirige a la vista de error con la información necesaria
			return res.status(404).render('error', {
				message: 'Product not found',
				error: {
					status: 404,
					stack: 'Product not found',
				},
				path: req.path,
			});
		}
	},

	// Delete - Delete one product from DB
	delete : (req, res) => {

		//Obtener el id del producto
		let id = req.params.id;
		//Quitar la imagen
		const productToDelete = products.find(product => product.id == id)
		if (productToDelete.image != 'default-image.png') {
			fs.unlinkSync(path.join(__dirname,'../../public/images/products/',productToDelete.image))
		}
		//Quitar producto deseado
		products = products.filter(product => product.id != id)
		//Convertimos a jason el objeto a javascript
		let productsJSON = JSON.stringify(products, null, ' ');
		//Procedimiento para cargarlo en el JSON
		fs.writeFileSync(productsFilePath, productsJSON)

		res.redirect('/products');
	}
};

module.exports = controller;