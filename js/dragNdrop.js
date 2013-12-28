$.event.props.push("dataTransfer");
(function ( $ ){
	
	$.fn.dragNdrop = function ( options ){
		var settings = $.extend({
			maxSize : 3000000,
			beforeLoad : function(){},
			afterLoad : function(){},
			beforeShow : function(){}, 
			afterShow : function(){}
		}, options ), 
			$container = this;
		
		/**
		 * Helper object
		 */
		Helper = {
			/**
			 * @@description Helps me to validate values and jQuery objects
			 * @param {var} variable
			 * @returns {@exp;variable@pro;length|unresolved}
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
				 * @@type jQuery
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
			cleanBrowserActions : function(e){clearTimeout(this.doc_leave_timer);e.preventDefault();}, 
			docDrop : function (e){e.preventDefault();return false;}, 
			docEnter : function (e){clearTimeout(this.doc_leave_timer);e.preventDefault();return false;}, 
			docOver : function (e){clearTimeout(this.doc_leave_timer);e.preventDefault();return false;}, 
			docLeave : function (e){doc_leave_timer = setTimeout(function(){}, 200);}, 
	
		};
		dNd.init();
	};
}( jQuery ));