const express=require('express');
const mongoose=require('mongoose');
const app =express();
app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.set('views','./views')
mongoose.connect('mongodb://localhost/local',{useNewUrlParser:true})
    .then(()=>console.log('Connected to DB'))
    .catch((err)=>console.log(err))

/* Schema and Get for Movie*/
const movieSchema= new mongoose.Schema({
    name:String,
    yor:Date,
    plot:String,
    poster:String,
    actorid:Array,
    producerid:String,
    producername:String,
    actorname:Array,
    yorstring:String
})

let movies = mongoose.model('movies',movieSchema)

async function getMovie(){     
    let result=await movies.find();
    let l=new Array()
    let ltemp = new Array()
    result.forEach(element => {                        
        let x=element.yor.toString().split(" ")        
        element['yorstring']=(x[1].toString()+'-'+x[2].toString()+'-'+x[3].toString());
        element['poster']=("img/"+element.poster.toString())                                     
        l.push(element.producerid)
        ltemp.push(element.actorid)
    });                   
    
    for (let i = 0; i < l.length; i++) {                
        let re=await producers.findById(l[i])    
        Object.assign(result[i],{producername:re.name})
    }

    for (let i = 0; i < ltemp.length; i++){        
        let re =await actors.find({_id:{"$in":ltemp[i]}})        
        re.forEach(element => {
            result[i].actorname.push(element.name)
        });
        
    }   
    return result    
}
/*Adding a movie and saving a Movie */
app.get('/movieAdd',(req,res)=>{    
    let r1= getActors()    
    let r2=getProducers()
    r1.then((e)=>{
        r2.then((x)=>{
            res.render('add',{resact:e,respro:x})        
        })             
        
    })               
})

app.post('/movieSave',(req,res)=>{     
    if(req.body.name.length>0 && req.body.yor.length>0 && req.body.producer.length>0 && req.body.actors.length>0){
        let result=new movies({
            name:req.body.name,
            yor:req.body.yor,
            plot:req.body.plot,
            poster:req.body.poster,
            actorid:req.body.actors,
            producerid:req.body.producer
        });
        result.save().then(()=>{
            getMovie().then((e)=>{            
                res.render('movies',{result:e})
            });
        })
        
    }else{                
        res.render('error')        
    }
    
})
/*update and update save */
app.get('/updateMovies/:id',(req,res)=>{
    movies.find({_id:req.params.id}).then((e)=>{            
        let x=e[0].yor.toString().split(" ")                        
        let gmfs=getMonthFromString(x[1])
        if(parseInt(gmfs)>10 ){e[0]['yorstring']=(x[3].toString()+'-'+gmfs+'-'+x[2].toString());}
        else{e[0]['yorstring']=(x[3].toString()+'-'+0+gmfs+'-'+x[2].toString());}                
        getActors().then((f)=>{
            getProducers().then((g)=>{        
                res.render('update',{result:e,resact:f,respro:g})
            })
        })
    })    
})

app.post('/updateSave',(req,res)=>{
    if(req.body.name.length>0 && req.body.yor.length>0 && req.body.producer.length>0 && req.body.actors.length>0){        
        movies.findById({_id:req.body._id}).then((e)=>{           
            e.name=req.body.name,
            e.yor=req.body.yor,
            e.plot=req.body.plot,    
            e.actorid=req.body.actors,
            e.producerid=req.body.producer
            if(req.body.poster!=""){
                e.poster=req.body.poster
            }             
            e.save().then(()=>{
                getMovie().then((e)=>{
                    res.render('movies',{result:e})
                })
            })
        });
    }else{                
        res.render('error')        
    }            
})
function getMonthFromString(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
} 


/* Schema and Get for Actors and Producers*/

const actorSchema= new mongoose.Schema({
    name:String,
    gender:String,
    DOB:Date,
    Bio:String    
    
})

let actors = mongoose.model('actors',actorSchema)

async function getActors(){     
    return await actors.find()   
}
const producerSchema= new mongoose.Schema({
    name:String,
    gender:String,
    DOB:{type:Date,},
    Bio:String,
    movie:String   
    
})

let producers = mongoose.model('producers',producerSchema)

async function getProducers(){     
    return await producers.find()        
}

app.post('/actorSave',(req,res)=>{    
    if(req.body.name.length > 0 && req.body.dob.length>0 && (req.body.gender==='M'||req.body.gender==='F'||req.body.gender==='O') && req.body.bio.length>0){
        let result=new actors({
            name:req.body.name,
            gender:req.body.gender,
            DOB:req.body.dob,
            Bio:req.body.bio
        });
        result.save().then(()=>{
            res.redirect('/movieAdd')
        })
    }else{
        res.render('error');
    }
});
app.post('/producerSave',(req,res)=>{    
    if(req.body.name.length > 0 && req.body.dob.length>0 && (req.body.gender==='M'||req.body.gender==='F'||req.body.gender==='O') && req.body.bio.length>0){
        let result=new producers({
            name:req.body.name,
            gender:req.body.gender,
            DOB:req.body.dob,
            Bio:req.body.bio
        });
        result.save().then(()=>{
            res.redirect('/movieAdd')
        })
    }else{
        res.render('error');
    }
});
/* Start */
getMovie().then((result)=>{
    app.get('/movies',(req,res)=>{
        res.render('movies',{result:result});
    })
})
 /* PORT */
app.listen(3000,()=>{
    console.log('listening to port 3000');
})