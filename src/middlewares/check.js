
module.exports = function(req, res, next) {

    let user ='admin';

    if (user == 'admin') {
        console.log('El usuario puede ingresar')
        next();//Es importante para que se ejecute otro controller
    } else {
        console.log('El usuario no tiene acceso')
        res.redirect('/');
    }
}