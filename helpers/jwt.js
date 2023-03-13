const jwt = require('jsonwebtoken');


const generarJWT = ( uid ) => {

    
    const payload =  {uid} ;
    return new Promise( (resolve, reject) => {

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
                expiresIn: '24h'
            }, (err, token) => {

                if ( err ) {
                    // Todo mal
                    console.log(err);
                    reject('No se pudo generar el JWT')
                } else {
                    //Todo bien
                    resolve( token )
                }

            })
        }    
    )

}
    
module.exports = {
    generarJWT
}
