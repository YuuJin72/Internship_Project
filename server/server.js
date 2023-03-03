import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mysql2 from 'mysql2'
import cookieParser from 'cookie-parser';
import fileStore from 'session-file-store';
import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'express-session';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as fs from 'fs'
import multer from 'multer'
import path from 'path'

dotenv.config()

const Router = express.Router()

// express 
const app = express();

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
  
// mysql
const con = mysql2.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  port     : process.env.PORT
});


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
// try {
// 	fs.readdirSync('uploads'); // 폴더 확인
// } catch(err) {
// 	console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
//     fs.mkdirSync('uploads'); // 폴더 생성
// }

// const upload = multer({
//     storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
//         destination(req, file, done) { // 저장 위치
//             done(null, 'uploads/'); // uploads라는 폴더 안에 저장
//         },
//         filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
//             const ext = path.extname(file.originalname); // 파일의 확장자
//             done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
//         }
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
// });

// app.post('/upload', upload.single('image'), (req, res) => { // 'image'라는 이름은 multipart.html의 <input type="file" name="image"> 에서 폼데이터 이름으로 온 것이다.
    
//   // upload.single('image')의 업로드 정보가 req.file에 넣어진다.
//   // <input type="text" name="title"> 의 텍스트 정보가 req.body에 넣어진다.
//   console.log(req.file, req.body); 
//   res.send('ok');
// })

app.post('/test', (req, res) => {
  console.log(req.body.img)
})
// =================================================================================== //

// 회원가입
app.post('/signup/duplicateId',  (req, res) => {
  const sql = 
  `SELECT id FROM user
   WHERE id = ?`
  con.query(sql, [req.body.id], (err, result) => {
    if(err){
      res.json({ message: 'fail' })
    }
    else if (result.length === 0){
      res.json({ message: 'success' })
    }
    else{
      res.json({ message: 'duplicate' })
    }
  })
})

// 회원가입 - 이메일
const appDir = './templates/authMail.ejs';
 
// 인증메일 발송 function
const SendAuthMail = (address) => {
  let authNum = Number(Math.random().toString().substr(2,6));
  let emailtemplate;

  const sql = `SELECT * FROM auth
              WHERE email = ?`;
  con.query(sql, [address], function (err, result){
    console.log(result.length)
    console.log({address, authNum})
    if (result.length !== 0) {
      const upsql = `UPDATE auth
                     SET auth_number = ?
                     WHERE email = ?`
      con.query(upsql, [authNum ,address], function (err, result){
        if(err) throw err
        console.log('UPDATE Complete')
      })
    } else {
      const insSql = `INSERT INTO auth
                      (email, auth_number)
                      VALUES(?, ?)`
      con.query(insSql, [address, authNum], function (err, result){
        if(err) throw err
        console.log('INSERT Complete')
      })
    }
  })

  ejs.renderFile(appDir, {authCode : authNum}, (err, data) => {
      if (err) { return console.log(err); }
      emailtemplate = data;
  });

  let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.NODEMAILER_HOST,
      port: 587,
      secure: false,
      auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS
      }
  });

  let mailOptions = {
      from: `공부밭`,
      to: address,
      subject: '회원가입을 위한 인증번호를 입력해주세요.',
      html: emailtemplate
  };

  transporter.sendMail(mailOptions, (err, info) => {
      if (err) { return console.log(err); } 
      console.log("Mail sent. " + info.response);
      transporter.close();
  });
}


// 인증메일 발송 API
app.post('/signup/emailauth', (req, res) => {
  const sql = `SELECT * FROM user
              WHERE email = ?`;
  con.query(sql, [req.body.email], function (err, result){
    if (result.length !== 0) { //  중복
      res.json({ message: "duplicate" });
    } else {
        SendAuthMail(req.body.email)
        res.json({ message: "success" });
    }
  })
})

// 프로필사진 업로드
app.post('/signup/upload', (req, res) => {

})

app.post('/signup', (req, res) => {
  const deleteEmail = req.body.email
  const sql = `SELECT auth_number FROM auth
               WHERE email = ?`
  con.query(sql, [req.body.email], (err, result) => {
    if(err) throw err;
    if(result.length === 0){
      res.json({ message: "error" })
    }
    else if (result[0].auth_number === Number(req.body.emailnumber)) {
      const inssql = `INSERT INTO user
            (id, pw, email, nickname)
            VALUES
            (?, ?, ?, ?)`
      con.query(inssql, [req.body.id, req.body.password, req.body.email, req.body.nickname], (err, result) => {
        if(err){
          console.log(err)
          res.json({ message: 'fail' })
        }
        else{
          const delSql = `DELETE FROM auth WHERE email = ?`
          con.query(delSql, [deleteEmail], (err, result) => {
            if(err){
              console.log(err)
              res.json({ message: 'fail' })
            }
            else {
              console.log('DELETE Complete')
              res.json({ message: 'success' })
            }
          })
        }
      })
    } else {
      res.json({ message: "failauth" })
    }
  })
}); 


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

// 최근 스터디 조회
app.get('/study/latest', (req, res) => {
  const sql = `SELECT * FROM studylist
               ORDER BY _num DESC
               LIMIT 6`
  con.query(sql, (err, result) => {
    if(err) {
      res.json({message : "fail"})
    }
    else{
      res.send({
        message: "success",
        posts: result
      })
    }
  })
})

// 스터디 생성
app.post('/study/create', (req, res) => {
  const limit = Number(req.body.limit_member)
  console.log(limit)
  if(limit < 2 || limit > 10){
    res.json({message: "overlimit"})
  } else{
    const sql = `INSERT INTO studylist
                  (hostid, title, tag, detail, limit_member)
                  VALUES
                  (?, ?, ?, ?, ?)`
    con.query(sql, [req.user[0].id, req.body.title, req.body.tag, req.body.detail, limit],  (err, result) => {
      if(err) throw err;
      else{
        const insSql = `INSERT INTO studymember
                        (_num, id, confirmed)
                        VALUES
                        (?, ?, ?)`
        con.query(insSql, [result.insertId, req.user[0].id, 1],  (err, result) => {
          console.log('making post is successed')
          res.json({message: "success"})
        })
      }
    })
  }
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

// 스터디 가입 신청 및 취소
app.post('/study/requestmember/:id', (req, res) => {
  if(!req.body.status){
    const insSql = `INSERT INTO studymember
                  (_num, id, confirmed)
                  VALUES
                  (?, ?, ?)`
    con.query(insSql, [Number(req.params.id), req.user[0].id, 0], (err, result) => {
      if(err) throw err
      res.json({message: "request_success"})
    })
  } else if(req.body.status){
    const delSql = `DELETE FROM studymember
    WHERE _num = ?
    AND id = ?
    AND confirmed = 0`
    con.query(delSql, [Number(req.params.id), req.user[0].id], (err, result) => {
      if(err) throw err
      res.json({message: "reqcancel_success"})
    })
  } else {
    res.json({message: "err"})
  }
})