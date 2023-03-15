const path = require('path');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizarImagen');
const fs = require('fs');


const fileUpload = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    const tiposValidos = ['hospitales','medicos', 'usuarios'];

    if ( !tiposValidos.includes(tipo) ) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un hospital, medico o usuario'
        })
    };

    //Validar que exista archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay archivos'
        })
    };

    //Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extension = nombreCortado[ nombreCortado.length -1 ];

    //Validar extension
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if ( !extensionesValidas.includes(extension) ) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension valida'
        })
    };

    //Generar el nombre del archivo

    const nombreArchivo = `${ uuidv4() }.${extension}`;
    //Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;


    //Mover la imagen
    file.mv(path, (err) => {
        if (err){            
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        };
        res.json({
                ok: true,
                msg: 'Archivo subido',
                nombreArchivo
            })
    });

    //Actualizar base de datos

    actualizarImagen( tipo, id, nombreArchivo );
    
}

const retornaImagen = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if ( fs.existsSync( pathImg) ){
        res.sendFile( pathImg );
    } else {
    const defaultImg = path.join( __dirname, `../uploads/no-image.jpg`);
        res.sendFile( defaultImg );
    }
    

}

module.exports = {
    fileUpload,
    retornaImagen
}
