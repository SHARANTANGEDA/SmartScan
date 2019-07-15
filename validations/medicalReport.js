const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = (data) => {
  let errors = {};
  data.reportDetailed = !isEmpty(data.reportDetailed) ? data.reportDetailed : '';

  if(Validator.isEmpty(data.reportDetailed)) {
    errors.emailId = 'Please enter the medical report';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}