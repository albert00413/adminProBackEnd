const {response} = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = ( req, res, next) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay token'
        })
    } 
    try{
        const { uid } = jwt.verify( token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        next();

    }catch(error){
        return res.status(401).json({
            valid: false,
            msg: 'token no valido'
        });
    }



    
}

module.exports = {
    validarJWT
}