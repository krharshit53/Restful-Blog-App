const express=require('express')
const app=express()
const  bodyParser=require('body-parser')
const mongoose=require('mongoose')
const path=require('path')
const methodOverrride=require('method-override')
const expressSanitizer=require('express-sanitizer')
mongoose.connect('mongodb://localhost:27017/restful-blog-app',{useNewUrlParser: true,useUnifiedTopology:true})

app.set(express.static(__dirname+'/public'))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer())
app.use(methodOverrride('_method'))
mongoose.set('useFindAndModify', false);
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{default:Date.now,type:Date},
})

var Blog=mongoose.model('blog-app',blogSchema)

Blog.create({
    title:'bjkvdkvbkdbvkjdf',
    image:'https://images.unsplash.com/photo-1483381719261-6620dfa2d28a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    body:'kjfhkdvkfvkfkvfk'
})

//Index route
app.get('/',(req,res)=>
{
    res.redirect('/blogs')
})

app.get('/blogs',(req,res)=>
{
        Blog.find({},(err,blogs)=>
        {
            if(err)
            return console.log(err)

            res.render('index',{blogs})
        })
})

//showing page to create new blog
app.get('/blogs/new',(req,res)=>
{
     res.render('new')
})

//create new blog
app.post('/blogs',(req,res)=>
{
      console.log(req.body.blog.body)
      req.body.blog.body=req.sanitize(req.body.blog.body)//sanitization
      console.log("===============")
      console.log(req.body.blog.body)

      Blog.create(req.body.blog,(err,Blog)=>
      {
           if(err)
           return res.render('new')

           res.redirect('/blogs')


      })
})

//show route
app.get('/blogs/:id',(req,res)=>
{
     Blog.findById(req.params.id,(err,blog)=>
     {
         if(err)
         return res.render('/blogs')

         res.render('show',{blog})
     })
})

//Edit route

app.get('/blogs/:id/edit',(req,res)=>
{
    Blog.findById(req.params.id,(err,blog)=>
    {
         if(err)
         return res.redirect('/blogs')

         res.render('edit',{blog})
    })
    
})

//update route

app.put('/blogs/:id',(req,res)=>
{
    req.body.blog.body=req.sanitize(req.body.blog.body)//sanitization
    Blog.findOneAndUpdate(req.params.id,req.body.blog,(err,blog)=>
    {
          try{
            if(err)
            res.redirect('/blogs')
            else
            {
                res.redirect('/blogs')
            }
          }
          catch(e)
          {
              console.log(e)
          }
          
    })
    res.send('update route')
})

//delete route
app.delete('/blogs/:id',(req,res)=>
{
     Blog.findByIdAndRemove(req.params.id,(err)=>
     {
         res.redirect('/blogs')
     })
})

app.listen(3000,()=>
{
    console.log("http://localhost:3000")
})