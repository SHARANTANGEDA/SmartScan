const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = (data) => {
  let errors = {};

  data.orgEmail = !isEmpty(data.orgEmail) ? data.orgEmail : '';
  data.centreName = !isEmpty(data.centreName) ? data.centreName : '';
  data.adminId = !isEmpty(data.adminId) ? data.adminId : '';
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.repassword = !isEmpty(data.repassword) ? data.repassword : '';
  data.short = !isEmpty(data.short) ? data.short : ''
  data.centreCode = !isEmpty(data.centreCode) ? data.centreCode : ''

  if (Validator.isEmpty(data.adminId)) {
    errors.adminId = 'admin user name is required';
  }
  if (Validator.isEmpty(data.centreName)) {
    errors.centreName = 'Centre name is required';
  }
  if(Validator.isEmpty(data.firstName)) {
    errors.firstName = 'Enter first Name'
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Enter Last Name'
  }

  if (Validator.isEmpty(data.orgEmail)) {
    errors.orgEmail = 'organization email is required to send information';
  }

  if (!Validator.isEmail(data.orgEmail)) {
    errors.orgEmail = 'Email is invalid';
  }

  if(Validator.isEmpty(data.short)) {
    errors.short = 'Please enter the shortcut'
  }
  if(Validator.isEmpty(data.centreCode)) {
    errors.category = 'Please select centre code'

  }

  if (!Validator.isLength(data.short, { min: 2, max: 5 })) {
    errors.short = 'shortcut must be between 2 to 5 characters';
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