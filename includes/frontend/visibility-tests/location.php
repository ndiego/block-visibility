<?php
/**
 * Adds a filter to the visibility test for the "location" settings.
 *
 * @package block-visibility
 * @since   3.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;

/**
 * Internal dependencies
 */
use any_value_compare;
use equal_value_compare;
use integer_value_compare;

/**
 * Run test to see if block visibility should be restricted by location.
 *
 * @since 3.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not
 */
function location_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'location' ) ) {
		return true;
	}

	$control_atts = isset( $controls['location'] )
		? $controls['location']
		: null;

	// There are no control settings, so skip tests.
	if ( ! $control_atts ) {
		return true;
	}

	$rule_sets = isset( $control_atts['ruleSets'] )
		? $control_atts['ruleSets']
		: array();

	$hide_on_rule_sets = isset( $control_atts['hideOnRuleSets'] )
		? $control_atts['hideOnRuleSets']
		: false;

	// There are no rule sets, skip tests.
	if ( ! is_array( $rule_sets ) || 0 === count( $rule_sets ) ) {
		return true;
	}

	// Array of results for each rule set.
	$rule_sets_test_results = array();

	foreach ( $rule_sets as $rule_set ) {
		$enable = isset( $rule_set['enable'] ) ? $rule_set['enable'] : true;
		$rules  =
			isset( $rule_set['rules'] ) ? $rule_set['rules'] : array();

		if ( $enable && 0 < count( $rules ) ) {

			// Array of results for each rule within the current rule set.
			$rule_set_test_results = array();

			foreach ( $rules as $rule ) {

				$test_result = run_location_rule_tests( $rule );

				// If there is an error, default to showing the block.
				$test_result =
					'error' === $test_result ? 'visible' : $test_result;

				$rule_set_test_results[] = $test_result;
			}

			// Within a rule set, all tests have to pass.
			$rule_set_result = in_array( 'hidden', $rule_set_test_results, true )
				? 'hidden'
				: 'visible';

			// Reverse the rule set result if hide_on_rules setting is active.
			if ( $hide_on_rule_sets ) {
				$rule_set_result =
					'visible' === $rule_set_result ? 'hidden' : 'visible';
			}

			// Pass the rule set result to the rule *sets* test results array.
			$rule_sets_test_results[] = $rule_set_result;
		}
	}

	// If there are no enabled rule sets, or if the rule sets have no set rules,
	// there will be no results. Default to showing the block.
	if ( empty( $rule_sets_test_results ) ) {
		return true;
	}

	// Under normal circumstances, need no "visible" results to hide the block.
	// When hide_on_rule_sets is enabled, we need at least one "hidden" to hide.
	if (
		! $hide_on_rule_sets &&
		! in_array( 'visible', $rule_sets_test_results, true )
	) {
		return false;
	} elseif (
		$hide_on_rule_sets &&
		in_array( 'hidden', $rule_sets_test_results, true )
	) {
		return false;
	} else {
		return true;
	}
}
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\location_test', 10, 3 );

/**
 * Run the individual rule tests.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_rule_tests( $rule ) {

	$field = isset( $rule['field'] ) ? $rule['field'] : null;

	// No field is set, so return an error.
	if ( ! $field ) {
		return 'error';
	}

	switch ( $field ) {
		// Cart rule tests.
		case 'pageType':
			$test_result = run_location_page_type_test( $rule );
			break;

		case 'postType':
			$test_result = run_location_post_type_test( $rule );
			break;

		case 'postTaxonomy':
			$test_result = run_location_post_taxonomy_test( $rule );
			break;

		case 'post':
			$test_result = run_location_post_test( $rule );
			break;

		case 'postID':
			$test_result = run_location_post_id_test( $rule );
			break;

		// Post attributes rule tests.
		case 'attributesAuthor':
			$test_result = run_location_author_test( $rule );
			break;

		case 'attributesComments':
			$test_result = run_location_comments_test( $rule );
			break;

		case 'attributesThumbnail':
			$test_result = run_location_thumbnail_test( $rule );
			break;

		case 'attributesHierarchy':
			$test_result = run_location_hierarchy_test( $rule );
			break;

		case 'attributesRelativeHierarchy':
			$test_result = run_location_relative_hierarchy_test( $rule );
			break;

		case 'attributesSupports':
			$test_result = run_location_supports_test( $rule );
			break;

		// Archive rules tests.
		case 'archiveType':
			$test_result = run_location_archive_type_test( $rule );
			break;

		case 'archive':
			$test_result = run_location_archive_test( $rule );
			break;

		default:
			$test_result = 'error';
			break;
	}

	return $test_result;
}

/**
 * Run the Location page type test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_page_type_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator = $rule['operator'];
	$types    = $rule['value'];

	if ( ! empty( $types ) && is_array( $types ) ) {
		$results = array();

		foreach ( $types as $type ) {

			switch ( $type ) {
				case 'frontPage':
					$result = is_front_page();
					break;

				case 'postsPage':
					$result = is_home();
					break;

				case 'singular':
					$result = is_singular();
					break;

				case 'archive':
					$result = is_archive();
					break;

				case 'search':
					$result = is_search();
					break;

				case '404':
					$result = is_404();
					break;

				default:
					$result = false;
					break;
			}

			$results[] = $result ? 'true' : 'false';
		}

		$test_result = any_value_compare( $operator, $results );
	}

	return $test_result;
}

/**
 * Run the Location page type test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_post_type_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator = $rule['operator'];
	$types    = $rule['value'];

	if ( ! empty( $types ) && is_array( $types ) ) {
		$results = array();

		foreach ( $types as $type ) {
			$results[] = get_post_type() === $type ? 'true' : 'false';
		}

		$test_result = any_value_compare( $operator, $results );
	}

	return $test_result;
}

/**
 * Run the Location post taxonomy test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_post_taxonomy_test( $rule ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] )
	) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$taxonomy = $rule['subField'];
	$operator = $rule['operator'];

	// If the "noTerm" operator is set, evaluate that separately.
	if ( 'noTerms' === $operator ) {

		// Check if the post has any taxonomy terms.
		$test_result = has_term( '', $taxonomy ) ? 'hidden' : 'visible';

		return $test_result;
	}

	if ( ! isset( $rule['value'] ) ) {
		return 'error';
	}

	$terms = $rule['value'];

	if ( ! empty( $terms ) && is_array( $terms ) ) {
		$results = array();

		foreach ( $terms as $term ) {
			$results[] = has_term( $term, $taxonomy ) ? 'true' : 'false';
		}

		$test_result = contains_value_compare( $operator, $results );
	}

	return $test_result;
}

/**
 * Run the Location post test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_post_test( $rule ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$current_post_id   = get_the_ID();
	$current_post_type = get_post_type( $current_post_id );

	$post_type = $rule['subField'];
	$operator  = $rule['operator'];
	$posts     = $rule['value'];

	// If the current post type does not match the set post type, test fails.
	if ( $current_post_type !== $post_type ) {
		return 'hidden';
	}

	if ( ! empty( $posts ) && is_array( $posts ) ) {
		$results = array();

		foreach ( $posts as $post ) {
			$results[] = $post === $current_post_id ? 'true' : 'false';
		}

		$test_result = any_value_compare( $operator, $results );
	}

	return $test_result;
}

/**
 * Run the Location post ID test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_post_id_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator = $rule['operator'];
	$post_ids = str_replace( ' ', '', $rule['value'] ); // Remove all spaces.

	if ( ! empty( $post_ids ) ) {
		$current_post_id = get_the_ID();
		$post_ids        = explode( ',', $post_ids );
		$results         = array();

		foreach ( $post_ids as $post_id ) {
			$results[] = (int) $post_id === (int) $current_post_id ? 'true' : 'false';
		}

		$test_result = boolean_value_compare( $operator, $results );
	}

	return $test_result;
}

/**
 * Run the Location author test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_author_test( $rule ) {

	if ( ! isset( $rule['operator'] ) ) {
		return 'error';
	}

	$operator = $rule['operator'];

	if ( ( 'any' === $operator || 'none' === $operator ) && ! isset( $rule['value'] ) ) {
		return 'error';
	}

	$post_author_id  = get_the_author_meta( 'ID' );
	$current_user_id = get_current_user_id();

	switch ( $operator ) {
		case 'isCurrentUser':
			return $post_author_id === $current_user_id ? 'visible' : 'hidden';

		case 'isNotCurrentUser':
			return $post_author_id !== $current_user_id ? 'visible' : 'hidden';

		case 'any':
		case 'none':
			if ( ! is_array( $rule['value'] ) ) {
				return 'error';
			}

			$results = array();

			foreach ( $rule['value'] as $author ) {
				$results[] = (int) $author === (int) $post_author_id ? 'true' : 'false';
			}

			return any_value_compare( $operator, $results );

		default:
			return 'error';
	}
}

/**
 * Run the Location comments test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_comments_test( $rule ) {

	// The comments test is unique in the it does not always need the operator or value.
	if ( ! isset( $rule['subField'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$current_post_type = get_post_type();
	$supports_comments = post_type_supports( $current_post_type, 'comments' );

	// If this rule is active and the post type does not support comments, hide the block.
	if ( ! $supports_comments ) {
		return 'hidden';
	}

	$sub_field     = $rule['subField'];
	$comment_count = (int) get_comments_number();

	if ( 'hasComments' === $sub_field ) {

		$test_result = 0 < $comment_count ? 'visible' : 'hidden';

	} elseif ( 'noComments' === $sub_field ) {

		$test_result = 0 === $comment_count ? 'visible' : 'hidden';

	} elseif (
		'commentCount' === $sub_field &&
		isset( $rule['operator'] ) &&
		isset( $rule['value'] )
	) {

		$result = integer_value_compare(
			$rule['operator'],
			$rule['value'],
			$comment_count
		);

		$test_result = $result ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Run the Location thumbnail test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_thumbnail_test( $rule ) {

	if ( ! isset( $rule['value'] ) ) {
		return 'error';
	}

	$current_post_type  = get_post_type();
	$supports_thumbnail = post_type_supports( $current_post_type, 'thumbnail' );

	// If this rule is active and the post type does not support thumbnails, hide the block.
	if ( ! $supports_thumbnail ) {
		return 'hidden';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$has_thumbnail = has_post_thumbnail();

	if ( 'hasThumbnail' === $rule['value'] ) {

		$test_result = $has_thumbnail ? 'visible' : 'hidden';

	} elseif ( 'noThumbnail' === $rule['value'] ) {

		$test_result = ! $has_thumbnail ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Run the Location hierarchy test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_hierarchy_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator  = $rule['operator'];
	$hierarchy = $rule['value'];

	$post_id     = get_the_ID();
	$has_parent  = wp_get_post_parent_id( $post_id );
	$child_pages = get_pages( array( 'child_of' => $post_id ) );
	$child_pages = $child_pages ? $child_pages : array();

	switch ( $hierarchy ) {
		case 'topLevel':
			$result = ! $has_parent;
			break;

		case 'parent':
			$result = 0 !== count( $child_pages );
			break;

		case 'child':
			$result = $has_parent;
			break;

		default:
			$result = false;
			break;
	}

	if ( 'is' === $operator ) {

		$test_result = $result ? 'visible' : 'hidden';

	} elseif ( 'isNot' === $operator ) {

		$test_result = ! $result ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Run the relative Location hierarchy test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_relative_hierarchy_test( $rule ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	// Account for a bug in v3 that allowed multiple values to be stored.
	$relative_id = is_array( $rule['value'] ) ? $rule['value'][0] : $rule['value'];
	$hierarchy   = $rule['operator'];

	$post_id     = get_the_ID();
	$parent_id   = wp_get_post_parent_id( $post_id );
	$child_pages = get_pages( array( 'child_of' => $post_id ) );
	$child_pages = $child_pages ? $child_pages : array();

	$child_page_ids = array();

	foreach ( $child_pages as $page ) {
		$child_page_ids[] = $page->ID;
	}

	switch ( $hierarchy ) {
		case 'parentOf':
			$result = in_array( $relative_id, $child_page_ids, true );
			break;

		case 'notParentOf':
			$result = ! in_array( $relative_id, $child_page_ids, true );
			break;

		case 'childOf':
			$result = $parent_id === $relative_id;
			break;

		case 'notChildOf':
			$result = $parent_id !== $relative_id;
			break;

		default:
			$result = false;
			break;
	}

	$test_result = $result ? 'visible' : 'hidden';

	return $test_result;
}

/**
 * Run the Location supports test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_supports_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator        = $rule['operator'];
	$param_supported = $rule['value'];

	$result = false;

	if ( ! empty( $param_supported ) ) {
		$current_post_type = get_post_type();

		if ( 'hierarchical' === $param_supported ) {
			$result = is_post_type_hierarchical( $current_post_type );
		} else {
			$result = post_type_supports( $current_post_type, $param_supported );
		}
	}

	if ( 'supports' === $operator ) {

		$test_result = $result ? 'visible' : 'hidden';

	} elseif ( 'notSupport' === $operator ) {

		$test_result = ! $result ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Run the Location archive type test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_archive_type_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// If this rule is enabled and we are not on an archive page, hide the block.
	if ( ! is_archive() && ! is_home() ) {
		return 'hidden';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator = $rule['operator'];
	$types    = $rule['value'];

	if ( ! empty( $types ) && is_array( $types ) ) {

		$results = array();

		foreach ( $types as $type ) {

			if ( 'post' === $type ) {

				$results[] = is_home() ? 'true' : 'false';

			} elseif ( 'category' === $type ) {

				$results[] = is_category() ? 'true' : 'false';

			} elseif ( 'post_tag' === $type ) {

				$results[] = is_tag() ? 'true' : 'false';

			} elseif ( 'author' === $type ) {

				$results[] = is_author() ? 'true' : 'false';

			} elseif ( 'date' === $type ) {

				$results[] = is_date() ? 'true' : 'false';

			} else {

				// If not one of the predefined types, check against all tax archives and post type archives.
				$results[] =
					( is_tax( $type ) || is_post_type_archive( $type ) )
						? 'true'
						: 'false';
			}
		}

		$test_result = any_value_compare( $operator, $results );
	}

	return $test_result;
}

/**
 * Run the Location archive test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_location_archive_test( $rule ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	// If this rule is enabled and we are not on an archive page, hide the block.
	if ( ! is_archive() ) {
		return 'hidden';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$type     = $rule['subField'];
	$operator = $rule['operator'];
	$values   = $rule['value'];

	if ( ! empty( $values ) && is_array( $values ) ) {

		$results = array();

		foreach ( $values as $value ) {

			if ( 'category' === $type ) {

				$results[] = is_category( $value ) ? 'true' : 'false';

			} elseif ( 'post_tag' === $type ) {

				$results[] = is_tag( $value ) ? 'true' : 'false';

			} elseif ( 'author' === $type ) {

				$results[] = is_author( $value ) ? 'true' : 'false';

			} else {

				// If not one of the predefined types, check against all tax archives and post type archives.
				$results[] =
					( is_tax( $type, $value ) || is_post_type_archive( $type, $value ) )
						? 'true' :
						'false';
			}
		}

		$test_result = any_value_compare( $operator, $results );
	}

	return $test_result;
}
