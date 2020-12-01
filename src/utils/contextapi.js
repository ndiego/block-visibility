/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    useState,
    useEffect,
    createContext,
    useContext,
} from '@wordpress/element';


const SettingsContext = createContext();

export function SettingsContextProvider( { children } ) {
    const [ settings, setSettings ] = useState( [] );

    const endpoint = '/wp-json/block-visibility/v1/settings';
    const method = 'GET';

    useEffect( () => {
        async function fetchData() {
            const response = await fetch( endpoint, {
                method: method,
            } );

            if ( response.ok ) {
                const data = await response.json();
                setSettings( data );
                console.log( data );
            }
        }
        
        fetchData();
    }, [ ] ); // Stops effect from refiring on each completed render.

    return (
        <SettingsContext.Provider value={ settings }>
          { children }
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const settings = useContext( SettingsContext );
    if ( settings === undefined ) {
        throw new Error( __( 'Context must be used within a Provider', 'block-visibility' ) );
    }
    return settings;
}
