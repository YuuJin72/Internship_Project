import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import studyRouter from "./router/study.js"
import signupRouter from "./router/signup.js"
import con from './router/mysql.js'
import cookieParser from 'cookie-parser';
import fileStore from 'session-file-store';
import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'express-session';

// import formidable from 'formidable'
// import * as fs from 'fs'
import multer from 'multer'
import path from 'path'

// 환경변수 관리
dotenv.config()

// express & 라우터 관리
const app = express();
app.use('/study', studyRouter)
app.use('/signup', signupRouter)

// Node.js 서버
const server = app.listen(8080, function () {
  const port = server.address().port;
console.log('Server is working : PORT - ',port);
});

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json())

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

// 쿠키 미들웨어
app.use(cookieParser());
const CookieSecret = process.env.COOKIES

// 세션 미들웨어
const SessionFileStore = fileStore(session);
app.use(session({
    secret: CookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 1  // 1시간
    },
    store: new SessionFileStore()
}));

// 패스포트 passport 미들웨어
const localStrategy = passportLocal.Strategy;
app.use(passport.initialize());
app.use(passport.session());

// =================================================================================== //
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, '../src/uploads')
  },
  filename: function(req, file, cb){
    const ext = path.extname(file.originalname)
    cb(null, true)
  }
})

const upload = multer({storage: storage})

// app.post('/upload', upload.single('image'), (req, res) => { // 'image'라는 이름은 multipart.html의 <input type="file" name="image"> 에서 폼데이터 이름으로 온 것이다.
    
//   // upload.single('image')의 업로드 정보가 req.file에 넣어진다.
//   // <input type="text" name="title"> 의 텍스트 정보가 req.body에 넣어진다.
//   console.log(req.file, req.body); 
//   res.send('ok');
// })

app.post('/upload', upload.single('image'), (req, res, next)=>{
  console.log(req.body)
  console.log(req.files)
  res.json({ message: 'success' })
  })

// app.post('/upload', (req, res) => {
//   console.log('upload')
//   const form = new formidable.IncomingForm();
//   form.parse(req, (err, field, file) => {
//     console.log(req.body)
//     if(err){throw err}
//     else{
//       const fileData = file.file
//       console.log(fileData.originalFilename)
//     }
//   })
// })
// =================================================================================== //

// 로그인
passport.use(new localStrategy({
        usernameField: 'id',
        passwordField: 'password',
        session: true,
        passReqToCallback: false,
    }, 
    (inputid, inputpw, done) => {
        const sql = `SELECT * FROM user
                     WHERE id = ? AND pw = ?`;
        con.query(sql, [inputid, inputpw], function (err, result){
          if (result.length !== 0) {
             return done(null, result[0]);
          } else {
             return done(null, false); 
          }
        })
    }
));

app.post('/signin', passport.authenticate('local', { failureRedirect: '/',}), (req, res) => {
  res.json({ message: 'success' })
})

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  const sql = `SELECT * FROM user
                     WHERE id = ?`
        con.query(sql, [user.id], function (err, result){
          if (result.length !== 0) {
             return done(null, result); 
          } else {
             return done(null, false);
          }
        })
});

app.get('/', function (req, res) {
  res.json({ message: 'fail' })
});

app.get('/islogin', (req, res) => {
  console.log('checking login status...')
  console.log(req.isAuthenticated())
  if (!req.isAuthenticated()) { 
    res.json({message: "fail"}) 
  }
  else {
    res.json({message: "success"}) 
  }
})

// 로그아웃
app.post('/signout', (req, res) => {
  req.logout(() => {
      req.session.destroy();
      res.clearCookie('connect.sid').send({message: "signout"});
  });
})

// 스터디 상세 (멤버확인)
app.get('/study/isconfirmed/:id', (req, res) => {
  
  const listSql = `SELECT * FROM studylist
                    WHERE _num = "${Number(req.params.id)}"`

  if(!req.isAuthenticated()){
    console.log('nnn')
    con.query(listSql, (err, result) => {
      res.json({
        message: "nonconfirmed",
        result: result
      })
    })
  } else {
    const sql = `SELECT * FROM studymember
               WHERE _num = ?`
    con.query(sql, [Number(req.params.id)], (err, result) => {
      if(err) throw err
      if(result.length === 0){
        res.json({message: "404"})
      }
      else{
        const confirmSql = `SELECT * FROM studymember sm
                            JOIN studylist sl
                            ON sl._num = sm._num
                            AND sm._num = ?
                            AND sm.id = ?`
        con.query(confirmSql, [Number(req.params.id), req.user[0].id], (err, result) => {
          if(err) throw err
          if(result.length === 0){
            con.query(listSql, (err, result) => {
              res.json({
                message: "nonconfirmed",
                result: result
              })
            })
          } else if(result[0].confirmed === 0){
            res.json({
              message: "waiting",
              result: result
            })
          } else if(result[0].confirmed === 1){
            res.json({message: "confirmed"})
          } else{
            res.json({message: "error"})
          }
        })
      }
    })
  }
})