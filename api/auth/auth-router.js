const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware.js');

const {
  add,
  findBy
} = require('../users/users-model.js');

const router = require('express').Router();
const bcrypt = require('bcryptjs');

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try{ 
      const { username, password } = req.body
      const hash = bcrypt.hashSync(password, 8)
      const user = {username, password:hash}
      const newUser = await add(user);
      const result = {
        user_id: newUser[0].user_id,
        username: newUser[0].username
      }
      console.log(result);
      res.status(201).json(result);
  } catch (err) {
      next(err)
  }
})

router.post("/login", checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await findBy({username});

    if(user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.json({ message: `welcome ${username}, have a cookie`})
    } else {
      next({ status: 401, message: "Invalid credentials"});
    }
  } catch(err) {
    next(err);
  }
})

router.get('/logout', async (req, res, next) => {
  if(req.session.user){
       req.session.destroy(err => {
           if(err) {
               res.json({message: 'you are trapped forever'})
           } else {
               res.status(200).json({message:'logged out'})
           }
       })
  } else {
      res.status(200).json({message: "no session"})
  }
})
module.exports = router
