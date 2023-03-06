import express from 'express'
import con from './mysql.js'

const studyRouter = express.Router()

// 최근 스터디 조회
studyRouter.get('/latest', (req, res) => {
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
  studyRouter.get('/list', (req, res) => {
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
  studyRouter.post('/search', (req, res) => {
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
  studyRouter.post('/create', (req, res) => {
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
  studyRouter.post('/requestmember/:id', (req, res) => {
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
  
export default studyRouter