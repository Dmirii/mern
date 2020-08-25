const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {

    // стандартный метод РЕСТ АПИ
    if(req.method === 'OPTIONS'){
        return next;
    };

    try{
        // вынимаем токен из строки
        const token  =req.headers.authorization.split(' ')[1];
        
        // проверяем есть ли токен
        if(!token){
           return  res.status(401).json({ mesage : ' no authorization'});
        }
        // декодируем токен
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // кладем раскадированный токен в обект реквеста
        req.user = decoded;
        next();
    } catch (e){
        res.status(401).json({ mesage : ' no authorization'});
    }
}