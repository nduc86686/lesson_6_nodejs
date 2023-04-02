const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function getDrivingTestQuestions() {
    const drivingTestQuestions = [];

    // Loop through all 60 tests
    for (let i = 1347; i < 1347+60; i++) {
        const url = `https://vnexpress.net/interactive/2016/thi-sat-hach-lai-xe/de-thi-${i}-6.html`;

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const questions = [];

            // Loop through all 35 questions in each test
            for (let j = 1; j <= 35; j++) {
                const question = {};
                question.id = `question_${j}`;
                question.content = $(`#question_${j} .noidung_cauhoi`).text().trim();

                // Check if the question contains an image
                const $image = $(`#question_${j} .noidung_cauhoi img`);
                if ($image.length > 0) {
                    const imageUrl = $image.attr('src');
                    question.image = imageUrl;
                }

                const options = [];
                $(`#question_${j} .noidung_dapan li`).each(function () {
                    const option = {};
                    option.id = $(this).find('input').attr('data-id');
                    option.content = $(this).find('span').text().trim();
                    options.push(option);
                });

                question.options = options;
                questions.push(question);
            }

            const test = {};
            test.id = i;
            test.questions = questions;
            drivingTestQuestions.push(test);
        } catch (error) {
            console.error(error);
        }
    }

    return drivingTestQuestions;
}

getDrivingTestQuestions().then((data) => {
    const jsonString = JSON.stringify(data);
    fs.writeFile('driving_test_questions.json', jsonString, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data written to file');
    });
}).catch((error) => {
    console.error(error);
});
