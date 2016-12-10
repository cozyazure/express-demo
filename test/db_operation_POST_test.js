const should = require('should');
const assert = require('assert');
const request = require('supertest');

const db = require('../config/db_connection').development;

describe('db_operation_POST_test', () => {
    const url = 'localhost:3000/api/object';
    before((done) => {
        done();
    });
    describe('POST a keyvalue pair, with "mykey" as key and "myvalue1" as value', function() {
        it('should return a 200 successful operation', function(done) {
            var keyvaluepair = {
                'mykey': 'myvalue1'
            };
            request(url)
                .post('')
                .send(keyvaluepair)
                .expect(200)
                .end((error, response) => {
                    response.body.should.have.property('Message', 'Successfully inserted!')
                    response.body.should.have.property('KeyValuePair', keyvaluepair)
                    response.body.should.have.property('TimeStamp')
                    done();
                })
        })
    });
    describe('POST a keyvalue pair, with "mykey" as key and "myvalue2" as value', function() {
        it('the lastest value of "myKey" should be updated as "myvalue2"', function(done) {
            var keyvaluepair = {
                'mykey': 'myvalue2'
            };
            request(url)
                .post('')
                .send(keyvaluepair)
                .expect(200)
                .end((error, response) => {
                    response.body.should.have.property('Message', 'Successfully inserted!')
                    response.body.should.have.property('KeyValuePair', keyvaluepair)
                    response.body.should.have.property('TimeStamp')
                    done();
                })
        })
    });
    describe('POST a keyvalue pair, with "myJson" as key and value is of valid json', function() {
        it('should return a 200 successful operation', function(done) {
            var keyvaluepair = {
                'myJson': {
                    "JonSnow": {
                        "HeroName": "Jon Snow, King of North",
                        "HeroAge": "25",
                        "HeroAbility": [{
                            "AbilityName": "Dodging the arrow!",
                            "Cooldown": "Instant"
                        }, {
                            "AbilityName": "Slay the whitewalkers",
                            "Cooldown": "30 seconds"
                        }]
                    }
                }
            };
            request(url)
                .post('')
                .send(keyvaluepair)
                .expect(200)
                .end((error, response) => {
                    response.body.should.have.property('Message', 'Successfully inserted!')
                    response.body.should.have.property('KeyValuePair', keyvaluepair)
                    response.body.should.have.property('TimeStamp')
                    done();
                })
        })
    });

})