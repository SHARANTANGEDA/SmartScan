const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = (data) => {
  let errors = {};
  data.patient = !isEmpty(data.patient) ? data.patient : '';
  if(Validator.isEmpty(data.patient)) {
    errors.patient = 'MR No of patient is Required';
  }
  return{errors,
    isValid: isEmpty(errors)
  };
};
