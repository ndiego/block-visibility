/**
 * External dependencies
 */
import { findKey } from 'lodash';
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, render } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';
import {
	Spinner,
	TabPanel,
	Slot,
	SlotFillProvider,
	withFilters,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import Masthead from './masthead';
import Footer from './footer';
import VisibilityControls from './visibility-controls';
import BlockManager from './block-manager';
import PluginSettings from './plugin-settings';
import Ads from './ads';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalSettings = withFilters(
	'blockVisibility.MainSettings'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Renders the Block Visibility settings page
 *
 * @since 1.0.0
 */
function Settings() {
	const [ status, setStatus ] = useState( 'idle' );
	const [ settings, setSettings ] = useState( null );
	const [ variables, setVariables ] = useState( null );

	useEffect( () => {
		// Generic fetch function to retrieve settings and variables on render.
		async function fetchData( route, setData ) {
			setStatus( 'fetching' );

			// blockVisibilityRestUrl is provided by wp_add_inline_script.
			const fetchUrl = `${ blockVisibilityRestUrl }block-visibility/v1/${ route }`; // eslint-disable-line
			const response = await fetch( fetchUrl, { method: 'GET' } ); // eslint-disable-line

			if ( response.ok ) {
				const data = await response.json();
				setData( data );
				setStatus( 'fetched' );
			} else {
				setStatus( 'error' );
			}
		}

		fetchData( 'settings', setSettings );
		fetchData( 'variables', setVariables );
	}, [] );

	function onSetSettings( newSettings ) {
		setSettings( newSettings );
	}

	// Display loading/error message while settings are being fetched.
	if ( ! settings || ! variables || status !== 'fetched' ) {
		return (
			<>
				{ status === 'error' && (
					<div className="notice notice-error">
						<p>
							{ __(
								'Something went wrong when trying to load the Block Visibility settings. Try refreshing the page. If the error persists, please contact support.',
								'block-visibility'
							) }
						</p>
					</div>
				) }
				<div className="loading-settings">
					<Spinner />
					<span className="description">
						{ __( 'Loading settings…', 'block-visibility' ) }
					</span>
				</div>
			</>
		);
	}

	const settingTabs = [
		{
			name: 'plugin-settings',
			title: __( 'General Settings', 'block-visibility' ),
			className: 'setting-tabs__plugin-settings',
		},
		{
			name: 'visibility-controls',
			title: __( 'Visibility Controls', 'block-visibility' ),
			className: 'setting-tabs__visibility-controls',
		},
		{
			name: 'block-manager',
			title: __( 'Block Manager', 'block-visibility' ),
			className: 'setting-tabs__blocks-manager',
		},
	];

	applyFilters( 'blockVisibility.SettingTabs', settingTabs );

	// Switch the default settings tab based on the URL tab query
	const urlParams = new URLSearchParams( window.location.search );
	const requestedTab = urlParams.get( 'tab' );
	const initialTab = findKey( settingTabs, [ 'name', requestedTab ] )
		? requestedTab
		: 'plugin-settings';

	// Update URL based on the current tab
	const updateUrl = ( tabName ) => {
		urlParams.set( 'tab', tabName );

		if ( history.pushState ) { // eslint-disable-line
			const newUrl =
				window.location.protocol +
				'//' +
				window.location.host +
				window.location.pathname +
				'?' +
				urlParams.toString() +
				window.location.hash;

			window.history.replaceState( { path: newUrl }, '', newUrl );
		} else {
			window.location.search = urlParams.toString();
		}
	};

	return (
		<SlotFillProvider>
			<AdditionalSettings />
			<Masthead variables={ variables } />
			<TabPanel
				className={ classnames( {
					'setting-tabs': true,
					is_pro: variables?.is_pro,
				} ) }
				activeClass="active-tab"
				initialTabName={ initialTab }
				tabs={ settingTabs }
				onSelect={ ( tabName ) => updateUrl( tabName ) }
			>
				{ ( tab ) => {
					switch ( tab.name ) {
						case 'visibility-controls':
							return (
								<>
									<Ads variables={ variables } />
									<VisibilityControls
										settings={ settings }
										setSettings={ onSetSettings }
										variables={ variables }
									/>
								</>
							);
						case 'block-manager':
							return (
								<>
									<Ads variables={ variables } />
									<BlockManager
										settings={ settings }
										setSettings={ onSetSettings }
										variables={ variables }
									/>
								</>
							);
						case 'plugin-settings':
							return (
								<>
									<Ads variables={ variables } />
									<PluginSettings
										settings={ settings }
										setSettings={ onSetSettings }
										variables={ variables }
									/>
								</>
							);
						default:
							return <Slot name="SettingsTabs" />;
					}
				} }
			</TabPanel>
			<Footer variables={ variables } />
		</SlotFillProvider>
	);
}

wp.domReady( () => {
	registerCoreBlocks();
	render(
		<Settings />,
		document.getElementById( 'block-visibility-settings-container' )
	);
} );
