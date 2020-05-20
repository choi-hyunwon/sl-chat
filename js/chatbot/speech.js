var enterMessage = "please enter a message.";
var speakMessage = "please speak a message.";
var speechRecognition;
var speechSynthesizer;

function SpeechRecognition(message1, message2) {
	
	if(message1) enterMessage = message1; 
	if(message2) speakMessage = message2;

    // creating voice capture object
    this.recognition = new webkitSpeechRecognition();
    this.recognition.recognizing = false;

    // settings
    this.recognition.continuous = false; // stop automatically
    this.recognition.interimResults = true;
	this.recognition.lang = "ko-KR";
    
    this.recognition.onstart = function() {
    	console.log('Listening started...');
    	this.recognizing = true;
    	$("#message-mic").addClass("active");
    	$("#chat-textarea").attr("placeholder", speakMessage);
    };

    this.recognition.onend = function() {
    	console.log('Listening stopped.');
    	$("#message-mic").removeClass("active");
    	$("#chat-textarea").attr("placeholder", enterMessage);
    	$("#send").click();
    };

    this.recognition.onresult = function(event) {
		console.log(event.results[0][0].transcript);
		$("#chat-textarea").val(event.results[0][0].transcript);
    };

    this.recognition.onerror = function(event) {
    	console.log(event.error);
    	this.recognizing = false;
    	if(event.error == "not-allowed") {
    		$("#message-mic").addClass("disable");
    	}
    	else {
    		$("#message-mic").removeClass("disable");
    	}
    	$("#chat-textarea").attr("placeholder", enterMessage);
    };
    
    this.toggle = function(turnOn) {
    	if(turnOn) this.recognition.start();
		else this.recognition.stop();
    };
    
    this.recognition.start();
}

function SpeechSynthesis(domainId) {
	
	this.start = function(domainId) {
		this.domainId = domainId;
		this.enable = true;
		chat.enableTTS = true;
	}
	
	this.matchSource = function($bubble) {
		if(chat.enableTTS) {
			var tts = this;
			$bubble.find("audio[name='tts']").each(function(i, obj) {
				var message = $(obj).data("text");
				if(message.length > 0) {
					$(obj).attr("src", CONTEXTPATH + "api/speech/synthesis?domain="+tts.domainId+"&text="+encodeURIComponent(encodeURIComponent(message)));
					$(obj).data("text", "");
					obj.onplay = tts.speakstart;
					obj.onended = tts.speakend;
				}
			});
			tts.speak($bubble);
		}
	};
	
	this.speak = function($bubble, enforcing) {
		var completed = true;
		if(chat.enableTTS) {
			var tts = this;
			var speakObj;
			
			tts.stopall(chat.$chatHistory);
			
			$bubble.find(".item.active > audio[name='tts']").each(function(i, obj) {
				if(obj.error) {
					completed = false;
					console.log(obj.error);
				}
				
				if(!obj.error && (enforcing || $(obj).data("autoplay") === true)) {
					speakObj = obj;
					completed = true;
					return false;
				}
			});
			
			if(speakObj && $(speakObj).attr("src")) {
				speakObj.play();
			}
		}
		return completed;
	};
	
	this.stopall = function(parent) {
		parent.find("audio[name='tts']").each(function(i, speakObj) {
			if (speakObj.currentTime > 0 && !speakObj.ended) {
				speakObj.pause();
				speakObj.currentTime=0;
				$(speakObj).trigger("ended");
			}
		});	
	};
	
	this.speakstart = function(e) {
		$(e.target).closest(".bot").find(".avata.tts").addClass("active");
		if(typeof speechRecognition != "undefined" && speechRecognition.recognition.recognizing) {
			speechRecognition.toggle(false);
		}
	};
	
	this.speakend = function(e) {
		$(e.target).closest(".bot").find(".avata.tts").removeClass("active");
		if(typeof speechRecognition != "undefined" && !speechRecognition.recognition.recognizing) {
			speechRecognition.toggle(true);
		}
	};
	
	this.start(domainId);
}