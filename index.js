const express = require("express");
// we need to require express to use express functionalities here
const path = require('path');
// we donot install npm install path becaues it is a inbuilt module in node
const port = 8000;
const app = express();

//comment// we use config/mongoose to use here and same as for schema i.e. models/notes
const db = require('./notes/config/mongoose');
const Notes = require('./notes/models/notes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/notes/views'));
//comment// here we join the 2 path i.e. dirname vala path aur view vala dirname m add ho jyega view vala folder(path) and if i change
// __dirname as another path and if i give it to another person then it will change my path but __dirname cannot change and uske side m views folder h
app.use(express.urlencoded());
//comment// this use signifies middleware and middleware is before my controller access my data and middleware is which is handle our 
//request first and then response and then it can analyze the data present in the request and response & it reads the form data and 
//passes it for us into keys and values and urlencoded reads only formdata which has been submitted not the params
app.use(express.static(path.join(__dirname,'/notes/assets')));
// app.use(express.static("asserts"));
//comment// this express.static means we can use our static files(html ,css)


var notesList = [
    {
            title: "Vanshika",
            enterTextHere: "Notes"
    }
]

//to render home.ejs
app.get('/', function(request, response){
    // response.send('hi');
    Notes.find({}, function(error, notes){
        if(error){
            console.log('Error in fetching contacts from db');
            return;
        }
        console.log(notes);
        return response.render('home', {
            title: "My Notes", 
            notes: notes
        });
    })
});

// app.get('/new-notes/:id',function(req,res){
//     Notes.findById(req.params.id,function(err,note){

//         return res.render('notes',{
//             note:note
//         })
//     })

// });
// routes and controllers isi mein hai? vo ni bnye smjh ni aa rha tha mjh kuch toh uske bina kaise chlega yahan tumne pass kiyahai
// post aur get vhi na controller hai hnji mjh smjh ni aa rha tha router m ek hi file ayegi na home vali 
// form action dalo app.post aur app.get mein m apko apni ejs file dekhati hu usme na delete ka ni h option
// now creating new tasks
app.post('/create-notes', function(request, response){
    console.log('add new card');
    Notes.create({
        title: request.body.notetitle,
        enterTextHere: request.body.notetext
    }, function(error, newTask){
        if(error){
            console.log("error is creating a new card!!!", error);
            return;
        }
        else{
            console.log("Opened new notes");
            return response.redirect('back');
        }
    });
});

//deteting the task
// app.get('/delete-notes/', function(request, response){
//     console.log(request.query);
//     var id = request.query;

//     // to check the number of tasks to be deleted
//     var count = Object.keys(id).length;
//     for(let i=0; i<count; i++){
//         // deleting the task from the database by using their individual ids
//         Notes.findByIdAndDelete(Object.keys(id)[i], function(error){
//             if(error){
//                 console.log("Error in deleting the note");
//             }
//         });
//     }
//     console.log("successfully deleted the note");
//     return response.redirect('back');

// })
app.post('/update/:id', function(req,res){
    console.log(req.params.id,req.body);
    Notes.findByIdAndUpdate(req.params.id,req.body,function(err,note){
        return res.redirect('back');
    });
   
})

app.get('/delete-notes/', function(request, response){
    let id = request.query.id;
    
    Notes.findByIdAndDelete(id, function(error){
        if(error){
            console.log("Error in deleting an object from database!!!");
            return;
        }
        return response.redirect('back');
    });
});

app.listen(port,function(error){
    if(error){
        console.log("Error in running the server: ", error);
    }
    console.log("Yup! My express server is running on port: ", port);
});