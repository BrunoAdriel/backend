const { Router } =require('express')   

const router = Router()

// handle index
router.get('/', (_,res)=>{
    res.render('index', {
        title:'Mi pagina backend',
        name:'perri'
    })
})

router.get('/register', (_, res)=>{
    res.render('register', {
        title: 'Registro de usuarios'
    })
})

module.exports = router