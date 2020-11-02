import { useState } from 'react';

// This is a custom hook!
export default function useForm(defaults) {
  const [values, setValues] = useState(defaults);

  function updateValue(e) {
    // Check if its a number and convert!
    let { value } = e.target;

    if (e.target.type === 'number') {
      value = parseInt(e.target.value);
    }

    setValues({
      // Copy the existing values into setValues
      ...values,
      // Update the new value that changed
      [e.target.name]: value,
    });
  }

  return { values, updateValue };
}
