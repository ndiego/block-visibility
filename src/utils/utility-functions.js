/**
 * Turn a snake case string and turn it into camel case
 *
 * @since 1.0.0
 * @param {string}  string The sanke case string
 * @return {string}	string The new camel case string
 */
export const snakeToCamel = ( string ) => string.replace(
    /([-_][a-z])/g,
    ( group ) => group.toUpperCase()
                    .replace( '-', '' )
                    .replace( '_', '' )
);