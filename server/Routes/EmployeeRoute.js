import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer'; 
import path from 'path';
const router = express.Router();
router.post('/employee_login',(req,res)=>{
    const sql = "SELECT * FROM employeesinfo WHERE email = ?"
    con.query(sql,[req.body.email],(err,result)=>{
        if (err) return res.json({loginStatus:false,Error:"Query failed"})
        if(result.length>0){
            bcrypt.compare(req.body.password,result[0].password,(err,response)=>{
          if(err) return res.json({loginStatus:false,Error:"wrong password"});
          if(response){
            const email = result[0].email;
            const token = jwt.sign({role:"employee",email:email},
            "jwt_secret_key",
            {expiresIn:'1d'});
            res.cookie('token', token)
            return res.json({loginStatus:true,id: result[0].empid});
          }
            })
             
        }else{
            return res.json({loginStatus:false,Error:"wrong email and password"});
        }
    })
})

router.get('/detail/:id',(req, res)=>{
  const id = req.params.id;
  const sql = "SELECT * FROM employeesinfo WHERE empid = ?"
  con.query(sql,[id],(err, result)=>{
    if(err) return res.json({Status:false,Error:"query error"})
    if(result) return res.json(result);
  })
})

router.get('/logout',(req, res)=>{
  res.clearCookie('token')
  return res.json({Status:true})
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/pdf');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/add_liste', upload.single('pdf'), (req, res) => {
  const { name, expense, travel, amount, date, details, empid } = req.body;

  // Format the date to 'YYYY-MM-DD' format
  const formattedDate = new Date(date).toISOString().split('T')[0];

  // Get the path of the uploaded PDF file
  const pdfPath = req.file ? req.file.filename : null;

  const insertQuery = 'INSERT INTO contacts (name, expense, travel, amount, date, details, pdf_path, empid) VALUES (?,?, ?, ?, ?, ?, ?, ?)';
  const values = [name, JSON.stringify(expense), JSON.stringify(travel), amount, formattedDate, details, pdfPath,empid];
  con.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error saving data:', err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
    console.log('Data saved successfully');
    return res.status(200).json({ message: 'Data saved successfully', contact: { id: result.insertId, name, expense, travel, amount, date, details, pdf: pdfPath,empid } });
  });
});

router.get('/list/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM contacts WHERE empid = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "query error" });
    res.json({ Status: true, Result: result || [] });
  });
});


export {router as EmployeeRouter }
