var  entry, documentname, documentid, referenceID, callLogID, filePath, blob,cdr,fileObject;
var filename = "test.pdf";
$(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
});

var fileURL = "";
var imagePath = "";
function onDeviceReady() {	
	sessionStorage.platform = device.platform;
	var fileTransfer = new FileTransfer();
     $('#download').click( function() 
		{	
		    try {
				alert('hi');										
				if (sessionStorage.platform.toLowerCase() == "android") {
					window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory,onFileSystemSuccess, onError);
				}
				else {
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,onFileSystemSuccess, onError);
				}
				
			}
			catch(err) {
				alert("ER - " + err.message);
			}
			
		});	

		function onError(e) {
			alert("onError");
		};

		function onFileSystemSuccess(fileSystem) {
			var entry="";
			if (sessionStorage.platform.toLowerCase() == "android") {
				entry=fileSystem;
			}
			else {
				entry=fileSystem.root;
			}			
			entry.getDirectory("Cordova", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail);
		};
		function onGetDirectorySuccess(dir) {
			dir.getDirectory("MA_App", {create: true, exclusive: false}, onGetDirectorySuccess1, onGetDirectoryFail);
		};
		function onGetDirectorySuccess1(dir) {
			cdr = dir;
			dir.getFile(filename,{create:true, exclusive:false},gotFileEntry, errorHandler);
		};
		function gotFileEntry(fileEntry) {										
				var uri = encodeURI("http://192.168.103.178:8080/AG723/reports/test.pdf");			
				alert("dest - " + cdr.nativeURL+filename);
				fileTransfer.download(uri,cdr.nativeURL+filename,
					function(entry) {						
						openFile();
					},
					function(error) {
						alert("download error source " + error.source);
						alert("download error target " + error.target);
						alert("upload error code" + error.code);
						alert("error");
					},
					true);				
		};
		
		function openFile() {
			alert("URL - " + cdr.nativeURL+filename);
			cordova.plugins.fileOpener2.open(
				cdr.nativeURL+filename, 
				'application/pdf', 
				//'text/plain',
				{ 
					error : function(e) { 
						alert('Error status: ' + e.status + ' - Error message: ' + e.message);
					},
					success : function () {						               
					}
				}
			);
		};
		function onFileSystemSuccessDelete(fileSystem) {
			var entry="";
			if (sessionStorage.platform.toLowerCase() == "android") {
				entry=fileSystem;
			}
			else {
				entry=fileSystem.root;
			}	
			entry.getDirectory("Cordova/MA_App", {create: true, exclusive: false}, onGetDirectorySuccessDelete, onGetDirectoryFail);
			
		};
		function onGetDirectorySuccessDelete(dir) {
			dir.getFile(filename,{create: true, exclusive:false},gotFileEntryDelete, fail);						
		};

		function gotFileEntryDelete(fileEntry) {
			fileEntry.remove();
			var uri = encodeURI("http://192.168.103.178:8080/AG723/reports/test.pdf");
				fileTransfer.download(uri,cdr.nativeURL+filename,
					function(entry) {
						console.log("download complete: " + entry.toURL());						
						openFile();
					},
					function(error) {
						alert("download error source " + error.source);
						alert("download error target " + error.target);
						alert("upload error code" + error.code);
						alert("error");
					},
					true);				
		};		

		function fail(error){
			alert("ec - " + error.code);
		};

		function  errorHandler(e) {
			var msg = '';
			switch (e.code) {
				case FileError.QUOTA_EXCEEDED_ERR:
					msg = 'QUOTA_EXCEEDED_ERR';
					break;
				case FileError.NOT_FOUND_ERR:
					msg = 'NOT_FOUND_ERR';
					break;
				case FileError.SECURITY_ERR:
					msg = 'SECURITY_ERR';
					break;
				case FileError.INVALID_MODIFICATION_ERR:
					msg = 'INVALID_MODIFICATION_ERR';
					break;
				case FileError.INVALID_STATE_ERR:
					msg = 'INVALID_STATE_ERR';
					break;
				default:
					msg = e.code;
					break;
			};
			alert("Msg - " + msg);
		};

		function onGetDirectoryFail(error) {
			alert("onGetDirectoryFail");
		};

		$('#delete').click(ClearDirectory);

		function ClearDirectory() {
			alert("delete");
			if (sessionStorage.platform.toLowerCase() == "android") {
				window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory,onFileSystemDirSuccess, fail);
			}
			else {
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,onFileSystemDirSuccess, fail);
			}        
		}
		function onFileSystemDirSuccess(fileSystem) {
			var entry = "";
			if (sessionStorage.platform.toLowerCase() == "android") {
				entry=fileSystem;
			}
			else {
				entry=fileSystem.root;
			}	
            entry.getDirectory("Cordova",{create : true, exclusive : false},
                function(entry) {
					entry.removeRecursively(function() {
						console.log("Remove Recursively Succeeded");
					}, fail);
				}, getDirFail);
        }

		function getDirFail(error){
			alert("getDirFail - " + error.code);
		};

}
