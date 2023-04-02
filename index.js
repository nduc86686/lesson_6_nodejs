const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');


const app = express();
const port = 3000;
app.set('view engine', 'ejs');
// Thiết lập đường dẫn cho thư mục views
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const fs = require('fs');

let data = fs.readFileSync('driving_test_questions.json');
let questions = JSON.parse(data);
// Render the index page
app.get('/', (req, res) => {
    let data = fs.readFileSync('driving_test_questions.json');
    let questions = JSON.parse(data);
    let questionHtml = '';
    let template = ejs.compile(fs.readFileSync('./views/question-template.ejs', 'utf-8'));

    questions.forEach(function (question) {

        questionHtml += template({ question: question });
    });

        console.log('questions',questions);


    res.render('index', { questions: questions});
});
app.get('/questions/:id', (req, res) => {
    let id = req.params.id; // lấy giá trị id từ đường dẫn
    let data = fs.readFileSync('driving_test_questions.json');
    let questionss = JSON.parse(data);

    let questions = questionss.filter((q) => {

        return q.id == id;
    })[0]; // lấy câu hỏi có id tương ứng
    console.log('kdflkdf',questions)
    res.render('questions', { questions: questions });
});


app.get('/list', (req, res) => {
    let data = fs.readFileSync('driving_test_questions.json');
    let questions = JSON.parse(data);
    console.log('questions',questions);
    res.render('list', { questions: questions });
});




// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
