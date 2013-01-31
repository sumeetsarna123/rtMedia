/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

jQuery(document).ready(function(){

        var bp_media_is_multiple_upload = false;
	if(jQuery('#'+bp_media_uploader_params.container).length==0)
		return false;
	var bp_media_uploader=new plupload.Uploader(bp_media_uploader_params);
	var bp_media_album_selected = false;
	bp_media_uploader.init();

        bp_media_uploader.bind('FilesAdded', function(up, files) {
		//bp_media_is_multiple_upload = files.length==1&&jQuery('.bp-media-progressbar').length==0?false:true;
		bp_media_is_multiple_upload = files.length>1;
                var url = window.location.href.substr(window.location.href.lastIndexOf('/') -6, 6);
                var flag = 0;
                jQuery.each(files, function(i, file) {
                        var extension = file.name.substr( (file.name.lastIndexOf('.') +1) );
                        if ( url == 'photos' || url == '/media' ) {
                            switch (extension) {
                                case 'jpg': case 'png': case 'gif': case 'jpeg':
                                            flag = 1;
                                            break;
                                default:alert("Please select an Image with proper image format");
                                         break;
                            }
                        } else if ( url == 'videos' ) {
                            switch (extension) {
                                case 'mp4': /* case 'wmv': case 'avi': case 'mkv': case 'mpg': case 'asf': case 'flv': case 'rm': */
                                            flag = 1;
                                            break;
                                default:alert("Please select an Video of proper format");
                                         break;
                            }
                        } else if ( url == '/music' ) {
                            switch (extension) {
                                case 'mp3': /* case 'ogg': case 'wav': case 'aac': case 'm4a': case 'wma': */
                                            flag = 1;
                                            break;
                                default:alert("Please select an Audio of proper format");
                                         break;
                            }
                        } else {
                            switch (extension) {
                                case 'mp3': case 'mp4': case 'jpg': case 'png': case 'gif': case 'jpeg':
                                    flag = 1;
                                    break;
                                default: alert('Please Select Media file of "mp3, mp4, jpg, png, gif or jpeg" format');
                                        break;
                            }
                        }
		});
                if ( flag == 1 ) {
                    bp_media_album_selected = jQuery('#bp-media-selected-album').val();
                    jQuery('#bp-media-uploaded-files').append('<div id="bp-media-progress-'+file.id+'" class="bp-media-progressbar"><div class="bp-media-progress-text">' + file.name + ' (' + plupload.formatSize(file.size) + ')(<b>0%</b>)</div><div class="bp-media-progress-completed"></div></div>');
                    bp_media_uploader.start();
                }
                up.refresh(); // Reposition Flash/Silverlight
	});
	bp_media_uploader.bind('UploadProgress', function(up, file) {
		jQuery('#bp-media-progress-'+file.id+' .bp-media-progress-completed').width(file.percent+'%');
		jQuery('#bp-media-progress-'+file.id+' .bp-media-progress-text b').html(file.percent+'%');
	});

	bp_media_uploader.bind('Error', function(up, err) {
		jQuery('#bp-media-uploaded-files').html('<div class="error"><p>Error: ' + err.code +
			', Message: ' + err.message +
			(err.file ? ', File: ' + err.file.name : '') +
			'</p></div>'
			);
		up.refresh();
	});

	bp_media_uploader.bind('FileUploaded', function(up, file) {
		jQuery('#bp-media-progress-'+file.id+' .bp-media-progress-text b').html("100%");
	});
	bp_media_uploader.bind('BeforeUpload',function(up){
		up.settings.multipart_params.is_multiple_upload = bp_media_is_multiple_upload;
		up.settings.multipart_params.bp_media_album_id = bp_media_album_selected;
	});
	bp_media_uploader.bind('UploadComplete',function(){
		var new_location = window.location.href;
		if(new_location.search('/upload/')>0){
			new_location = new_location.replace('/upload/','/albums/');
			if(bp_media_album_selected>0)
				new_location = new_location.concat(bp_media_album_selected);
			else
				new_location = new_location.concat('0/');
		window.location.replace(new_location);
		} else
                    location.reload(true);
	});
});