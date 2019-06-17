const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = (data) => {
  let errors = {};

  data.category = !isEmpty(data.category) ? data.category : '';
  data.search = !isEmpty(data.search) ? data.search : '';

  if (Validator.isEmpty(data.category)) {
    errors.category = 'Choose proper category';
  }

  if (Validator.isEmpty(data.search)) {
    errors.search = 'please enter key to search';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}