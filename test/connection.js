const should = require('should');
const assert = require('assert');
const request = require('supertest');

const db = require('../config/db_connection').development;

describe('connection', () => {
    const url = 'localhost:3000/api/object';
    before((done) => {
        console.log('before executed');
        done();
    });
    describe('default GET without timestamp', function() {
        it('should return a key', function(done) {
            request(url)
                .get('/JonSnow')
                .expect(200)
                .end((error, response) => {
                    response.body.should.have.property('Message', 'Successfully retrieved!')
                    response.body.should.have.property('KeyValuePair', { JonSnow: 'you know nothing really' })
                    response.body.should.have.property('TimeStamp', 1481250485)
                    done();
                })
        })
    })
})