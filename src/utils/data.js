/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * Fetch plugin data from the REST api.
 *
 * @since 1.3.0
 * @param {string} kind The kind of data to fetch. Valid kinds are: settings, variables
 * @return {Object}		Return fetched data object
 */
export function usePluginData( kind ) {
	const { data = 'fetching' } = useSelect( ( select ) => {
		const { getEntityRecord } = select( 'core' );
		return { data: getEntityRecord( 'block-visibility/v1', kind ) };
	}, [] );
	return data;
}

/**
 * Fetch data.
 */
export function useFetch( route, method = 'GET' ) {
    const cache = useRef({});
    const [ status, setStatus ] = useState( 'idle' );
    const [ data, setData ] = useState( null );
	const endpoint = '/wp-json/block-visibility/v1/' + route;

    useEffect( () => {
        if ( ! route ) {
            return;
        }

        async function fetchData() {
            setStatus( 'fetching' );

            if ( cache.current[ endpoint ] ) {
                const data = cache.current[ endpoint ];
                setData( data) ;
                setStatus( 'fetched' );
            } else {
                console.log( 'actually fetching' );
                const response = await fetch( endpoint, {
                    method: method,
                } );
                if ( response.ok ) {
                    const data = await response.json();
                    cache.current[ endpoint ] = data; // set response in cache;
                    setData( data );
                    setStatus( 'fetched' );
                }
            }

        }
        fetchData();
    }, [ endpoint ] ); // Stops effect from refiring on each completed render.

	//console.log( data );
    return { status, data };
}
