import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import studyRouter from "./router/study.js"
// import signupRouter from "./router/signup.js"
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
import ejs from 'ejs'
import nodemailer from 'nodemailer'

// 환경변수 관리
dotenv.config()

// express & 라우터 관리
const app = express();
// app.use('/study', studyRouter)
// app.use('/signup', app)

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

// 모든 스터디 조회
app.get('/study/list', (req, res) => {
  const sql = `SELECT * FROM studylist
               ORDER BY _num DESC`
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


// 스터디 검색
app.post('/study/search', (req, res) => {
  console.log(req.body.searchData)
  const keyword = "%" + req.body.searchData + "%"
  const sql = `SELECT * FROM studylist
               WHERE title LIKE ?
               ORDER BY _num DESC`
  con.query(sql, [keyword], (err, result) => {
    if(err) {
      res.json({message : "fail"})
    }
    else if(result.length !== 0){
      res.send({
        message: "success",
        posts: result
      })
    } else {
      res.json({message : "not_result"})
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



// 스터디 가입 신청 및 취소
app.post('/study/requestmember/:id', (req, res) => {
  console.log(req.user)
  if(req.isAuthenticated() && !req.body.status){
    const insSql = `INSERT INTO studymember
                  (_num, id, confirmed)
                  VALUES
                  (?, ?, ?)`
    con.query(insSql, [Number(req.params.id), req.user[0].id, 0], (err, result) => {
      if(err) throw err
      res.json({message: "request_success"})
    })
  } else if(req.isAuthenticated() && req.body.status){
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

// 스터디룸 홈
app.post('/study/:id/home', (req, res) => {
  const sql = `
  SELECT * FROM studylist sl
  JOIN studymember sm 
  ON sm._num = sl._num
  WHERE sm._num = ?
  AND sm.confirmed = 1`
  con.query(sql, [Number(req.params.id)], (err, result) => {
    res.send({
      message: 'success',
      result: result
    })
  })
})

//스터디룸 할일
app.post('/study/:id/todo', (req, res) => {})


//스터디룸 board
app.post('/study/:id/board', (req, res) => {
  const sql = `
  select * from studyboard
  where _num = ?
  order by _id desc`
  con.query(sql, [Number(req.params.id)], (err, result) => {
    console.log(result)
    if(err){res.json({message : 'error'})}
    if(result.length === 0){
      res.send({
        message: 'success',
        result: null
      })
    }
    else{
      res.send({
        message: 'success',
        result: result
      })
    }
  })
})

// board - 작성
app.post('/study/:id/board/submit', (req, res) => {
  const sql = `
  insert into studyboard
  (_num, id, detail, w_date)
  values
  (?, ?, ?, ?)`
  con.query(sql, 
    [Number(req.params.id), req.user[0].id, req.body.title, req.body.w_date], 
    (err, result) => {
      if(err) throw err
      else{
        res.json({message : 'success'})
      }
  })
})








//스터디룸 settings
app.post('/study/:id/settingsr', (req, res) => {
  const r_sql = `
  select * from studylist sl
  join studymember sm 
  on sm._num = sl._num
  where sl._num = ?
`
  con.query(r_sql, [Number(req.params.id)], (err, result) => {
    if(err) throw err
    res.send({
      message: 'success',
      result: result
    })
  })
})

app.post('/study/:id/settingsm', (req, res) => {
  const r_sql = `
  select * from studylist sl
  join studymember sm 
  on sm._num = sl._num
  where sl._num = ?
`
  con.query(r_sql, [Number(req.params.id)], (err, result) => {
    if(err) throw err
    res.send({
      message: 'success',
      result: result
    })
  })
})

// settings - 멤버 수락
app.post('/study/:id/memberconfirm', (req, res) => {
  const sql = `
  update studymember
  set confirmed = 1
  where _num = ?
  and id = ?
  `
  con.query(sql, [Number(req.params.id), req.body.member], (err, result) => {
    const r_sql = `
    select * from studylist sl
    join studymember sm 
    on sm._num = sl._num
    where sl._num = ?
    `
    con.query(r_sql, [Number(req.params.id)], (err, result) => {
      if(err) throw err
      res.send({
        message: 'success',
        result: result
      })
    })
  })
})

// settings - 멤버 거절 및 추방
app.post('/study/:id/membernonconfirm', (req, res) => {
  const sql = `
  delete from studymember
  where _num = ?
  and id = ?
  `
  con.query(sql, [Number(req.params.id), req.body.member], (err, result) => {
    const r_sql = `
    select * from studylist sl
    join studymember sm 
    on sm._num = sl._num
    where sl._num = ?
    `
    con.query(r_sql, [Number(req.params.id)], (err, result) => {
      if(err) throw err
      res.send({
        message: 'success',
        result: result
      })
    })
  })
})

// settings - 저장
app.post('/study/:id/settingsave', (req, res) => {
  console.log(req.body.title, req.body.tag, 
    req.body.detail, req.body.main_obj, 
    req.body.main_obj_date,
    Number(req.params.id))
  const sql = `
  update studylist
  set title = ?,
  tag = ?,
  detail = ?,
  main_obj = ?,
  main_obj_date = ?
  where _num = ?
`
 
  const data = [req.body.title, req.body.tag, 
    req.body.detail, req.body.main_obj, 
    req.body.main_obj_date,
    Number(req.params.id)]

  con.query(sql, data, (err, result) => {
    if(err) res.json({message: 'error'})
    else {
      res.json({message: 'success'})
    }
  })
})