$.event.props.push("dataTransfer");
/**
 * Drag&Drop an image in a container, 
 * Works with HTML5 using the new class FileReader 
 * to show the base64 code of an image. 
 * With this way, there are no necessary to upload the image with ajax 
 * to display it.
 * If the browser supports HTML5 but the plugin not work, it could be
 * because the browser doesn't support File Reader( eg Safari 5).
 * @link http://caniuse.com/filereader 
 * @author Maxi Capodacqua <mcapodacqua@outlook.com>
 * @param {jQuery} $
 */
(function ( $ ){
	
	$.fn.dragNdrop = function ( options ){
		var settings = $.extend({
			maxSize : 3000000,				//Max size of the image to be droppped
			beforeLoad : function(){},		//Callback function before the file is loaded>
			afterLoad : function(){},		//Callback function after the file is loaded>
			beforeShow : function(){},		//Callback function before the image is showed
			afterShow : function(){}		//Callback function after the image is showed
		}, options ), 
			$container = this;
		
		/**
		 * Helper object
		 */
		Helper = {
			/**
			 * @description Helps me to validate values and jQuery objects
			 * @param {var} variable
			 * @returns {Boolean}
			 */
			validate : function( variable ){
				if ( variable instanceof $ ){
					return variable.length;
				}
				return !(variable === '' || variable === null || variable === 'undefined' || variable === undefined);
			}
		};
		
		/**
		 * DragNDrop Object!
		 */
		dNd = {
			/**
			 * Initialize the plugin
			 */
			init : function(){
				this.validateBrowser();
				/**
				 * FileReader object used to get the image data
				 * @type FileReader
				 */
				this.fileReader = new FileReader();
				/**
				 * Image container
				 * @type jQuery
				 */
				this.imageContainer = $('<img style="display:none;" src="" >');
				this.bindActions();
			},
			/**
			 * Validate if the browser can use this plugin
			 */
			validateBrowser : function(){
				if(typeof FileReader === "undefined"){
					throw "Your browser doesn't support this plugin :(";
				}
			}, 
			/**
			 * Prepare the container for the drag and drop actions
			 */
			bindActions : function(){
				var self = this;
				
				$container.bind('drop', function (e) {
					self.drop(e);
				})
				.bind('dragenter', self.cleanBrowserActions)
				.bind('dragover', self.cleanBrowserActions)
				.bind('dragleave', self.cleanBrowserActions);

				$(document).bind('drop', self.docDrop)
							.bind('dragenter', self.docEnter)
							.bind('dragover', self.docOver)
							.bind('dragleave', self.docLeave);
			}, 
			/**
			 * Get the file dropped in the container
			 * @param {event} e
			 * @returns {Boolean}
			 */
			drop : function(e){
				var self = this,
						files = e.dataTransfer.files,
						file;
				settings.beforeLoad();
				if (!Helper.validate(files)) {
					return false;
				}
				file = files[0]; 
				self.renderImage(file);
				e.preventDefault();
				return false;
			},
			/**
			 * Render the result image using the base64 code of it
			 * @param {file} file
			 */
			renderImage : function (file){
				var self = this;
				if(file.size < settings.maxSize){
				   this.fileReader.readAsDataURL(file);
				   settings.afterLoad();
				   this.fileReader.onload = function (e){
										settings.beforeShow();
										self.imageContainer.attr('src',e.target.result).appendTo($container).show();
										settings.afterShow(e.target.result);
								   };
				} else {
				   alert('The file is too big');
				}
			},
			/**
			 * Remove the default browser action for drag and drop
			 * @param {event} e
			 */
			cleanBrowserActions : function(e){clearTimeout(this.doc_leave_timer);e.preventDefault();}, 
			docDrop : function (e){e.preventDefault();return false;}, 
			docEnter : function (e){clearTimeout(this.doc_leave_timer);e.preventDefault();return false;}, 
			docOver : function (e){clearTimeout(this.doc_leave_timer);e.preventDefault();return false;}, 
			docLeave : function (e){doc_leave_timer = setTimeout(function(){}, 200);}, 
	
		};
		dNd.init();
	};
}( jQuery ));