const Hospital = require("../models/hospital");


const getHospitales = async(req, res) => {

    const hospitales = await Hospital.find()
                                    .populate('usuario', 'nombre img');
    res.json({
        ok:true,
        hospitales,
    })
}
const crearHospitales = async(req, res) => {

    const uid = req.uid;
    const hospital = new Hospital ({
        usuario: uid,
        ...req.body
    });
    

    console.log(uid);
    try{

        const hospitalDB = await hospital.save();

        res.json({
        ok:true,
        hospital: hospitalDB
    })

    }catch(error){
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

    
}
const actualizarHospitales = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;
    try{

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'El hospital no existe'
            })
        }

       //Actualizaciones

       const cambiosHospital = {
        ...req.body,
        usuario: uid
       }
       
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            usuario: hospitalActualizado
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error actualizar'
        })
    }

}
const borrarHospitales = async(req, res) => {

    const uid = req.params.id;
   try{

    const hospitalDB = await Hospital.findById(uid);

    if (!hospitalDB){
        return res.status(404).json({
            ok: false,
            msg: 'El usuario no existe'
        })
    }

    await Hospital.findByIdAndDelete( uid )


    res.json({
        ok: true,
        msg: 'Hospital eliminado'
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
    getHospitales,
    crearHospitales,
    actualizarHospitales,
    borrarHospitales
}
