/**
 * WordPress dependencies
 */
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import {
	PlainText,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';

import {
 	createContext,
 	useContext,
} from '@wordpress/element';
/*
const Context = createContext();
function useEditorContext() {
	return useContext( Context );
}
*/

export default function PropsTest() {
	
	//const { settings } = useEditorContext();
	
	const [ title, setTitle ] = useEntityProp( 'root', 'site', 'title' );
	
	console.log( 'This is ' + title );
	return (
		<PlainText
			__experimentalVersion={ 2 }
			tagName={ Block.h1 }
			placeholder={ __( 'Site Title' ) }
			value={ title }
			onChange={ setTitle }
			disableLineBreaks
		/>
	);
}
