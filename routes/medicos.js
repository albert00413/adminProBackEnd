 /*
    Ruta: '/api/Medicos'
 */

    const { Router } = require('express');
    const { check } = require('express-validator');
    const { validarCampos } = require('../middlewares/validar-campos');
    const { validarJWT } = require('../middlewares/validar-jwt');
    const { getMedicos,crearMedicos,actualizarMedicos,borrarMedicos, getMedicosById } = require('../controllers/medicos')
    
    const router = Router();
    
    //Rutas
    
    router.get( '/', validarJWT, getMedicos);
    
    router.post('/', 
        [
            validarJWT,
            check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
            check('hospital', 'El id del hospital no es valido').isMongoId(),
            validarCampos
        ], 
        crearMedicos);
    
    
    router.put('/:id',
        [   
            validarJWT,
            check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
            check('hospital', 'El id del hospital no es valido').isMongoId(),
            validarCampos
        ],
        actualizarMedicos);
    
    router.delete('/:id', validarJWT, borrarMedicos);


    router.get('/:id', validarJWT, getMedicosById);
    
    
    
    
    
    module.exports = router;