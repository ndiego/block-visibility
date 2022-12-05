/* eslint-disable */
const bvHome = 'https://www.blockvisibilitywp.com/';
const bvknowledgeBase = 'https://www.blockvisibilitywp.com/knowledge-base/';
const campaigns = {
    pluginReferralsEditor: 'utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals',
    pluginReferralsSettings: 'utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals',
    pluginUpsellsSettings: 'utm_source=plugin&utm_medium=settings&utm_campaign=plugin_upsells',
}
const query = {
    learnMore: 'bv_query=learn_more',
    getPro: 'bv_query=get_pro',
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
    settingsProUpgrade: bvHome + 'pro/?' + query.getPro + '&'  + campaigns.pluginUpsellsSettings,
    settingsKnowledgeBase: bvknowledgeBase + '?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    // General Settings tab
    settingsGeneral: bvknowledgeBase + 'how-to-configure-the-general-settings/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    // Block Manager tab
    settingsBlockManager: bvknowledgeBase + 'how-to-configure-the-block-manager/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    // Visibility Controls tab
    settingsVisibilityControls: bvknowledgeBase + 'guide-to-visibility-controls-in-block-visibility/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsHideBlock: bvknowledgeBase + 'how-to-use-the-hide-block-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsDateTime: bvknowledgeBase + 'how-to-use-the-date-time-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsQueryString: bvknowledgeBase + 'how-to-use-the-query-string-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsScreenSize: bvknowledgeBase + 'how-to-use-the-screen-size-control//?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsUserRole: bvknowledgeBase + 'how-to-use-the-user-role-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsVisibilityContolsIntegrations: bvknowledgeBase + 'guide-to-third-party-integrations-in-block-visibility/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsACF: bvknowledgeBase + 'how-to-use-the-advanced-custom-fields-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,
    settingsWpFusion: bvknowledgeBase + 'how-to-use-the-wp-fusion-control/?' + query.learnMore + '&' + campaigns.pluginReferralsSettings,

    // Editor links
    editorHideBlock: bvknowledgeBase + 'how-to-use-the-hide-block-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorDateTime: bvknowledgeBase + 'how-to-use-the-date-time-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorQueryString: bvknowledgeBase + 'how-to-use-the-query-string-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorScreenSize: bvknowledgeBase + 'how-to-use-the-screen-size-control//?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorUserRole: bvknowledgeBase + 'how-to-use-the-user-role-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorACF: bvknowledgeBase + 'how-to-use-the-advanced-custom-fields-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
    editorWpFusion: bvknowledgeBase + 'how-to-use-the-wp-fusion-control/?' + query.learnMore + '&' + campaigns.pluginReferralsEditor,
}

export default links;