/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

export default function useFetch( route, method = 'GET' ) {
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
