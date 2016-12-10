const should = require('should');
const assert = require('assert');
const request = require('supertest');

const db = require('../config/db_connection').development;

describe('db_sanitization_test', () => {
    const url = 'localhost:3000/api/object';
    before((done) => {
        done();
    });
    describe('POST an empty payload', function() {
        it('should return an error message with "Please submit at least one key value pair in json form"', function(done) {
            var keyvaluepair = {};
            request(url)
                .post('')
                .send(keyvaluepair)
                .expect(500)
                .end((error, response) => {
                    response.body.should.have.property('ErrorMessage', 'Please submit at least one key value pair in json form.')
                    done();
                })
        })
    });
    describe('POST a keyvalue pair with more than two keys', function() {
        it('should return an error message with "Please submit only one key value pair."', function(done) {
            var keyvaluepair = {
                'key1': "value1",
                'key2': "value2"
            };
            request(url)
                .post('')
                .send(keyvaluepair)
                .expect(500)
                .end((error, response) => {
                    response.body.should.have.property('ErrorMessage', 'Please submit only one key value pair.')
                    done();
                })
        })
    });
    describe('POST a keyvalue pair with the value not being a type of string nor a valid json object', function() {
        it('should return an error message with "Type of value submitted must be either a string or a json object."', function(done) {
            var keyvaluepair = {
                'key1': 123
            };
            request(url)
                .post('')
                .send(keyvaluepair)
                .expect(500)
                .end((error, response) => {
                    response.body.should.have.property('ErrorMessage', 'Type of value submitted must be either a string or a json object.')
                    done();
                })
        })
    });
    describe('POST a keyvalue pair with the an json value but the json is null object', function() {
        it('should return an error message with "The value json object cannot be null or empty object."', function(done) {
            var keyvaluepair = {
                'key1': {}
            };
            request(url)
                .post('')
                .send(keyvaluepair)
                .expect(500)
                .end((error, response) => {
                    response.body.should.have.property('ErrorMessage', 'The value json object cannot be null or empty object.')
                    done();
                })
        })
    });
    describe('POST a keyvalue pair with a key that has whitespaces', function() {
        it('should return an error message with "The key shouldn not have whitespaces."', function(done) {
            var keyvaluepair = {
                'key 1': 'value1'
            };
            request(url)
                .post('')
                .send(keyvaluepair)
                .expect(500)
                .end((error, response) => {
                    response.body.should.have.property('ErrorMessage', 'The key shouldn not have whitespaces.')
                    done();
                })
        })
    });

})