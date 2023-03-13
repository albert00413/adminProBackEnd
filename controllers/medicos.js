const Medico = require("../models/medico");


const getMedicos = async(req, res) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')
    res.json({
        ok:true,
        medicos,
    })
}
const crearMedicos = async(req, res) => {

    const uid = req.uid;
    const medico = new Medico ({
        usuario: uid,
        ...req.body
    });

    try{
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })

    }catch(error){
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}
const actualizarMedicos = async(req, res) => {
    
    const id = req.params.id;
    const uid = req.uid;
    try{

        const medicoDB = await Medico.findById(id);

        if (!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El medico no existe'
            })
        }

       //Actualizaciones

       const cambiosMedico = {
        ...req.body,
        usuario: uid
       }
       
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            usuario: medicoActualizado
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error actualizar'
        })
    }
    
}
const borrarMedicos = async(req, res) => {

    const uid = req.params.id;
   try{

    const medicoDB = await Medico.findById(uid);

    if (!medicoDB){
        return res.status(404).json({
            ok: false,
            msg: 'El medico no existe'
        })
    }

    await Medico.findByIdAndDelete( uid )


    res.json({
        ok: true,
        msg: 'Medico eliminado'
    })


   }catch(error){
    console.log(error);
    res.status(500).json({
        ok: false,
        msg: 'Error borrar'
    })
   }
}


const getMedicosById = async(req, res) => {

    const id = req.params.id;

    try{
   const medico = await Medico.findById(req.params.id)
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')
    res.json({
        ok:true,
        medico
    })

    } catch(error){
        console.log(error);
        res.json({
            ok: false,
            msg: 'Contacte con el administrador'

        })
    }

 
}


module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    borrarMedicos,
    getMedicosById
}
