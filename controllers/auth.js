const { response } = require("express");

const  Usuario  = require('../models/usuario');
const bcrypt = require('bcryptjs');

const {generarJWT} = require('../helpers/jwt');
const { googleVerify } = require("../helpers/google-verify");

const login = async( req, res = response) =>{

    const {email, password} = req.body;

    try{

        const usuarioDB = await Usuario.findOne({ email });

        //Verificar email
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'email invalido'
            })
        }
        //Verificar contraseña
        const validPassword = bcrypt.compareSync (password, usuarioDB.password)
       
        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg: 'contraseña invalida'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuarioDB.id );


        res.json({
            ok: true,
            uid: usuarioDB.id,
            nombre: usuarioDB.nombre,
            email,
            token
        })
    } catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}

const loginGoogle = async( req, res = response) =>{    
    
    try{
    const { email, name, picture } = await googleVerify( req.body.token )

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if ( !usuarioDB ){
        usuario = new Usuario({
            nombre: name,
            email,
            password: '@@@',
            img: picture,
            google: true
        })
    } else {
        usuario = usuarioDB;
        usuario.google = true;
    }

    //Guardar usuario
    await usuario.save();

    const token = await generarJWT( usuario.id );


    res.json({
        ok:true,
        email, name, picture,
        token 
    })

    } catch (error) {
        console.log(error)
        res.status(400).json({
        ok: false,
        msg: 'Token de Google invalido'
        })
    }    

}

const renewToken = async ( req, res = response) =>{ 

    const uid = req.uid

    const token = await generarJWT( uid );
    
    const usuario = await Usuario.findById( uid ); 

    res.json({
        ok:true,
        token,
        usuario
    })
}

module.exports = {
    login,
    loginGoogle,
    renewToken
}