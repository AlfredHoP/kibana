/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { EuiComboBox } from '@elastic/eui';

export function FieldSelect({ fields, selectedField, onChange }) {

  const onFieldChange = (selectedFields) => {
    onChange({
      field: selectedFields.length > 0 ? selectedFields[0].value : null
    });
  };

  const groupFieldsByOrigin = () => {
    const fieldsByOriginMap = new Map();
    fields
      .forEach(field => {
        if (fieldsByOriginMap.has(field.origin)) {
          const fieldsList = fieldsByOriginMap.get(field.origin);
          fieldsList.push(field);
          fieldsByOriginMap.set(field.origin, fieldsList);
        } else {
          fieldsByOriginMap.set(field.origin, [field]);
        }
      });

    const optionGroups = [];
    fieldsByOriginMap.forEach((fieldsList, fieldOrigin) => {
      optionGroups.push({
        label: fieldOrigin,
        options: fieldsList
          .map(field => {
            return { value: field, label: field.label };
          })
          .sort((a, b) => {
            return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
          })
      });
    });

    optionGroups.sort((a, b) => {
      return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
    });

    return optionGroups;
  };

  const selectedOptions = selectedField
    ? [{ label: selectedField.label, value: selectedField }]
    : [];

  return (
    <EuiComboBox
      selectedOptions={selectedOptions}
      options={groupFieldsByOrigin()}
      onChange={onFieldChange}
      singleSelection={{ asPlainText: true }}
      isClearable={false}
      fullWidth
      placeholder="Select a field"
    />
  );
}

export const fieldShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  origin: PropTypes.oneOf(['join', 'source']).isRequired
});

FieldSelect.propTypes = {
  selectedField: fieldShape,
  fields: PropTypes.arrayOf(fieldShape).isRequired,
  onChange: PropTypes.func.isRequired,
};
