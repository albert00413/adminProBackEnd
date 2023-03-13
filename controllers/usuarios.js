const {response} = require('express');
const bcrypt = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const from = Number(req.query.from) || 0;


 

    // const total = await Usuario.count();
    
    const [ usuarios, total] = await Promise.all([
     Usuario
        .find({}, 'nombre email role google img')
        .skip( from )
        .limit( 5 ),

     Usuario.countDocuments()

    ])

    res.json({
        ok:true,
        usuarios,
        total
    })

}

const crearUsuarios = async(req, res = response) => {

    const { nombre, password, email } = req.body

    try{
        const existeEmail = await Usuario.findOne({email})        
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }

        const usuario = new Usuario( req.body );
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //Generar JWT
        const token = await generarJWT (usuario.id);

        //Guardar usuario
        await usuario.save();

        res.json({
            ok:true,
            usuario,
            token
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        })
    }
}
 
const actualizarUsuario = async(req, res = response) =>{

     //todo validar token

    const uid = req.params.id;
    try{

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe'
            })
        }

       //Actualizaciones

        const {password, google, email, ...campos} = req.body;

        if ( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne( { email } );
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        
        if(!usuarioDB.google){            
        campos.email = email;
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos);


        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error actualizar'
        })
    }

}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;
   try{

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB){
        return res.status(404).json({
            ok: false,
            msg: 'El usuario no existe'
        })
    }

    await Usuario.findByIdAndDelete( uid )


    res.json({
        ok: true,
        msg: 'Usuario eliminado'
    })


   }catch(error){
    console.log(error);
    res.status(500).json({
        ok: false,
        msg: 'Error borrar'
    })
}

}
module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
}