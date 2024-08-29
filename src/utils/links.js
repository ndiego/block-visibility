const BV_HOME = 'https://www.blockvisibilitywp.com/';
const BV_KNOWLEDGE_BASE = `${ BV_HOME }knowledge-base/`;

const campaigns = {
	pluginReferralsEditor:
		'utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals',
	pluginReferralsSettings:
		'utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals',
};
const query = {
	learnMore: 'bv_query=learn_more',
};

const buildKnowledgeBaseLink = ( path, campaign ) => {
	return `${ BV_KNOWLEDGE_BASE }${ path }?${ query.learnMore }&${ campaign }`;
};

const links = {
	general: {
		home: BV_HOME,
		orgSupport: 'https://wordpress.org/support/plugin/block-visibility',
		orgReviews:
			'https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5',
		gitHub: 'https://github.com/ndiego/block-visibility',
		twitter: 'https://twitter.com/BlockVisibility',
	},
	settings: {
		home: `${ BV_HOME }?${ query.learnMore }&${ campaigns.pluginReferralsSettings }`,
		knowledgeBase: `${ BV_KNOWLEDGE_BASE }?${ query.learnMore }&${ campaigns.pluginReferralsSettings }`,
		general: buildKnowledgeBaseLink(
			'how-to-configure-the-general-settings/',
			campaigns.pluginReferralsSettings
		),
		blockManager: buildKnowledgeBaseLink(
			'how-to-configure-the-block-manager/',
			campaigns.pluginReferralsSettings
		),
		visibilityControls: buildKnowledgeBaseLink(
			'guide-to-visibility-controls-in-block-visibility/',
			campaigns.pluginReferralsSettings
		),
		visibilityControlsIntegrations: buildKnowledgeBaseLink(
			'guide-to-third-party-integrations-in-block-visibility/',
			campaigns.pluginReferralsSettings
		),
	},
	editor: {},
};

const controls = [
	'acf',
	'browserDevice',
	'cookie',
	'dateTime',
	'edd',
	'hideBlock',
	'location',
	'metadata',
	'queryString',
	'referralSource',
	'screenSize',
	'urlPath',
	'userRole',
	'visibilityPresets',
	'woocommerce',
	'wpFusion',
];

const camelToKebabCase = ( string ) =>
	string.replace( /[A-Z]/g, ( letter ) => `-${ letter.toLowerCase() }` );

const getControlPath = ( control ) => {
	if ( control === 'VisibilityPresets' ) {
		return 'guide-to-visibility-presets/';
	}

	let kebabControl = camelToKebabCase( control ).toLowerCase();
	if ( kebabControl === 'edd' ) {
		kebabControl = 'easy-digital-downloads';
	}

	return `how-to-use-the-${ kebabControl }-control/`;
};

controls.forEach( ( control ) => {
	const path = getControlPath( control );
	links.settings[ control ] = buildKnowledgeBaseLink(
		path,
		campaigns.pluginReferralsSettings
	);
	links.editor[ control ] = buildKnowledgeBaseLink(
		path,
		campaigns.pluginReferralsEditor
	);
} );

export default links;
