/**
 * External dependencies
 */
import { assign } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Disabled,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Slot,
	TextControl,
} from '@wordpress/components';
import { moreVertical, pencil } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Rule from './rule';

/**
 * Handles the rule sets.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function RuleSets( props ) {
	const {
		ruleSet,
		ruleSetIndex,
		ruleSets,
		controlName,
		controlAtts,
		setControlAtts,
	} = props;

	const title = ruleSet?.title ?? '';
	const displayTitle = title ? title : __( 'Rule Set', 'block-visibility' );
	const enable = ruleSet?.enable ?? true;
	const rules = ruleSet?.rules ?? [];

	if ( rules.length === 0 ) {
		rules.push( { field: '' } );
	}

	function duplicateRuleSet() {
		const newRuleSets = [ ...ruleSets, ruleSet ];

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets: [ ...newRuleSets ] } )
		);
	}

	function removeRuleSet() {
		const newRuleSets = ruleSets.filter(
			( value, index ) => index !== ruleSetIndex
		);

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets: [ ...newRuleSets ] } )
		);
	}

	function addRule() {
		const newRuleSets = [ ...ruleSets ];
		const newRules = [ ...ruleSet.rules, { field: '' } ];

		newRuleSets[ ruleSetIndex ] = assign(
			{ ...ruleSet },
			{ rules: newRules }
		);

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets: [ ...newRuleSets ] } )
		);
	}

	const setAttribute = ( attribute, value ) => {
		const newRuleSet = { ...ruleSet };
		const newRuleSets = [ ...ruleSets ];

		newRuleSet[ attribute ] = value;
		newRuleSets[ ruleSetIndex ] = newRuleSet;

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets: [ ...newRuleSets ] } )
		);
	};

	const editTitleDropdown = (
		<DropdownMenu
			label={ __( 'Edit', 'block-visibility' ) }
			icon={ pencil }
			popoverProps={ {
				className: 'block-visibility__control-popover edit-title',
				focusOnMount: 'container',
			} }
		>
			{ () => (
				<TextControl
					value={ title }
					label={ __( 'Rule set title', 'block-visibility' ) }
					placeholder={ __( 'Rule Set', 'block-visibility' ) }
					onChange={ ( value ) => setAttribute( 'title', value ) }
				/>
			) }
		</DropdownMenu>
	);

	const removeLabel =
		ruleSets.length <= 1
			? __( 'Clear rule set', 'block-visibility' )
			: __( 'Remove rule set', 'block-visibility' );

	const optionsDropdown = (
		<DropdownMenu
			className="options-dropdown"
			label={ __( 'Options', 'block-visibility' ) }
			icon={ moreVertical }
			popoverProps={ { focusOnMount: 'container' } }
		>
			{ ( { onClose } ) => (
				<>
					<Slot name="RuleSetOptionsTop" />

					<MenuGroup label={ __( 'Tools', 'block-visibility' ) }>
						<Slot name="RuleSetMoreSettingsTools" />
						<MenuItem
							onClick={ () => setAttribute( 'enable', ! enable ) }
						>
							{ enable
								? __( 'Disable', 'block-visibility' )
								: __( 'Enable', 'block-visibility' ) }
						</MenuItem>
						<MenuItem
							className="more-settings__tools-duplicate"
							onClick={ () => {
								duplicateRuleSet();
								onClose();
							} }
						>
							{ __( 'Duplicate', 'block-visibility' ) }
						</MenuItem>
					</MenuGroup>

					<Slot name="RuleSetOptionsMiddle" />

					<MenuGroup>
						<MenuItem
							onClick={ () => {
								removeRuleSet();
								onClose();
							} }
						>
							{ removeLabel }
						</MenuItem>
					</MenuGroup>

					<Slot name="RuleSetOptionsBottom" />
				</>
			) }
		</DropdownMenu>
	);

	let ruleSetControls = (
		<div className="rule-set__fields">
			<div className="rule-set__rules">
				{ rules.map( ( rule, ruleIndex ) => {
					return (
						<Rule
							key={ ruleIndex }
							rule={ rule }
							ruleIndex={ ruleIndex }
							ruleSet={ ruleSet }
							ruleSetIndex={ ruleSetIndex }
							ruleSets={ ruleSets }
							{ ...props }
						/>
					);
				} ) }
			</div>
			<div className="rule-set__add-rule">
				<Button onClick={ () => addRule() } isLink>
					{ __( 'Add rule', 'block-visibility' ) }
				</Button>
			</div>
		</div>
	);

	if ( ! enable ) {
		ruleSetControls = <Disabled>{ ruleSetControls }</Disabled>;
	}

	return (
		<div
			key={ ruleSetIndex }
			className={ classnames( 'rule-sets__rule-set', {
				disabled: ! enable,
			} ) }
		>
			<div className="rule-set__header section-header">
				<div className="section-header__title">
					<span>{ displayTitle }</span>
					{ editTitleDropdown }
				</div>
				<div className="section-header__toolbar">
					{ optionsDropdown }
				</div>
			</div>
			{ ruleSetControls }
		</div>
	);
}
