const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function getDrivingTestQuestions(i) {
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
        return test;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getDrivingTestQuestionsBatch() {
    const drivingTestQuestions = [];

    // Load 5 tests at a time
    for (let i = 1347; i < 1347+60; i += 5) {
        const promises = [];
        for (let j = 0; j < 5; j++) {
            const testNumber = i + j;
            promises.push(getDrivingTestQuestions(testNumber));
        }

        const tests = await Promise.all(promises);
        drivingTestQuestions.push(...tests);

        // Wait for 5-10 seconds before loading the next batch of tests
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 6 + 5) * 1000));
    }

    return drivingTestQuestions.filter(test => test !== null);
}

getDrivingTestQuestionsBatch().then((data) => {
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
