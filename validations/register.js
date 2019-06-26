const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = (data) => {
  let errors = {};
  data.emailId = !isEmpty(data.emailId) ? data.emailId : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.repassword = !isEmpty(data.repassword) ? data.repassword : '';

  if (Validator.isEmpty(data.emailId)) {
    errors.emailId = 'Unique lab name is required';
  }

  if(Validator.isEmpty(data.firstName)) {
    errors.firstName = 'Please enter First Name'
  }
  if(Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Please enter Last Name'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.repassword)) {
    errors.repassword = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.repassword)) {
    errors.repassword = 'Passwords must match';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}