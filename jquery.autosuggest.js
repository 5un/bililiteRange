(function($){

$.fn.getText = function (){
	return bililiteRange(this.get(0)).bounds('all').text();
};

$.fn.getSelectionInfo = function (){
	var bili = bililiteRange(this.get(0));
	var pEnd = bili.bounds('all')._bounds[1];
	var b = bili.bounds('selection')._bounds;
	
	//console.log( bili.bounds('all')._bounds ) ;

	var start = bili.bounds([0, b[0]]);
	var end = bili.bounds([b[1], pEnd]);

	var selectionInfo = {
		selectionStart: b[0],
		selectionEnd: b[1],
		textBeforeCursor: bili.bounds([ 0, b[0] ]).text(),
		textAfterCursor: bili.bounds([ b[1], pEnd ]).text(),
	};

	return selectionInfo;
};


$.fn.autoSuggestSendKeys = function (x){
	x = x.replace(/([^{])\n/g, '$1{enter}'); // turn line feeds into explicit break insertions, but not if escaped
	return this.each( function(){
		// TODO handle if there's currently a selection
		//console.log(this);
		var $this = $(this);
		// TODO handle if spacebar
		var bili = bililiteRange(this);
		var currentSelection = bili.bounds('selection');
		console.log(currentSelection);

		// Set Default value for Auto Suggest Bound if there's not one
		if($this.data('auto-suggest-start') == undefined) $this.data('auto-suggest-start', currentSelection._bounds[0]);
		if($this.data('auto-suggest-end') == undefined) $this.data('auto-suggest-end', currentSelection._bounds[1]);
		
		// Add Chart to Auto Suggest Bound
		currentSelection.sendkeys(x).select();
		currentSelection = bili.bounds('selection');

		// Expand the Auto Suggest Bound to the current cursor pos
		$this.data('auto-suggest-end', currentSelection._bounds[1]);

		console.log('autosuggest range: ' + $this.data('auto-suggest-start') + ', ' + $this.data('auto-suggest-end'));

		this.focus();
	});
}; // autoSuggestSendKeys

$.fn.setComposition = function (word){
	word = word.replace(/([^{])\n/g, '$1{enter}'); 
	return this.each( function(){

		var $this = $(this);
		var bili = bililiteRange(this);

		// Set Default Value for Auto Suggest Bound if there's not one
		var currentSelection = bili.bounds('selection');
		if($this.data('auto-suggest-start') == undefined) $this.data('auto-suggest-start', currentSelection._bounds[0]);
		if($this.data('auto-suggest-end') == undefined) $this.data('auto-suggest-end', currentSelection._bounds[1]);

		var asStart = $this.data('auto-suggest-start');
		var asEnd = $this.data('auto-suggest-end');
		var newEnd = asStart + word.length;

		// Replace Auto Suggest Bound with the word
		bili.bounds([asStart, asEnd]).sendkeys(word);
		bili.bounds([newEnd, newEnd]).select();

		// Reset Auto Suggest Bounds
		$this.data('auto-suggest-start', asStart).data('auto-suggest-end', newEnd);

		console.log('autosuggest range: ' + $this.data('auto-suggest-start') + ', ' + $this.data('auto-suggest-end'));

		this.focus();
	});
}; // autoSuggest Commit

$.fn.endComposition = function (word){
	word = word.replace(/([^{])\n/g, '$1{enter}'); 
	return this.each( function(){

		var $this = $(this);
		var bili = bililiteRange(this);
		
		// Set Default Value for Auto Suggest Bound if there's not one
		var currentSelection = bili.bounds('selection');
		if($this.data('auto-suggest-start') == undefined) $this.data('auto-suggest-start', currentSelection._bounds[0]);
		if($this.data('auto-suggest-end') == undefined) $this.data('auto-suggest-end', currentSelection._bounds[1]);

		var asStart = $this.data('auto-suggest-start');
		var asEnd = $this.data('auto-suggest-end');
		var newEnd = asStart + word.length;

		// Replace Auto Suggest Bound with the word
		bili.bounds([asStart, asEnd]).sendkeys(word);
		bili.bounds([newEnd, newEnd]).select();

		// Reset Auto Suggest Bounds
		$this.data('auto-suggest-start', newEnd).data('auto-suggest-end', newEnd);

		console.log('autosuggest range: ' + $this.data('auto-suggest-start') + ', ' + $this.data('auto-suggest-end'));

		this.focus();
	});
}; // autoSuggest Commit

$.fn.replaceStringAtRange = function (str, offset, length){
	str = str.replace(/([^{])\n/g, '$1{enter}'); 
	return this.each( function(){

		var $this = $(this);
		var bili = bililiteRange(this);

		var newEnd = offset + str.length;

		// Set Default Value for Auto Suggest Bound if there's not one
		bili.bounds([offset, offset + length]).text(str);
		bili.bounds([newEnd, newEnd]).select();
		this.focus();
	});
}; // autoSuggest Commit

$.fn.replaceStringRelativeToCursor = function (str, offset, length){
	str = str.replace(/([^{])\n/g, '$1{enter}'); 
	return this.each( function(){

		var $this = $(this);
		var bili = bililiteRange(this);
		var currentSelection = bili.bounds('selection');

		var newEnd = currentSelection._bounds[0] + offset + str.length;

		// Set Default Value for Auto Suggest Bound if there's not one
		bili.bounds([	currentSelection._bounds[0] + offset, 
						currentSelection._bounds[0] + offset + length]).text(str);
		bili.bounds([newEnd, newEnd]).select();
		this.focus();
	});
}; // autoSuggest Commit


})(jQuery);