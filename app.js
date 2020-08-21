const express = require('express');
const config  = require('config');
const mongoose = require('mongoose');


const app = express();
const PORT = config.get('port') || 5000;

// роуты
app.use('/api/auth',require('./routes/auth.routes'));

// асинхронная функция для работы с монго дб
// так как мы ролучаем промиис
//  
async function start() {
    try {   
        // получаем промис от функции конект
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true,
        });
        // настройка и запуск сервера
        app.listen(PORT, ()=> {
            console.log(`App has been started on port ${PORT}..`);
        });


    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1) ; // выход из процесса при ошибке
    }

}

start();

