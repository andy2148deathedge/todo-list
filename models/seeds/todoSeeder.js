const bcrypt = require('bcryptjs');

if (process.env.NODE_ENV !== 'production') { // seeder檔案 是單獨的應用，所以跟app.js(整個程式的入口一樣，要先放環境設定)
  require('dotenv').config(); // 若非產品模式，就會使用 .env 裡面的環境設定
}

const Todo = require('../todo');  
const User = require('../user');
const db = require('../../config/mongoose');

const SEED_USER = {// 實務上可以套用 json 檔一次產生多個 seeders
  name: 'root',
  email: 'root@example.com',
  password:'12345678' 
};

db.once('open', () => { 
  // user findOne 跟註冊功能一樣先檢查是否已經有該種子資料 if(user)

  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({ 
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id;
      return Promise.all(Array.from(
        { length: 10 },
        (_, i) => Todo.create({ name: `name-${i}`, userId })
      ))
    })
    .then(() => {
      console.log('done.');
      process.exit(); // 直接結束 term
    })
});

