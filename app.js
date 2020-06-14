const http = require('http'); //imports files and modules
const bodyParser = require('body-parser');
const path = require('path')
var assert = require('assert');
// var url = "mongodb://localhost:27017";
var url = "mongodb+srv://dbUser:dbUserPass@cluster0-ijbvo.mongodb.net/test?retryWrites=true&w=majority"
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
const dbName = 'test';



const express  = require('express'); //imports function

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(bodyParser.urlencoded({extended: true})); //parses form values

app.use('/static', express.static("css"));
app.use('/staticimg', express.static("img"));

app.use('/login',(req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
    
}); // allows us to add a new middleware function

app.post('/signin-submit',(req,res)=>{
        var item = {
            EmailId: req.body.EmailId,
            Password: req.body.Password
        }
    
        
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){

            assert.equal(null, err);
            
            const db = client.db(dbName);
            db.collection('regusers').find({EmailId: item.EmailId}).limit(1).next(function(err, result){
                if(null!=result)
                {
                    client.close();
                    res.send('<h1>ERROR!</h1>');

                }
                else{
                    db.collection('regusers').insertOne(item, function(err, result){
                        assert.equal(null, err);
                        console.log('Item inserted');
                        client.close();
                        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    
                        });
                    
                }
                
            });
            
        });
    });

    app.post('/post-submit',(req,res)=>{
        var item = {
            EmailId: req.body.EmailId,
            Password: req.body.Password

        }
    
        
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){

            assert.equal(null, err);
            
            const db = client.db(dbName);
            db.collection('regusers').find(item).limit(1).next(function(err, result){
                if(null!=result)
                {
                    client.close();
                    res.sendFile(path.join(__dirname, 'views', 'webpage1.html'));

                }
                else{
                    // db.collection('regusers').insertOne(item, function(err, result){
                    //     assert.equal(null, err);
                    //     console.log('Item inserted');
                        client.close();
                        res.send('<h1>ERROR!</h1>');
                        // });
                    
                }
                
            });
            
        });
    });



app.use('/signup',(req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'signin.html'));
    
}); // allows us to add a new middleware function


app.use('/',(req, res, next) => {
    res.sendFile(path.join(__dirname,'views', 'index.html'));
}); // allows us to add a new middleware function


// app.use((req, res, next)=>{
//     res.statusCode(404).send('<h1>ERROR</h1>');
// })

app.listen(process.env.Port || 3000);


