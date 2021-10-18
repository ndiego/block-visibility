/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { BaseControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, search, closeSmall } from '@wordpress/icons';
import { useRef } from '@wordpress/element';

/**
 *  This is a temporary inclusion until the SearchControl is added to WP core.
 *
 * @param  root0
 * @param  root0.className
 * @param  root0.onChange
 * @param  root0.value
 * @param  root0.label
 * @param  root0.placeholder
 * @param  root0.hideLabelFromVision
 * @param  root0.help
 * @param  root0.disabled
 */
function SearchControl( {
	className,
	onChange,
	value,
	label,
	placeholder = __( 'Search', 'block-visibility' ),
	hideLabelFromVision = true,
	help,
	disabled,
} ) {
	const instanceId = useInstanceId( SearchControl );
	const searchInput = useRef();
	const id = `components-search-control-${ instanceId }`;

	return (
		<BaseControl
			label={ label }
			id={ id }
			hideLabelFromVision={ hideLabelFromVision }
			help={ help }
			className={ classnames( className, 'components-search-control' ) }
		>
			<div className="components-search-control__input-wrapper">
				<input
					ref={ searchInput }
					className="components-search-control__input"
					id={ id }
					type="search"
					placeholder={ placeholder }
					onChange={ ( event ) => onChange( event.target.value ) }
					autoComplete="off"
					value={ value || '' }
					disabled={ disabled }
				/>
				<div className="components-search-control__icon">
					{ !! value && (
						<Button
							icon={ closeSmall }
							label={ __( 'Reset search', 'block-visibility' ) }
							onClick={ () => {
								onChange( '' );
								searchInput.current.focus();
							} }
						/>
					) }
					{ ! value && <Icon icon={ search } /> }
				</div>
			</div>
		</BaseControl>
	);
}

export default SearchControl;
