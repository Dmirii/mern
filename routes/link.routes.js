const {Router} = require('express')
const config = require('config');// для получения доступа к переменным конфига
const shortid = require('shortid');// используем для сокращения ссылок 
const Link = require('../models/Link');// подключаем модель
const auth = require('../middleware/auth.middleware');// миделвеар для обработки ссылок
const router = Router(); // создаем роутер



// router.post('/generate', auth, async (req, res) => {
//     try { 
//         const baseUrl = config.get('baseUrl');  // берем основную ссылку из конфига
//         const {from } = req.body;   /// получаем ссылку куда переходить
//         const code = shortId.generate(); // генерим кородкий код
//         const existing = await Link.findOne({from});  // провереяем месть ли такая ссылка в базе

//         if(exists){
//             // находи такую ссылку то возвращаем ее с 200 кодом по умолчанию
//            return  res.json({link: existing});
//         }; 

//         // создаем короткую ссылку
//         const to = baseUrl + /t/ +code;
//         //
//         // создаем обект ссылки 
//         const link = new Link({
//             code,
//             to,
//             from,
//             owner : req.user.userId,
//         });
//         // сохраняем
//         await link.save();
//         res.status(201).json({link});

//     } catch (e){
//         res.status(500).json({message:'We have some problems...'});
//     }
// });

// // пост запрос
// // добавляем в него свой миделваер auth
// // данный миделваер раскадирует токен и добавет его в поле req.user
router.post('/generate', auth, async (req, res) => {
  try {
    const baseUrl = config.get('baseUrl')
    const {from} = req.body

    const code = shortid.generate()

    const existing = await Link.findOne({ from })

    if (existing) {
      return res.json({ link: existing })
    }

    const to = baseUrl + '/t/' + code

    const link = new Link({
      code, to, from, owner: req.user.userId
    })

    await link.save()

    res.status(201).json({ link })
  } catch (e) {
    res.status(500).json({ message: 'We have some problems...' })
  }
})

// // гет для получения всех ссылок
// // добавляем мидалваер auth
// // данный миделваер раскадирует токен и добавет его в поле req.user
router.get('/', auth ,async (req, res) => {
    try {   
        const links = await Link.find({owner : req.user.userId })  // как определить какой пользователь
        res.json(links);


    } catch (e){
        res.status(500).json({message:'We have some problems with all links...'});
    }
});

// router.get('/', auth, async (req, res) => {
//   try {
//     const links = await Link.find({ owner: req.user.userId })
//     res.json(links)
//   } catch (e) {
//     res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
//   }
// })


// гет для получения конкретной ссылки по id
router.get('/:id', auth, async (req, res) => {
    try {       
        const link = await Link.findById( req.params.id )  // как определить какой пользователь
        res.json(link); 


    } catch (e){
        res.status(500).json({message:'We have some problems...'});
    }
});

module.exports = router;

// const { request } = require("express");


// // пост запрос
// // добавляем в него свой миделваер auth
// // данный миделваер раскадирует токен и добавет его в поле req.user
// router.post('/generate', auth, async (req, res) => {
//     try { 
//         const baseUrl = config.get('baseUrl');  // берем основную ссылку из конфига
//         const {from } = req.body;   /// получаем ссылку куда переходить
//         const code = shortId.generate(); // генерим кородкий код
//         const existing = await Link.findOne({from});  // провереяем месть ли такая ссылка в базе

//         if(exists){
//             // находи такую ссылку то возвращаем ее с 200 кодом по умолчанию
//            return  res.json({link: existing});
//         }; 

//         // создаем короткую ссылку
//         const to = baseUrl + /t/ +code;
//         //
//         // создаем обект ссылки 
//         const link = new Link({
//             code,
//             to,
//             from,
//             owner : req.user.userId,
//         });
//         // сохраняем
//         await link.save();
//         res.status(201).json({link});

//     } catch (e){
//         res.status(500).json({message:'We have some problems...'});
//     }
// });



