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
        maxAge: 1000 * 60 * 60 * 12  // 12시간
    },
    store: new SessionFileStore()
}));

// 패스포트 passport 미들웨어
const localStrategy = passportLocal.Strategy;
app.use(passport.initialize());
app.use(passport.session());


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
  res.redirect('/success')
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

app.get('/success', function (req, res) {
  const sql = `SELECT * FROM user
  WHERE id = ?`
  con.query(sql, [req.user[0].id], function (err, result){
    res.json({ 
      message: 'success',
      nickname: result[0].nickname
     })
  });
})

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
  
  const listSql = `
  SELECT * FROM studylist
  WHERE _num = "${Number(req.params.id)}"`

  const numSql = `
  select Count(_num) as total from studymember s 
  where _num = ?`

  con.query(numSql, [Number(req.params.id)], (err, result) => {
    const limmem = result
      if(!req.isAuthenticated()){
          con.query(listSql, [Number(req.params.id)], (err, result) => {
            res.json({
              message: "nonconfirmed",
              result: result,
              limmem: limmem
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
                    result: result,
                    limmem: limmem
                  })
                })
              } else if(result[0].confirmed === 0){
                res.json({
                  message: "waiting",
                  result: result,
                  limmem: limmem
                })
              } else if(result[0].confirmed === 1){
                res.json({
                  message: "confirmed",
                  hostid: result[0].hostid
                })
              } else{
                res.json({message: "error"})
              }
            })
          }
        })
      }
    })
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

// 마감임박 스터디 조회
app.get('/study/deadline', (req, res) => {
  const sql = `
  select sl.title, sl.tag, sl.detail, sl._num, sl.limit_member,  Count(sm._num) as mem, (sl.limit_member - Count(sm._num)) as remain from studylist sl
  join studymember sm 
  on sm._num = sl._num
  group by sl.title, sl.tag, sl.detail, sl._num, sl.limit_member
  having remain < 3
  and remain > 0
  limit 6`
  con.query(sql, (err, result) => {
    console.log(result)
    if(err) {
      res.json({message : "fail"})
    }
    else{
      res.send({
        message: "success",
        posts: result,
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
  const chkSql = `
  select Count(sm._num) as total, sl.limit_member from studymember sm
  join studylist sl
  on sl._num = sm._num
  where sl._num = ?
  and sm.id <> ?
  group by limit_member`
  con.query(chkSql, [Number(req.params.id), req.user[0].id], (err, result) => {
    if(req.isAuthenticated() && (result[0].total >= result[0].limit_member)){
      res.json({message: "overlimit"})
    } else if(req.isAuthenticated() && !req.body.status){
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
})

// ================================================================== //
// 스터디룸 홈
app.post('/study/:id/home', (req, res) => {
  const sql = `
  SELECT * FROM studylist sl
  JOIN studymember sm 
  ON sm._num = sl._num
  WHERE sm._num = ?
  AND sm.confirmed = 1`
  con.query(sql, [Number(req.params.id)], (err, result) => {
    const homeresult = result
    
    const sql = `select * from studysubobject
    where _num = ?
    and todotype = 1`
    con.query(sql, [Number(req.params.id)], (err, result) => {
      if(err) res.json({message : 'err'})
      else res.json({
        message : 'success',
        result: result,
        homeresult: homeresult
      })
    })
  })
})
// ================================================================== //
// 스터디룸 todo - myschedule.js 스케쥴 로더
app.post('/study/:id/schedule', (req, res) => {
  const sql = `
  SELECT distinct sl.main_obj as title, sl.main_obj_date as date FROM studylist sl
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

app.get('/study/:id/todoschedule', (req, res) => {
  const sql = `
  SELECT distinct main_obj as title, main_obj_date as start FROM studylist sl
  JOIN studymember sm 
  ON sm._num = sl._num
  WHERE sm._num = 24
  AND sm.confirmed = 1`
})

// 스터디룸 todo - 개인 일정 불러오기
app.post('/study/:id/todoindiv', (req, res) => {
  const delSql = `delete from studysubobject
  where _num = ?
  and todotype <> 1
  and start <> ?`
  con.query(delSql, [Number(req.params.id), req.body.date], (err, result) => {
    if(err) throw err
    else{
      console.log('delete complete')
      const sql = `select * from studysubobject
      where _num = ?
      and id = ?
      and start = ?
      and todotype <> 1`
      con.query(sql, [Number(req.params.id), req.user[0].id, req.body.date], (err, result) => {
        if(err) res.json({message : 'err'})
        else res.json({
          message : 'success',
          result: result
        })
      })
    }
  })
})

//스터디룸 todo - 개인 할일 추가
app.post('/study/:id/todosubmit', (req, res) => {
  const sql = `
  insert into studysubobject
  (_num, id, start, end, title, todotype, isfinished)
  values
  (?, ?, ?, ?, ?, ?, ?)`
  con.query(sql, [Number(req.params.id), req.user[0].id, req.body.date, req.body.date, req.body.title, 0, 0], (err, result) => {
    if(err) res.json({message : 'err'})
    else res.json({message : 'success'})
  })
})

// 스터디룸 todo - 개인 할 일 삭제
app.post('/study/:id/tododelete', (req, res) => {
  console.log(Number(req.params.id), req.body._id)
  const delSql = `delete from studysubobject
  where _num = ?
  and _id = ?`
  con.query(delSql, [Number(req.params.id), req.body._id], (err, result) => {
    if(err) res.json({message : 'err'})
    else res.json({message : 'success'})
  })
})

// 스터디룸 todo - 개인 할 일 완료
app.post('/study/:id/todofinish', (req, res) => {
  const searchSql = `
  select * from studysubobject
  where _num = ?
  and id = ?
  and todotype = 0`
  con.query(searchSql, [Number(req.params.id), req.user[0].id], (err, result) => {
    if(err) res.json({message : 'err'})
    else if(result.length === 0){
      res.json({message : 'no_result'})
    } else {
      const sql = `update studysubobject s
      set isfinished = 1
      where _num = ?
      and s.id = ?`
      con.query(sql, [Number(req.params.id), req.user[0].id], (err, result) => {
        if(err) res.json({message : 'err'})
        else res.json({message : 'success'})
      })
    }
  })
})


// 스터디룸 todo - 멤버 상태
app.post('/study/:id/todomember', (req, res) => {
  const sql = `
  select distinct sm.id as mem, isfinished from studymember sm
  left join studysubobject s
  on (sm.id = s.id and sm._num = s._num)
  join studylist sl on sm._num = sl._num
  where sm._num = ?
  and sm.confirmed = 1
  and (todotype = if(s.id = sl.hostid and todotype = 0, 0, 1) or todotype is null or todotype = 0)`
  con.query(sql, [Number(req.params.id)],(err, result) => {
    if(err) res.json({message : 'err'})
    else res.json({
      message : 'success',
    result : result
    })
  })
})

// ================================================================== //
// 스터디룸 todo - 전체스케쥴
app.post('/study/:id/todoall', (req, res) => {
  const sql = `select ss.title, ss.start, hostid, ss._id from studysubobject ss
join studylist sl
on sl._num = ss._num
where ss._num = ?
and todotype = 1`
  con.query(sql, [Number(req.params.id)], (err, result) => {
    if(err) res.json({message : 'err'})
    if(result.length === 0){
      const sql = `
      select hostid, 'noresult' from studylist
      where _num = ?`
      con.query(sql, [Number(req.params.id)], (err, result) => {
        if(err) res.json({message : 'err'})
        else res.json({
          message : 'no_result',
          result: result,
          loginid: req.user[0].id
        })
      })
    }
    else res.json({
      message : 'success',
      result: result,
      loginid: req.user[0].id
    })
  })
})

// 스터디룸 todo - 전체스케쥴 추가
app.post('/study/:id/todoallsubmit', (req, res) => {
  const sql = `
  insert into studysubobject
  (_num, id, start, end, title, todotype, isfinished)
  values
  (?, ?, ?, ?, ?, ?, ?)`
  con.query(sql, [Number(req.params.id), req.user[0].id, req.body.date, req.body.date, req.body.title, 1, 0], (err, result) => {
    if(err) res.json({message : 'err'})
    else res.json({
      message : 'success'
    })
  })
})

// ================================================================== //
//스터디룸 board
app.post('/study/:id/board', (req, res) => {
  const sql = `
  select sb._id, sb._num, sb.id, sb.detail, sb.w_date, sl.hostid from studyboard sb
  join studylist sl 
  on sb._num = sl._num
  where sb._num = ?
  order by _id desc`
  con.query(sql, [Number(req.params.id)], (err, result) => {
    if(err){res.json({message : 'error'})}
    if(result.length === 0){
      res.send({
        message: 'success',
        result: null,
        writer: req.user[0].id
      })
    }
    else{
      res.send({
        message: 'success',
        result: result,
        writer: req.user[0].id
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

// board - 수정
app.post('/study/:id/board/editstart', (req, res) => {
  const sql = `
  select * from studyboard
  where _num = ?
  and _id = ?
  `
  con.query(sql, [Number(req.params.id), req.body.boardId], 
    (err, result) => {
      if(err) throw err
      else{
        res.send({
          message : 'success',
          detail: result[0].detail,
          _id: result[0]._id
        })
      }
  })
})

// board - 수정 완료
app.post('/study/:id/board/editend', (req, res) => {
  const sql = `
  update studyboard
  set detail = ?
  where _num = ?
  and _id = ?
  `
  con.query(sql, [req.body.detail, Number(req.params.id), req.body.boardId], 
    (err, result) => {
      if(err) throw err
      else{
        res.json({
          message : 'success',
        })
      }
  })
})

// board - 삭제
app.post('/study/:id/board/postdelete', (req, res) => {
  const sql = `
  delete from studyboard
  where _num = ?
  AND _id = ?`
  con.query(sql, [Number(req.params.id), req.body.boardId], (err, result) => {
    if(err) throw err
    else{
      res.json({message : 'success'})
    }
  })
})

// ================================================================== //
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
      result: result,
      loginid: req.user[0].id
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

// ================================================================== //
// mypage - 내 정보
app.get('/myinfo', (req, res) => {
  const sql = `
  select * from user
  where id = ?`

  con.query(sql, [req.user[0].id], (err, result) => {
    if(err) res.json({message: 'error'})
    else {
      res.json({
        message: 'success',
        result: result[0]
      })
    }
  })
})

// mypage - 닉네임 수정
app.post('/myinfo/changenickname', (req, res) => {
  const sql = `
  update user
  set nickname = ?
  where id = ?`

  con.query(sql, [req.body.nickname, req.user[0].id], (err, result) => {
    if(err) res.json({message: 'error'})
    else {
      res.json({message: 'success'})
    }
  })
})

// mypage - 내 스터디
app.post('/myinfo/mystudy', (req, res) => {
  const sql = `
  select *, 
  ceil((
    select count(confirmed) from studymember sm
    where  sm.id = ?
    and confirmed = 1
  ) / 5) as confirmNum, 
  ceil((
    select count(confirmed) from studymember sm
    where  sm.id = ?
    and confirmed = 0
  ) / 5) as nonConfirmNum 
  from studymember sm
  join studylist sl 
  on sm._num = sl._num
  and sm.id = ?`
  con.query(sql , [req.user[0].id, req.user[0].id, req.user[0].id], (err, result) => {
    if(err) res.json({message: 'error'})
    else {
      res.json({
        message: 'success',
        result: result
      })
    }
  })
})

// mypage - 비밀번호 확인
app.post('/myinfo/pwcheck', (req, res) => {
  const sql = `
  select * from user
  where id = ?
  and pw = ?`
  con.query(sql, [req.user[0].id, req.body.pw], (err, result) => {
    if(err) res.json({message: 'error'})
    else if(result.length !== 0){
      res.json({
        message: 'success',
      })
    } else {
      res.json({
        message: 'wrong_pw',
      })
    }
  })
})

// mypage - 비밀번호 수정
app.post('/myinfo/pwchange', (req, res) => {
  const sql = `
  update user
  set pw = ?
  where id = ?
  `
  con.query(sql, [req.body.pw, req.user[0].id], (err, result) => {
    if(err) res.json({message: 'error'})
    else{
      res.json({
        message: 'success'
      })
    }
  })
})

// ===================== 테스트쿼리 ========================//
app.post('/test', (req, res) => {
  const sql = `
  select *, 
  ceil((
    select count(confirmed) from studymember sm
    where  sm.id = ?
    and confirmed = 1
  ) / 5) as confirmNum, 
  ceil((
    select count(confirmed) from studymember sm
    where  sm.id = ?
    and confirmed = 0
  ) / 5) as nonConfirmNum 
  from studymember sm
  join studylist sl 
  on sm._num = sl._num
  and sm.id = ?`
  con.query(sql , [req.user[0].id, req.user[0].id, req.user[0].id], (err, result) => {
    if(err) res.json({message: 'error'})
    else {
      res.json({
        message: 'success',
        result: result
      })
    }
  })
})


// app.get('/myinfo/mystudy', (req, res) => {
//   const sql = `
//   select * from studymember sm
//   join studylist sl 
//   on sm._num = sl._num
//   and sm.id = ?`
//   con.query(sql, [req.user[0].id], (err, result) => {
//     if(err) res.json({message: 'error'})
//     else {
//       res.json({
//         message: 'success',
//         result: result
//       })
//     }
//   })
// })