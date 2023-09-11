/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Get all available field groups.
 *
 * @since 3.1.0
 * @return {string} All field groups
 */
export function getFieldGroups() {
	const groups = [
		{
			value: 'cart',
			label: __( 'Cart', 'block-visibility' ),
		},
		{
			value: 'customer-value',
			label: __( 'Customer History - Value', 'block-visibility' ),
		},
		{
			value: 'customer-quantity',
			label: __( 'Customer History - Quantity', 'block-visibility' ),
		},
		{
			value: 'customer-time',
			label: __( 'Customer History - Time', 'block-visibility' ),
		},
		{
			value: 'product',
			label: __( 'Product', 'block-visibility' ),
		},
	];

	return groups;
}

/**
 * Get all available fields.
 *
 * @since 3.1.0
 * @return {string} All fields
 */
export function getAllFields() {
	const valueOperators = [
		{
			value: 'equal',
			label: __( 'Is equal to', 'block-visibility' ),
		},
		{
			value: 'notEqual',
			label: __( 'Is not equal to', 'block-visibility' ),
		},
		{
			value: 'greaterThan',
			label: __( 'Is greater than', 'block-visibility' ),
		},
		{
			value: 'lessThan',
			label: __( 'Is less than', 'block-visibility' ),
		},
		{
			value: 'greaterThanEqual',
			label: __( 'Is greater or equal to', 'block-visibility' ),
		},
		{
			value: 'lessThanEqual',
			label: __( 'Is less than or equal to', 'block-visibility' ),
		},
	];

	const dateValueOperators = [
		{
			value: 'equal',
			label: __( 'Was placed on', 'block-visibility' ),
		},
		{
			value: 'notEqual',
			label: __( 'Was not placed on', 'block-visibility' ),
		},
		{
			value: 'greaterThan',
			label: __( 'Was placed after', 'block-visibility' ),
		},
		{
			value: 'lessThan',
			label: __( 'Was placed before', 'block-visibility' ),
		},
	];

	const dateValueSimplifiedOperators = [
		{
			value: 'equal',
			label: __( 'On', 'block-visibility' ),
		},
		{
			value: 'notEqual',
			label: __( 'Not on', 'block-visibility' ),
		},
		{
			value: 'greaterThan',
			label: __( 'After', 'block-visibility' ),
		},
		{
			value: 'lessThan',
			label: __( 'Before', 'block-visibility' ),
		},
	];

	const containsOperators = [
		{
			value: 'atLeastOne',
			label: __( 'At least one of the selected', 'block-visibility' ),
		},
		{
			value: 'all',
			label: __( 'All of the selected', 'block-visibility' ),
		},
		{
			value: 'none',
			label: __( 'None of the selected', 'block-visibility' ),
		},
	];

	const operatorPlaceholder = __( 'Select Condition…', 'block-visibility' );
	const orderTypePlaceholder = __( 'Select Order Type…', 'block-visibility' );
	const selectCategoryPlaceholder = __(
		'Select Product Category…',
		'block-visibility'
	);
	const selectProductPlaceholder = __(
		'Select Product…',
		'block-visibility'
	);

	const fields = [
		// Cart fields
		{
			value: 'cartContents',
			label: __( 'Cart Contents', 'block-visibility' ),
			group: 'cart',
			fields: [
				{
					type: 'subField',
					name: 'cartContents',
					valueType: 'select',
					options: [
						{
							value: 'empty',
							label: __( 'Is empty', 'block-visibility' ),
						},
						{
							value: 'notEmpty',
							label: __( 'Is not empty', 'block-visibility' ),
						},
						{
							value: 'containsProducts',
							label: __(
								'Contains (Products)',
								'block-visibility'
							),
						},
						{
							value: 'containsCategories',
							label: __(
								'Contains (Categories)',
								'block-visibility'
							),
						},
					],
					placeholder: operatorPlaceholder,
					triggerReset: true,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: containsOperators,
					placeholder: operatorPlaceholder,
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyName: 'cartContents',
							dependencyValues: [
								'containsProducts',
								'containsCategories',
							],
						},
					],
				},
				{
					type: 'valueField',
					conditionalValueTypes: [
						{
							dependencyType: 'subField',
							dependencyValues: [
								'containsProducts',
								'containsCategories',
							],
							valueTypes: [
								{
									value: 'containsProducts',
									valueType: 'productsSelect',
									placeholder: selectProductPlaceholder,
								},
								{
									value: 'containsCategories',
									valueType: 'termsSelect',
									valueTypeVariant: 'product_cat',
									placeholder: selectCategoryPlaceholder,
								},
							],
						},
					],
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyValues: [
								'containsProducts',
								'containsCategories',
							],
						},
					],
				},
			],
		},
		{
			value: 'cartTotalQuantity',
			label: __( 'Total Products in Cart', 'block-visibility' ),
			group: 'cart',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'cartTotalValue',
			label: __( 'Total Cart Value', 'block-visibility' ),
			group: 'cart',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'cartProductQuantity',
			label: __( 'Quantity of Product in Cart', 'block-visibility' ),
			help: __(
				'Quantity applies to each selected product.',
				'block-visibility'
			),
			group: 'cart',
			fields: [
				{
					type: 'subField',
					name: 'products',
					valueType: 'productsSelect',
					placeholder: selectProductPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'cartCategoryQuantity',
			label: __( 'Quantity of Category in Cart', 'block-visibility' ),
			help: __(
				'Quantity of products in cart which belong to the selected category. Quantity applies to each category.',
				'block-visibility'
			),
			group: 'cart',
			fields: [
				{
					type: 'subField',
					name: 'categories',
					valueType: 'termsSelect',
					valueTypeVariant: 'product_cat',
					placeholder: selectCategoryPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		// Customer fields
		{
			value: 'customerTotalSpent',
			label: __( 'Total Spent', 'block-visibility' ),
			group: 'customer-value',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'customerAverageOrderValue',
			label: __( 'Average Order Value', 'block-visibility' ),
			group: 'customer-value',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'customerTotalOrders',
			label: __( 'Total Orders', 'block-visibility' ),
			group: 'customer-quantity',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'customerQuantityProductOrdered',
			label: __( 'Quantity of Product Ordered', 'block-visibility' ),
			help: __(
				'Quantity applies to each selected product.',
				'block-visibility'
			),
			group: 'customer-quantity',
			fields: [
				{
					type: 'subField',
					name: 'products',
					valueType: 'productsSelect',
					placeholder: selectProductPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'customerQuantityCategoryOrdered',
			label: __( 'Quantity of Category Ordered', 'block-visibility' ),
			help: __(
				'Quantity of products ordered which belong to the category. Applies to each selected category.',
				'block-visibility'
			),
			group: 'customer-quantity',
			fields: [
				{
					type: 'subField',
					name: 'categories',
					valueType: 'termsSelect',
					valueTypeVariant: 'product_cat',
					placeholder: selectCategoryPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'customerTimeSinceOrder',
			label: __( 'Time Since Order', 'block-visibility' ),
			help: __(
				"The number of days since the customer's order was placed.",
				'block-visibility'
			),
			group: 'customer-time',
			fields: [
				{
					type: 'subField',
					name: 'orderType',
					valueType: 'select',
					options: [
						{
							value: 'first',
							label: __( 'First order', 'block-visibility' ),
						},
						{
							value: 'last',
							label: __( 'Last order', 'block-visibility' ),
						},
					],
					placeholder: orderTypePlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'customerTimeSinceProductOrdered',
			label: __( 'Time Since Product Ordered', 'block-visibility' ),
			help: __(
				'The number of days since the product was ordered. Applies to each selected product.',
				'block-visibility'
			),
			group: 'customer-time',
			fields: [
				{
					type: 'subField',
					name: 'orderType',
					valueType: 'select',
					options: [
						{
							value: 'first',
							label: __( 'First order', 'block-visibility' ),
						},
						{
							value: 'last',
							label: __( 'Last order', 'block-visibility' ),
						},
					],
					placeholder: orderTypePlaceholder,
				},
				{
					type: 'subField',
					name: 'products',
					valueType: 'productsSelect',
					placeholder: selectProductPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasMultipleSubFields: true,
			hasSimplifiedLayout: true,
		},
		{
			value: 'customerTimeSinceCategoryOrdered',
			label: __( 'Time Since Category Ordered', 'block-visibility' ),
			help: __(
				'The number of days since the category was ordered. Applies to each selected category.',
				'block-visibility'
			),
			group: 'customer-time',
			fields: [
				{
					type: 'subField',
					name: 'orderType',
					valueType: 'select',
					options: [
						{
							value: 'first',
							label: __( 'First order', 'block-visibility' ),
						},
						{
							value: 'last',
							label: __( 'Last order', 'block-visibility' ),
						},
					],
					placeholder: orderTypePlaceholder,
				},
				{
					type: 'subField',
					name: 'categories',
					valueType: 'termsSelect',
					valueTypeVariant: 'product_cat',
					placeholder: selectCategoryPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasMultipleSubFields: true,
			hasSimplifiedLayout: true,
		},
		{
			value: 'customerDateOfOrder',
			label: __( 'Date of Order', 'block-visibility' ),
			group: 'customer-time',
			fields: [
				{
					type: 'subField',
					valueType: 'select',
					options: [
						{
							value: 'first',
							label: __( 'First order', 'block-visibility' ),
						},
						{
							value: 'last',
							label: __( 'Last order', 'block-visibility' ),
						},
					],
					placeholder: orderTypePlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: dateValueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'date',
				},
			],
		},
		{
			value: 'customerDateOfProductOrdered',
			label: __( 'Date of Product Ordered', 'block-visibility' ),
			group: 'customer-time',
			fields: [
				{
					type: 'subField',
					name: 'orderType',
					valueType: 'select',
					options: [
						{
							value: 'first',
							label: __( 'First ordered', 'block-visibility' ),
						},
						{
							value: 'last',
							label: __( 'Last ordered', 'block-visibility' ),
						},
					],
					placeholder: orderTypePlaceholder,
				},
				{
					type: 'subField',
					name: 'products',
					valueType: 'productsSelect',
					placeholder: selectProductPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: dateValueSimplifiedOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'date',
				},
			],
			hasMultipleSubFields: true,
		},
		{
			value: 'customerDateOfCategoryOrdered',
			label: __( 'Date of Category Ordered', 'block-visibility' ),
			group: 'customer-time',
			fields: [
				{
					type: 'subField',
					name: 'orderType',
					valueType: 'select',
					options: [
						{
							value: 'first',
							label: __( 'First ordered', 'block-visibility' ),
						},
						{
							value: 'last',
							label: __( 'Last ordered', 'block-visibility' ),
						},
					],
					placeholder: orderTypePlaceholder,
				},
				{
					type: 'subField',
					name: 'categories',
					valueType: 'termsSelect',
					valueTypeVariant: 'product_cat',
					placeholder: selectCategoryPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: dateValueSimplifiedOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'date',
				},
			],
			hasMultipleSubFields: true,
		},
		// Product fields
		{
			value: 'productInventory',
			label: __( 'Product Inventory', 'block-visibility' ),
			group: 'product',
			fields: [
				{
					type: 'subField',
					name: 'products',
					valueType: 'productSelect',
					placeholder: selectProductPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'select',
					options: [
						{
							value: 'inStock',
							label: __( 'Is in stock', 'block-visibility' ),
						},
						{
							value: 'outOfStock',
							label: __( 'Is out of stock', 'block-visibility' ),
						},
						{
							value: 'onBackorder',
							label: __( 'Is on backorder', 'block-visibility' ),
						},
					],
					placeholder: __(
						'Select Inventory Status…',
						'block-visibility'
					),
				},
			],
		},
		{
			value: 'productQuantityInStock',
			label: __( 'Quantity of Product in Stock', 'block-visibility' ),
			group: 'product',
			fields: [
				{
					type: 'subField',
					valueType: 'productSelect',
					placeholder: selectProductPlaceholder,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'number',
				},
			],
			hasSimplifiedLayout: true,
		},
	];

	return fields;
}

/**
 * Get all perpared fields. This takes the available fields and puts them in the
 * proper field groups.
 *
 * @since 3.1.0
 * @return {string} All fields perpared in their respective field groups
 */
export function getGroupedFields() {
	const groups = getFieldGroups();
	const fields = getAllFields();
	const preparedFields = [];

	groups.forEach( ( group ) => {
		const groupValue = group?.value ?? '';
		const groupLabel = group?.label ?? '';

		const groupOptions = fields.filter(
			( field ) => field.group === groupValue
		);

		preparedFields.push( {
			value: groupValue,
			label: groupLabel,
			options: groupOptions,
		} );
	} );

	return preparedFields;
}
