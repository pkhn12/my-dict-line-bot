require('dotenv').config();
require('@babel/register')({extensions: ['.es6', '.es', '.js', '.ts']});
require('@babel/polyfill');
require('./src/index');