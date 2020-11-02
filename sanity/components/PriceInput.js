/* eslint-disable react/prop-types */
import React from 'react';
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event';

function createPatchFromValue(value) {
  return PatchEvent.from(value === '' ? unset() : set(Number(value)));
}

const formatMoney = Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
}).format;

const PriceInput = ({
  type: { title, description, name },
  value,
  onChange,
  inputComponent,
}) => (
  <div>
    <h2>
      {title} {value && ` - ${formatMoney(value / 100)}`}
    </h2>
    <p>{description}</p>
    <input
      type={name}
      value={value}
      onChange={(event) => onChange(createPatchFromValue(event.target.value))}
      ref={inputComponent}
    />
  </div>
);

PriceInput.focus = function () {
  this._inputElement.focus();
};

export default PriceInput;
