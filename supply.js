const express = require('express')
const pool = require("./pool.js")
const fs = require('fs')
var { LocalStorage } = require("node-localstorage")
var localStorage = new LocalStorage('./scratch')
const router = express.Router()

router.get('/supply_interface', function (req, res) {

   try {
      var admin = JSON.parse(localStorage.getItem('Admin'))
      if (admin == null)
         res.render('adminlogin1', { message: '' });
      else
         res.render('supplyinterface', { message: " " })
   }
   catch {
      res.render('adminlogin1', { message: '' });
   }

})

router.post('/submit_product', function (req, res) {


   var prd = req.body.products + ","
   var prt = req.body.products + ".png"
   try {
      pool.query("insert into suppliers(suppliername, address, stateid, cityid, dueamount, advance, advancedate, firmname, products, logo) values(?,?,?,?,?,?,?,?,?,?)", [req.body.suppliername, req.body.address, req.body.stateid, req.body.cityid, req.body.dueamount, req.body.advance, req.body.advancedate, req.body.firmname, prd, prt], function (error, result) {
         if (error) {
            res.render('supplyinterface', { message: 'There is a issue in dbms' + error })
         }
         else {
            res.render('supplyinterface', { message: 'Data submit successfully...' })
         }
      })

   }
   catch (e) {
      res.render('supplyinterface', { message: 'There is server error....Please contact with backend team.' + e })
   }







})


router.get('/fill_state', function (req, res) {
   try {
      pool.query("select * from state", function (error, result) {
         if (error) {
            res.json({ data: [], status: false, message: 'database error...' })
         }
         else {
            res.json({ data: result, status: true, message: 'Submit successfully..' })
         }
      })

   }
   catch (e) {
      res.json({ data: [], status: false, message: 'server error....contact to backend team' + e })
   }
})

router.get('/fill_city', function (req, res) {
   try {
      pool.query("select * from city where stateid=?", [req.query.stateid], function (error, result) {
         if (error) {
            res.json({ data: [], status: false, message: 'database error...' })
         }
         else {
            console.log(result)
            res.json({ data: result, status: true, message: 'Submit successfully..' })
         }
      })

   }
   catch (e) {
      res.json({ data: [], status: false, message: 'server error....contact to backend team' + e })
   }
})

router.get('/display_all_sell', function (req, res) {


   try {
      var admin = JSON.parse(localStorage.getItem('Admin'))
      if (admin == null)
         res.render('adminlogin1', { message: '' });
      else {

         /***************/


         try {
            pool.query("select F.*,(select C.statename from state C where C.stateid=F.stateid) as statename,(select S.cityname from city S where S.cityid=F.cityid) as cityname from suppliers F", function (error, result) {
               if (error) {
                  res.render('displayallsell', { data: [], status: false })
               }
               else {
                  res.render('displayallsell', { data: result, status: true })
               }

            })
         }
         catch (e) {
            res.render('displayallsell', { data: [], status: false })
         }
         /***************/

      }

   }
   catch {
      res.render('adminlogin1', { message: '' });
   }

})

router.get('/show_supplier', function (req, res) {

   try {
      var admin = JSON.parse(localStorage.getItem('Admin'))
    
      if (admin == null)
         res.render('adminlogin1', { message: '' });
      else {

         /***************/

         try {
            pool.query("select F.*,(select C.statename from state C where C.stateid=F.stateid) as statename,(select S.cityname from city S where S.cityid=F.cityid) as cityname from suppliers F where F.supplierid=? ", [req.query.supplierid], function (error, result) {
               if (error) {
                  // console.log(error)
                  res.render('showsupplier', { data: [], status: false })
               }
               else {
                   console.log(result[0])
                  res.render('showsupplier', { data: result[0], status: true })
               }

            })

         }
         catch (e) {
            console.log(e)
            res.render('showsupplier', { data: [], status: false })
         }

         /***************/

      }

   }
   catch {
      res.render('adminlogin1', { message: '' });
   }


})


router.post('/update_product_data', function (req, res) {
   console.log(req.body)
   var prd = req.body.products + ","
   if (req.body.btn == 'Edit') {
      pool.query("update suppliers set suppliername=?, address=?, stateid=?, cityid=?, dueamount=?, advance=?, advancedate=?, firmname=?, products=? where supplierid=?", [req.body.suppliername, req.body.address, req.body.stateid, req.body.cityid, req.body.dueamount, req.body.advance, req.body.advancedate, req.body.firmname, prd, req.body.supplierid], function (error, result) {
         if (error) {
            console.log(error)
            res.redirect('/supply/show_supplier')
         }
         else {
            res.redirect('/supply/display_all_sell')
         }
      })
   }
   else {
      pool.query("delete from suppliers where supplierid=?", [req.body.supplierid], function (error, result) {
         if (error) {
            console.log(error)
            res.redirect('/supply/display_all_sell')
         }
         else {
            res.redirect('/supply/display_all_sell')
            //fs.unlinkSync(`f:/supplier/public/images/${req.body.logo}`)
         }

      })
   }



})

module.exports = router;