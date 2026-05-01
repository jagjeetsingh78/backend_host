const http = require('http');

const data = JSON.stringify({
  userId: 1,
  quizId: 1,
  answers: [
    { questionId: 1, optionId: 1 },
    { questionId: 2, optionId: 5 },
    { questionId: 3, "optionId": 10 }
  ]
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/quizzes/submit',
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
