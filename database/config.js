

const mongoose = require('mongoose');

const dbConnection = async() => {

    try{
        await mongoose.connect('mongodb+srv://MEAN_USER:WgbE77uw1t2ixfzH@cluster0.uwt8rt4.mongodb.net/dbhospital');
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
        }

}



module.exports = {
    dbConnection
}