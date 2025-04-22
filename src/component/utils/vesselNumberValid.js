export function validateVesselNumber(vesselNumber) {
    if (typeof vesselNumber !== 'string') {
      return { isValid: false, error: 'Vessel number must be a string.' };
    }
  
    if (vesselNumber.trim() === '') {
      return { isValid: false, error: 'Vessel number is required.' };
    }
  
    const vesselNumberRegex = /^[A-Z]{2}([\s-]?)[0-9A-Z]+$/i;
  
    if (!vesselNumberRegex.test(vesselNumber)) {
      return {
        isValid: false,
        error:
          'Must start with two letters followed by alphanumeric characters (optional space or dash).',
      };
    }
  
    return { isValid: true, error: '' };
  }

//   const vesselNumber1 = "MD 1234 AB";
// const vesselNumber2 = "NY-5678CD";
// const vesselNumber3 = "CA98765";
// const vesselNumber4 = "12345";

// console.log(validateVesselNumber(vesselNumber1)); // false
// console.log(validateVesselNumber(vesselNumber2)); // true
// console.log(validateVesselNumber(vesselNumber3)); // true
// console.log(validateVesselNumber(vesselNumber4));// true