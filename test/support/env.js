process.env.NODE_ENV = 'test';
const chai = require('chai');
chai.config.showDiff = false;
global.should = chai.should();
