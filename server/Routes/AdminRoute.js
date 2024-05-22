import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from "multer";
import path from 'path';

const router = express.Router();

router.post('/adminlogin',(req,res)=>{
    const sql = "SELECT * FROM admin WHERE email = ? and password = ?"
    con.query(sql,[req.body.email, req.body.password],(err,result)=>{
        if (err) return res.json({loginStatus:false,Error:"Query failed"})
        if(result.length>0){
            const email = result[0].email;
            const token = jwt.sign({role:"admin",email:email,id: result[0].id},
            "jwt_secret_key",
            {expiresIn:'1d'});
            res.cookie('token', token)
            return res.json({loginStatus:true})
        }else{
            return res.json({loginStatus:false,Error:"wrong email and password"});
        }
    })
})

router.get('/list',(req, res)=>{
  const sql = "SELECT * FROM  contacts";
  con.query(sql,(err,result)=>{
    if(err) return res.json({Status:false,Error:"Querry Error"})
    return res.json({Status:true,Result:result})
  })
})


const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/pdf');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

const uploadPdf = multer({ storage: pdfStorage });

router.post('/add_list', uploadPdf.single('pdf'), (req, res) => {
  try {
    const { name, expense, travel, amount, date, details, empid } = req.body;
    const pdfPath = req.file.filename;

    // Format the date
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const insertQuery = 'INSERT INTO contacts (name, expense, travel, amount, date, details, pdf_path, empid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, JSON.stringify(expense), JSON.stringify(travel), amount, formattedDate, details, pdfPath, empid];

    con.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error saving data:', err);
        return res.status(500).json({ status: false, error: "Failed to save data" });
      }
      console.log('Data saved successfully');
      return res.status(200).json({ status: true, message: 'Data saved successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

// Backend route for editing expense
router.post('/edit_expense/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { name, expense, travel, amount, date, details } = req.body;

    // Format the date to 'YYYY-MM-DD' format
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const updateQuery = 'UPDATE contacts SET name=?, expense=?, travel=?, amount=?, date=?, details=? WHERE id=?';
    const values = [name, JSON.stringify(expense), JSON.stringify(travel), amount, formattedDate, details, id];

    con.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
      }
      console.log('Data updated successfully');
      return res.status(200).json({ message: 'Data updated successfully', id, name, expense, travel, amount, date, details });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error updating data', error: error.message });
  }
});

router.get('/get_expense/:id', (req, res) => {
  const expenseId = req.params.id;
  const sql = "SELECT * FROM contacts WHERE id = ?";
  con.query(sql, [expenseId], (err, result) => {
    if (err) {
      console.error('Error fetching expense:', err);
      return res.status(500).json({ Status: false, Error: "Query failed" });
    }
    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: "Expense not found" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
});

router.delete('/delete_expense/:id',(req, res) => {
  const id = req.params.id;
  const sql = 'delete from contacts where id = ?'
  con.query(sql,[id],(err,result)=>{
    if (err) return res.json({Status:false, Error:"Couldn't delete employee"})
    return res.json({Status:true,Result:result});
  })
})



//image upload start
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/images')
  },
  filename:(req,file,cb)=>{
    cb(null,file.fieldname + "_"+ Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})
//image upload end

router.post('/add_employee', upload.single('image'), async (req, res) => {
  try {
      const sql = `INSERT INTO employeesinfo
      (name, email, password, address, image)
      VALUES(?)`;

      // Hash the password
      const hash = await new Promise((resolve, reject) => {
          bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
              if (err) reject(err);
              resolve(hash);
          });
      });

      // Execute the query
      const values = [
          req.body.name,
          req.body.email,
          hash,
          req.body.address,
          req.file.filename
      ];
      con.query(sql, [values], (err, result) => {
          if (err) throw err;
          res.json({ Status: true });
      });
  } catch (error) {
      res.json({ Status: false, Error: "Fill all field required" });
  }
});

router.get('/employee',(req, res) => {
  const sql = "SELECT * FROM employeesinfo";
  con.query(sql,(err,result)=>{
    if(err) return res.json({Status:false,Error:"Query failed"})
    return res.json({Status:true,Result:result})
  })
})


router.put('/edit_employee/:id', upload.single('image'), (req, res) => {
    const id = req.params.id; 
    const { name, email, password, address } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.json({ Status: false, Error: "Password hashing failed" });

        const sql = `UPDATE employeesinfo SET name=?, email=?, password=?, address=? WHERE empid=?`;
        const values = [name, email, hash, address,id];

        con.query(sql, values, (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query failed" });

            return res.json({ Status: true });
        });
    });
});

router.get('/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  const sql = "SELECT * FROM employeesinfo WHERE empid = ?";
  con.query(sql, [employeeId], (err, result) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).json({ Status: false, Error: "Query failed" });
    }
    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: "Employee not found" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
});

router.delete('/delete_employee/:id',(req, res) => {
  const id = req.params.id;
  const sql = 'delete from employeesinfo where empid = ?'
  con.query(sql,[id],(err,result)=>{
    if (err) return res.json({Status:false, Error:"Couldn't delete employee"})
    return res.json({Status:true,Result:result});
  })
})

router.get('/admin_count',(req, res) => {
  const sql = "SELECT count(id) as admin from admin";
  con.query(sql,(err, result) => {
    if(err) return res.json({Status:false, Error:"Query failed"})
    return res.json({Status:true,Result:result})  
  })
})

router.get('/employee_count',(req, res) => {
  const sql = "SELECT count(id) as employee from employeesinfo";
  con.query(sql,(err, result) => {
    if(err) return res.json({Status:false, Error:"Query failed"})
    return res.json({Status:true,Result:result})  
  })
})

router.get('/list_count',(req, res) => {
  const sql = "SELECT count(id) as list from contacts";
  con.query(sql,(err, result) => {
    if(err) return res.json({Status:false, Error:"Query failed"})
    return res.json({Status:true,Result:result})  
  })
})

router.get('/admin_records',(req, res) => {
  const sql = "SELECT *from admin"
  con.query(sql,(err, result) => {
    if(err) return res.json({Status:false,Error:"Query failed"})
    return res.json({Status:true,Result:result})
  })
})

router.get('/logout',(req, res)=>{
  res.clearCookie('token')
  return res.json({Status:true})

})

router.get('/profile/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM admin WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "Query error" });
    }
    if (result.length === 0) {
      return res.json({ Status: false, Error: "Admin not found" });
    }
    res.json({ Status: true, Result: result[0] });
  });
});


export {router as adminRouter};