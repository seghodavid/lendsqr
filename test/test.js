const app = require('../index')
const request = require('supertest')

describe('GET /' , () => {
    it("Responds with Hello from Lendsqr", (done) => {
     request(app).get("/").expect("Hello from Lendsqr", done);
    });
})