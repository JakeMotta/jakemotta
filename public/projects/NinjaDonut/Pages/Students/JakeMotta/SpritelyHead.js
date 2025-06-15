
        (function($) {
            $(document).ready(function() {
                $('#logo').click(function() {
                    document.location.href = 'http://www.spritely.net/';
                });
            
                $('#bird')
                    .sprite({
                        fps: 9, 
                        no_of_frames: 3,
                        // the following are optional: new in version 0.6...
                        start_at_frame: 2,
                        on_first_frame: function(obj) {
                            if (window.console) {
                                console.log('first frame');
                            }
                        },
                        on_last_frame: function(obj) {
                            // you could stop the sprite here with, e.g.
                            // obj.spStop();
                            if (window.console) {
                                console.log('last frame');
                            }
                        },
                        on_frame: {
                            2: function(obj) {
                                // you could change the 'state' of the
                                // sprite here with, e.g. obj.spState(2);
                                if (window.console) {
                                    console.log('frame 2');
                                }
                            }
                        }
                    })
                    .spRandom({top: 50, bottom: 200, left: 300, right: 320})
                    .isDraggable()
                    .activeOnClick()
                    .active();
                $('#clouds').pan({fps: 60, speed: 0.7, dir: 'left', depth: 10});
                $('#City2').pan({fps: 60, speed: 2, dir: 'left', depth: 30});
                $('#City').pan({fps: 60, speed: 3, dir: 'left', depth: 70});
                                $('#balloons').pan({fps: 30, speed: 3, dir: 'up', depth: 70});
                $('#clouds').spRelSpeed(5); 
				$('#City, #City2').spRelSpeed(2);               
                
                window.page = {
                    hide_panels: function() {
                        $('.panel').hide(300);
                    },
                    show_panel: function(el_id) {
                        this.hide_panels();
                        $(el_id).show(300);
                    }
                }
                
            });
        })(jQuery);
		
		
		//middle of the page
		
		
        
    
        (function($) {
            $(document).ready(function() {
                $('#logo').click(function() {
                    document.location.href = 'http://www.spritely.net/';
                });
            
                $('#bird')
                    .sprite({
                        fps: 9, 
                        no_of_frames: 3,
                        // the following are optional: new in version 0.6...
                        start_at_frame: 2,
                        on_first_frame: function(obj) {
                            if (window.console) {
                                console.log('first frame');
                            }
                        },
                        on_last_frame: function(obj) {
                            // you could stop the sprite here with, e.g.
                            // obj.spStop();
                            if (window.console) {
                                console.log('last frame');
                            }
                        },
                        on_frame: {
                            2: function(obj) {
                                // you could change the 'state' of the
                                // sprite here with, e.g. obj.spState(2);
                                if (window.console) {
                                    console.log('frame 2');
                                }
                            }
                        }
                    })
                    .spRandom({top: 50, bottom: 200, left: 300, right: 320})
                    .isDraggable()
                    .activeOnClick()
                    .active();
                $('#clouds2').pan({fps: 60, speed: 0.7, dir: 'left', depth: 10});
                                $('#balloons').pan({fps: 30, speed: 3, dir: 'up', depth: 70});
                $('#clouds2').spRelSpeed(5);               
                
                window.page = {
                    hide_panels: function() {
                        $('.panel').hide(300);
                    },
                    show_panel: function(el_id) {
                        this.hide_panels();
                        $(el_id).show(300);
                    }
                }
                
            });
        })(jQuery);