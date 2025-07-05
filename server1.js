const express = require('express');
const mongoose= require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
const {Schema} = mongoose;

app = express();
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());

mongoose.connect("mongodb://localhost:27017/SubsDB").then(()=>{
    console.log('database connected successfully');
}).catch((e)=>{
    console.log('unable to connect database',e);
})

userSchema = Schema({
    name:{type:String,required: true},
    password:{type:String,required: true},
});
const User = mongoose.model('User',userSchema);







const port = 4000;
app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
})


