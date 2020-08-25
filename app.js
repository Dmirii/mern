const express = require('express');
const config  = require('config');
const mongoose = require('mongoose');
const path = require('path')


const app = express();
const PORT = config.get('port') || 5000;

// midleware
// встроенный обработчик 
app.use(express.json({ extended: true}))
// роуты
app.use('/api/auth',require('./routes/auth.routes'));
app.use('/api/link',require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));

// подготовка к билду
// указываем , что если режим продакшен
if (process.env.NODE_ENV === 'production') {
    // берем статику из сборки на сервере
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  }

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

