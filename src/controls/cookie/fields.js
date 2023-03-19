/**
 * WordPress dependencies
 */
 import { __ } from '@wordpress/i18n';

 /**
  * Get all available fields.
  *
  * @since 3.0.0
  * @return {string} All fields
  */
 export function getAllFields() {
     const valueOperators = [
         {
             value: 'notEmpty',
             label: __( 'Has any value', 'block-visibility' ),
             disableValue: true,
         },
         {
             value: 'empty',
             label: __(
                 'Has no value (Does not exist)',
                 'block-visibility'
             ),
             disableValue: true,
         },
         {
             value: 'equal',
             label: __( 'Value is equal to', 'block-visibility' ),
         },
         {
             value: 'notEqual',
             label: __( 'Value is not equal to', 'block-visibility' ),
         },
         {
             value: 'contains',
             label: __( 'Value contains', 'block-visibility' ),
         },
         {
             value: 'notContain',
             label: __( 'Value does not contain', 'block-visibility' ),
         },
     ];
 
     const operatorPlaceholder = __(
         'Select Condition…',
         'block-visibility'
     );
 
     const fields = [
         {
             type: 'ruleField',
             valueType: 'text',
             placeholder: __( 'Enter Cookie Name…', 'block-visibility' ),
         },
         {
             type: 'operatorField',
             valueType: 'select',
             options: valueOperators,
             placeholder: operatorPlaceholder,
         },
         {
             type: 'valueField',
             valueType: 'text',
             placeholder: __( 'Enter Cookie Value…', 'block-visibility' ),
             displayConditions: [
                 {
                     dependencyType: 'operatorField',
                     dependencyValues: [
                         'equal',
                         'notEqual',
                         'contains',
                         'notContain',
                     ],
                 },
             ],
         },
     ];
 
     return fields;
 }
 