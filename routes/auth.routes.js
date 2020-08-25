const {Router} = require('express');
const User = require('../models/User'); // модедель описывающая япользователя
const bcrypt = require('bcryptjs'); // библиотека для хеширования пароля пользователся (шифрования)
const {check, validationResult} = require('express-validator'); // библиотека для валидации данных от фронта
const jwt = require('jsonwebtoken'); // библиотека для создания токена
const config = require('config'); // доступ до параметра секретного ключа

const router = Router();


// метод для регистрации новго пользователя в БД
// /api/auth+ /register
router.post(
    '/register', 
    [
        check('email','Email is not correct').isEmail(),
        check('password','Password is too short').isLength({min:6})
    ],
    async( req, res)=>{
    try {
       
        // проводим валидацию данных от фронта
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message:'Registration data is not correct'
            })
        } 

        // получаем данные от фронтенда
        const {email, password} =req.body;

        // ищим совпадение имейла перед созданием нового пользоваетля
        const candidate =await User.findOne({ email: email});
        
      
        // если такой пользователь есть то прерываем регистрацию 
        if(candidate){
          
            return res.status(400).json({message:'This User is allready exist!'})
        }

        // хешируем пароль. фнккция асинхронная
        const hashedPassword = await bcrypt.hash(password,12);
        // создаем нового пользователя
        const user = new User({
                             email:email, 
                             password:hashedPassword 
                            });    
        
        await user.save();
      
        // отвечаем фронтенду
        res.status(201).json({message:"New User add to DB"})


    } catch (e){
      
        res.status(500).json({message:'We have some problems with registration...'});
       

    }

});


/// метод для логина DB
// /api/auth +/login
router.post(
    '/login', 
    [
        check('email','Email is not correct').normalizeEmail().isEmail(),
        check('password','Please enter the password').exists()
    ],
    async( req, res)=>{
    try {
        // проводим валидацию данных от фронта
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message:'Username or password is not correct'
            })
        }
        
        // получаем данные от фронтенда
        const {email, password} =req.body;
        // ищим совпадение имейла перед логином в БД
        const user =await User.findOne({ email: email});
        
        if(!user){
            return res.status(400).json({message:'The User is not found'})
        } 
       

        // сравниваем пароль в базе с пародем от фронтенда
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: ' The password is not correct'})
        }

        const token = jwt.sign(
            {userId: user.id}, // user.id )
            config.get('jwtSecret'), // секретная строчка из фала конфигуратора
           // {expiresIn:'1h'} // время жизни токена
        )

        // по умолчанию статус 200
        res.json({token, userId : user.id})

      

    } catch (e){
        res.status(500).json({message:'We have some problems with logIn...'})

    }

});

module.exports  = router;