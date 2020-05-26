


export const snakeToCamel = ( string ) => string.replace(
    /([-_][a-z])/g,
    ( group ) => group.toUpperCase()
                    .replace( '-', '' )
                    .replace( '_', '' )
);