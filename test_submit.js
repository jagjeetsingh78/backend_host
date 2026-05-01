const http = require('http');

const data = JSON.stringify({
  userId: "1",
  quizId: "1",
  answers: [
    { questionId: 1, optionId: "2" }
  ]
});

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/quizzes/submit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${body}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
