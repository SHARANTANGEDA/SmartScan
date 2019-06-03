const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = (data) => {
  let errors = {};
  console.log(data.name)
  data.name = !isEmpty(data.name) ? data.name : '';
  if(Validator.isEmpty(data.name)) {
    errors.title = 'Name is required';
  }
  return{errors,
    isValid: isEmpty(errors)
  };
};
