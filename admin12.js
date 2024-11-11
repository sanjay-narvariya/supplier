var express = require('express');
const pool = require("./pool.js")
var {LocalStorage}=require("node-localstorage")
var localStorage = new LocalStorage('./scratch')
var router = express.Router();

/* GET home page. */
router.get('/admin_login1', function (req, res, next) {
  try{
    var admin=JSON.parse(localStorage.getItem('Admin'))
    if(admin==null)
    res.render('adminlogin1',{message:''});
    else
    res.render('dashboard1',{data:admin, status:true , message:"Login Successful..."})
    }
  catch
    {
      res.render('adminlogin1',{message:''});
    }

});


router.post("/check_login", function (req, res) {
  try {
    pool.query("select * from admins where (emailid=? or mobileno=?) and password=?", [req.body.emailid, req.body.emailid, req.body.password], function (error, result) {
      if (error) {
        res.render('adminlogin1', { data: [], status: false, message: "Database error....." + error })
      }
      else {
        if (result.length == 1) {
          localStorage.setItem('Admin',JSON.stringify(result[0]))
          res.render('dashboard1', { data: result[0], status: true, message: "Login Successful..." })
        }
        else {
          res.render('adminlogin1', { data: [], status: false, message: "Invalid mailid/mobile number/Password.." })

        }

      }
    })

  }
  catch (e) {
    res.render('adminlogin1', { data: [], status: false, message: "Server error....." + e })
  }
})


router.get('/admin_logout',function(req,res){
 localStorage.clear()
  res.redirect('/admin12/admin_login1')
})

module.exports = router;

