import express from 'express'
import con from './mysql.js'
import nodemailer from 'nodemailer';
import ejs from 'ejs';

const signupRouter = express.Router()

// 회원가입
signupRouter.post('/signup/duplicateId',  (req, res) => {
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
signupRouter.post('/signup/emailauth', (req, res) => {
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
signupRouter.post('/signup/upload', (req, res) => {

})

// 회원가입 - 이메일
const signupRouterDir = '../templates/authMail.ejs';
 
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

  ejs.renderFile(signupRouterDir, {authCode : authNum}, (err, data) => {
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

signupRouter.post('/signup', (req, res) => {
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



export default signupRouter