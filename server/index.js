import express from 'express';
import con from './utils/db.js';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';
import {EmployeeRouter } from './Routes/EmployeeRoute.js';
import  Jwt  from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import multer from "multer";
import path from 'path';
import dotenv from 'dotenv';
const __filename = import.meta.url.substring(7);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin:[process.env.ORIGIN_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/auth',adminRouter)
app.use(express.static('public'))
app.use('/employee',EmployeeRouter)
app.use('/pdf', express.static(path.join(__dirname, 'public', 'pdf')));


const verifyUser = (req,res,next)=>{
const token = req.cookies.token;
if(token){
Jwt.verify(token,"jwt_secret_key",(req,decoded)=>{
    if(err) return res.json({Status:false,Error:"Invalid token"})
    req.id = decoded.id;
    req.role = decoded.role;
    next();
})
}else{
    return res.json({Status: false,Error:"Not Authenticated"});
}
}

app.get('/verify', verifyUser,(req,res)=>{
return  res.json({Status:true,role:req.role,id:req.id});
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
 // image upload end

 app.post('/register', upload.single('image'), async (req, res) => {
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

const port = process.env.PORT ||'3000';
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})