const express = require('express')
const res = require('express/lib/response')
const app = express()

app.get('/', (req,res)=>{
    res.send('Clonned GitHub repo to VM to access project!')
})

app.listen(3000)