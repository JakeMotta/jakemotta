/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	config.defaultLanguage = 'en';

	// Uncomment the following block to make CKEditor format self-closing tags the old way e.g. as <BR> and <IMG> instead of <BR /> and <IMG />
	/*
	CKEDITOR.on( 'instanceReady', function( ev )
	{
		ev.editor.dataProcessor.writer.selfClosingEnd = '>';
	});
	*/
};