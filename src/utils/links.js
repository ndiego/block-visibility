/* eslint-disable */
const bvHome = 'https://www.blockvisibilitywp.com/';
const bvknowledgeBase = 'https://www.blockvisibilitywp.com/knowledge-base/';
const campaigns = {
    pluginReferralsEditor: 'utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals',
    pluginReferralsSettings: 'utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals',
}
const query = {
    learnMore: 'bv_query=learn_more',
}

const links = {
    // General links
    blockVisibilityHome: bvHome,
    blockVisibilityOrgSupport: 'https://wordpress.org/support/plugin/block-visibility',
    blockVisibilityOrgReviews: 'https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5',
    gitHub: 'https://github.com/ndiego/block-visibility',
    twitter: 'https://twitter.com/BlockVisibility',
    
    // Settings links
    settingsHome: bvHome + '?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsKnowledgeBase: bvknowledgeBase + '?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    
    // General Settings tab
    settingsGeneral: bvknowledgeBase + 'how-to-configure-the-general-settings/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
   
    // Block Manager tab
    settingsBlockManager: bvknowledgeBase + 'how-to-configure-the-block-manager/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    
    // Visibility Controls tab
    settingsACF: bvknowledgeBase + 'how-to-use-the-advanced-custom-fields-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsBrowserDevice: bvknowledgeBase + 'how-to-use-the-browser-device-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsCookie: bvknowledgeBase + 'how-to-use-the-cookie-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsDateTime: bvknowledgeBase + 'how-to-use-the-date-time-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsEDD: bvknowledgeBase + 'how-to-use-the-easy-digital-downloads-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsHideBlock: bvknowledgeBase + 'how-to-use-the-hide-block-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsLocation: bvknowledgeBase + 'how-to-use-the-location-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsMetadata: bvknowledgeBase + 'how-to-use-the-metadata-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsQueryString: bvknowledgeBase + 'how-to-use-the-query-string-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsReferralSource: bvknowledgeBase + 'how-to-use-the-referral-source-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsScreenSize: bvknowledgeBase + 'how-to-use-the-screen-size-control//?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsUrlPath: bvknowledgeBase + 'how-to-use-the-url-path-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsUserRole: bvknowledgeBase + 'how-to-use-the-user-role-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsVisibilityControls: bvknowledgeBase + 'guide-to-visibility-controls-in-block-visibility/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsVisibilityContolsIntegrations: bvknowledgeBase + 'guide-to-third-party-integrations-in-block-visibility/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsVisibilityPresets: bvknowledgeBase + 'guide-to-visibility-presets/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsWoocommerce: bvknowledgeBase + 'how-to-use-the-woocommerce-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsWpFusion: bvknowledgeBase + 'how-to-use-the-wp-fusion-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,

    // Editor links
    editorACF: bvknowledgeBase + 'how-to-use-the-advanced-custom-fields-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorBrowserDevice: bvknowledgeBase + 'how-to-use-the-browser-device-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorCookie: bvknowledgeBase + 'how-to-use-the-cookie-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorDateTime: bvknowledgeBase + 'how-to-use-the-date-time-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorEDD: bvknowledgeBase + 'how-to-use-the-easy-digital-downloads-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorHideBlock: bvknowledgeBase + 'how-to-use-the-hide-block-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorLocation: bvknowledgeBase + 'how-to-use-the-location-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorMetadata: bvknowledgeBase + 'how-to-use-the-metadata-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorQueryString: bvknowledgeBase + 'how-to-use-the-query-string-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorReferralSource: bvknowledgeBase + 'how-to-use-the-referral-source-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorScreenSize: bvknowledgeBase + 'how-to-use-the-screen-size-control//?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorUrlPath: bvknowledgeBase + 'how-to-use-the-url-path-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorUserRole: bvknowledgeBase + 'how-to-use-the-user-role-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorVisibilityPresets: bvknowledgeBase + 'guide-to-visibility-presets/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorWoocommerce: bvknowledgeBase + 'how-to-use-the-woocommerce-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorWpFusion: bvknowledgeBase + 'how-to-use-the-wp-fusion-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
}

export default links;