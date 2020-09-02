var bodyParser   =require('body-parser'),
    mongoose     =require('mongoose'),
    express      =require('express'),
    path         =require('path'),
    app          =express();



mongoose.connect("mongodb://localhost/restful_blog_app",{ useUnifiedTopology: true, useNewUrlParser: true})
// title,body,image,created
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now},
});
var Blog=mongoose.model('blog',blogSchema);

Blog.delete
Blog.create({
    title:"Test Blog",
    image:'./images/sher.jpg',
    body:'Hello This is Blog Post !',
})

// Restfull api
app.get('/',(req,res)=>
{
    res.redirect('/blogs')
})

app.get('/blogs',(req,res)=>
{
    Blog.find({},(err,blogs)=>
    {
        if(err)
        res.status(401).send(err);
        else
        res.render('index',{blogs:blogs});
    })
})


app.listen(3000,()=>
{
    console.log('http://localhost:'+3000);
})