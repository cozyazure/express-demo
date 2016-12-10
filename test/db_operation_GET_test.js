const should = require('should');
const assert = require('assert');
const request = require('supertest');

const db = require('../config/db_connection').development;

describe('db_operation_GET_test', () => {
    before((done) => {
        mockserver = require('../mockserver');
        done();
    });
    describe('GET without timestamp', function() {
        it('should return JonSnow with latest value', function(done) {
            request(mockserver)
                .get('/api/object/JonSnow')
                .expect(200)
                .end((error, response) => {
                    response.body.should.have.property('Message', 'Successfully retrieved!')
                    response.body.should.have.property('KeyValuePair', { JonSnow: 'I know, but I still love her' })
                    response.body.should.have.property('TimeStamp', 1000000000006)
                    done();
                })
        })
    });
    describe('GET with exact timestamp=10000000000000', function() {
        it('should return the first row, where timestamp is 100000000000', function(done) {
            request(mockserver)
                .get('/api/object/JonSnow?timestamp=1000000000000')
                .expect(200)
                .end((error, response) => {
                    response.body.should.have.property('Message', 'Successfully retrieved!')
                    response.body.should.have.property('KeyValuePair', { JonSnow: 'You know nothing' })
                    response.body.should.have.property('TimeStamp', 1000000000000)
                    done();
                })
        })
    });
    describe('GET with timestamp=1000000000004', function() {
        it('should return the row where timestamp is 1000000000003 ', function(done) {
            request(mockserver)
                .get('/api/object/JonSnow?timestamp=1000000000004')
                .expect(200)
                .end((error, response) => {
                    response.body.should.have.property('Message', 'Successfully retrieved!')
                    response.body.should.have.property('KeyValuePair', { JonSnow: 'And now my watch begins' })
                    response.body.should.have.property('TimeStamp', 1000000000003)
                    done();
                })
        })
    });
    describe('GET with no existing key', function() {
        it('should return 404 and no such key exists', function(done) {
            request(mockserver)
                .get('/api/object/gibearasdsdasda')
                .expect(404)
                .end((error, response) => {
                    response.body.should.have.property('ErrorMessage', 'No such key exists')
                    done();
                })
        })
    });
    describe('GET with timestamp earlier than 1000000000000', function() {
        it('should return 404 and no such key exists', function(done) {
            request(mockserver)
                .get('/api/object/JonSnow?timestamp=100')
                .expect(404)
                .end((error, response) => {
                    response.body.should.have.property('ErrorMessage', 'No such key exists')
                    done();
                })
        })
    });
})