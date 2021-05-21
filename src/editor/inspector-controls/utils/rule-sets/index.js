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
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { settings } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../../../../utils/icons';
import Rule from './rule';

/**
 * Handles the rule sets.
 *
 * @since 1.9.0
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
	const enable = ruleSet?.enable ?? true;
	const rules = ruleSet?.rules ?? [];

	if ( rules.length === 0 ) {
		rules.push( { field: '' } );
	}

	const ruleSetTitle = title
		? title
		: __( 'Rule Set', 'block-visibility' );

	const removeRuleSet = () => {
		const newRuleSets = ruleSets.filter(
			( value, index ) => index !== ruleSetIndex
		);

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets: newRuleSets } )
		);
	};

	const deleteRuleSetButton = (
		<Button
			label={
				ruleSets.length <= 1
					? __( 'Clear Rule Set', 'block-visibility' )
					: __( 'Delete Rule Set', 'block-visibility' )
			}
			icon={ icons.trash }
			className="toolbar--delete"
			onClick={ () => removeRuleSet() }
			isSmall
		/>
	);

	const setAttribute = ( attribute, value ) => {
		ruleSet[ attribute ] = value;
		ruleSets[ ruleSetIndex ] = ruleSet;

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets } )
		);
	};

	const addRule = () => {
		ruleSet.rules.push( { field: '' } );
		ruleSets[ ruleSetIndex ] = ruleSet;

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets } )
		);
	};

	let ruleSetControls = (
		<>
			<div className="rule-sets__rule-set--rules">
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
			<div className="rule-sets__rule-set--add">
				<Button onClick={ () => addRule() } isLink>
					{ __( 'Add rule', 'block-visibility' ) }
				</Button>
			</div>
		</>
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
			<div className="rule-sets__rule-set--heading">
				<span className="heading__title">{ ruleSetTitle }</span>
				<div className="heading__toolbar">
					<DropdownMenu
						label={ __(
							'Rule Set Settings',
							'block-visibility'
						) }
						icon={ settings }
						toggleProps={ {
							className: 'heading__toolbar--settings',
						} }
						popoverProps={ {
							className:
								'block-visibility__control-popover schedule-settings',
							focusOnMount: 'container',
							noArrow: false,
						} }
					>
						{ () => (
							<>
								<h3>
									{ __(
										'Rule Set Settings',
										'block-visibility'
									) }
								</h3>
								<TextControl
									value={ title }
									label={ __(
										'Rule Set Title',
										'block-visibility'
									) }
									placeholder={ __(
										'Rule Set',
										'block-visibility'
									) }
									help={ __(
										'Optionally set a descriptive rule set title.',
										'block-visibility'
									) }
									onChange={ ( value ) =>
										setAttribute( 'title', value )
									}
								/>
								<ToggleControl
									label={ __(
										'Enable rule set',
										'block-visibility'
									) }
									checked={ enable }
									onChange={ () =>
										setAttribute( 'enable', ! enable )
									}
									help={ __(
										'Enable or disable the selected rule set.',
										'block-visibility'
									) }
								/>
							</>
						) }
					</DropdownMenu>
					{ deleteRuleSetButton }
				</div>
			</div>
			{ ruleSetControls }
		</div>
	);
}
