const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = (data) => {
  let errors = {};

  data.emailId = !isEmpty(data.emailId) ? data.emailId : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.role = !isEmpty(data.role) ? data.role : '';

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if(Validator.isEmpty(data.role)) {
    errors.departmentName = 'Please select the role'
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}