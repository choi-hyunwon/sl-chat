/*******************************************************
* 프로그램명   : akc.js 
* 설명         : KFramework 자동완성
* 작성일       : 2015.03.18
* 작성자       : 기술서비스팀 장진후
* 수정내역     : ksf용으로 수젇 2018.06.27
  *****************************************************/

//var akc_url = "./ksf/api/suggest";		// 자동완성  페이지 경로를 적어준다.
var akc_url = "http://10.10.18.90:4614/ksf/api/suggest";		// 자동완성  페이지 경로를 적어준다.

var AKCKwdID_TOP = "chat-textarea";			// 상단 키워드 input id

var AKCLstID = "keyword";				// 자동완성 리스트 id
var AKCArwID_TOP = "top_arrow";			// 자동완성 화살표 id

var akc_kwd = null;
var akc_lst = null;
var akc_timeid = null;
var akc_cur_kwd = null;
var akc_prv_kwd = null;
var akc_show_flag = false;
//var akc_enable = getCookie("akc_enable");
var akc_enable = true;
var locVal = 0;	//0 은 top 1은 bot

if(akc_enable == "false" || akc_enable == false){
	akc_enable = false;
}else{
	akc_enable = true;
}

//ksf mode
var akc_opt = "s";
//ksf domain
var akc_domain ="0";

var akc_idx	= -1;
var akc_lst_len = 0;
var akc_evt_key = 0;

$(document).ready(function(){	
	// if(sizeStatus > 0){
		// $(window).on('resize load', resizeAkcLyr); // resize시 호출
	// }
});

/**
 * 리사이징시 자동완성창 크기 조절 액션
 * 
 * @ param
 * 
 * @ return
 */
function resizeAkcLyr(){	
	var akc_lyr_width = ($('.write-form').children('input').first().width() + 29);
		
	$('#'+AKCArwID_TOP).removeClass('active');
		
	$('.keyword').each(function(){		
		$(this).hide();
		$(this).attr("style","width:" + akc_lyr_width + "px;");		
	});	
}

/**
* 자동완성초기화
* 
* @ param 
* 
* @ return   			
**/
function akcInit(doamin_num) {
	//도메인 지정 default = 0
	if(doamin_num!=null || doamin_num!="")
		akc_domain = doamin_num;
	
	//검색창 벗어나면 자동완성 숨기기
	$(document).mouseup(function(e){
		var container=$('.write-form');
		if(container.has(e.target).length==0){
			$('#'+AKCArwID_TOP).removeClass('active');
			$('#topKeywordLst').hide();
		}
	});
	
	akc_kwd = $('#' + AKCKwdID_TOP).val();
	akc_lst = $('#topKeywordLst');
	if(akc_enable == false){		
		
		$('.choose_word > a').each(function(){
			$(this).text('켜기');
		});
	}
	
	$('.in_header').children().each(function(){
		$(this).css('ime-mode', 'active');
		$(this).attr("autocomplete","off");
		
		// 키보드 이벤트 등록
		$(this).keyup(function(event){
			akc_evt_key = event.keyCode;
			akc_kwd = $('#' + AKCKwdID_TOP).val();
			if(event.keyCode == 38){	// up
				akc_idx--;
				if(akc_idx < 0) akc_idx = 0;
				pntAkcLst();			
			}else if(event.keyCode == 40){	// down
				akc_idx++;
				if(akc_idx > akc_lst_len-1) akc_idx = akc_lst_len-1;
				pntAkcLst();
			}else{
				akc_idx	= -1;
			}
			if(akc_enable){
				if(akc_kwd != ""){
					tglAkcVsb(true);
				}else{
					$('#'+AKCArwID_TOP).removeClass('active');
					tglAkcVsb(false);
				}
			}
		});
		
		// 마우스 클릭시 반응할 이벤트 등록	
		$(this).click(function(event){	
			
			switch(event.target.id){
				case AKCKwdID_TOP :	// 검색 인풋박스 클릭시 
					akc_kwd = $('#' + AKCKwdID_TOP).val();
					if(akc_enable){
						if(akc_kwd !=""){
							tglAkcVsb(true);	
						}
					}
					break;
				case AKCArwID_TOP :	// 상단 화살표 클릭시
					$('#'+AKCArwID_TOP).toggleClass('active');
					locVal = 0;
					if($('#topKeywordLst').css('display') == "none"){
						akc_kwd = $('#' + AKCKwdID_TOP).val();
						akc_lst = $('#topKeywordLst');		
						akc_lst.children().first().html(wrtHelpMsg);
						akc_lst.show();
					}else{
						akc_lst = $('#topKeywordLst');		
						akc_lst.hide();
					}
					break;
				case "first_opt_top" :	// 첫단어 보기 클릭시
					selectOpt(event.target.id);
					callAkcKwd();
					break;
				case "last_opt_top" :	// 끝단어 보기 클릭시
					selectOpt(event.target.id);
					callAkcKwd();
					break;
				case "akc_able" :	// 끄기, 켜기 클릭시
					tglAkcAbl();
					break;
			}
		});
		
	});
	
	
	
}


/**
* 키값을 체크한다. 자동완성 페이지를 호출한다. 
* @ param 
* @ return   			
**/
function chkAkcKwd(){
	
	if(akc_show_flag == true && akc_evt_key != 38 && akc_evt_key != 40){
		akc_cur_kwd = $('#' + AKCKwdID_TOP).val().toLowerCase();
		
		if(akc_cur_kwd == "" || akc_cur_kwd == null){
			
			akc_prv_kwd = "";
			return;
		}else{
			callAkcKwd();
		}
		//if(akc_cur_kwd != akc_prv_kwd){
			//callAkcKwd();
		//}
	}
	
}

/**
* 자동완성 페이지를 호출한다. 
* @ param 
* @ return   			
**/
function callAkcKwd(){	
	var akc_html = "";
	var temp_hilight =  "";
	var lower_temp_str = "";
	var i = 0;
	
	// get으로 보내면 파폭에서 한글 전송이 안됨.
	$.ajax({
		type: "POST",
		url: akc_url,
		dataType: "json",
		data: "term=" + akc_cur_kwd + "&mode=" + akc_opt+ "&domain="+akc_domain+"&target=complete",
		success: function(data){
			 $.each(data["suggestions"][0], function(){
				
				temp_hilight = this.toString();
				
				lower_temp_str = temp_hilight.toLowerCase(); 
							
				if(lower_temp_str.indexOf(akc_cur_kwd.toLowerCase()) > -1){				
					if( akc_opt == 's'){
						temp_hilight = "<strong>" + temp_hilight.substring(0, akc_cur_kwd.length) + "</strong>" + 
						temp_hilight.substring(akc_cur_kwd.length, temp_hilight.length);					
					}else{					
						temp_hilight = temp_hilight.substring(0, temp_hilight.length-akc_cur_kwd.length) + 
						"<strong>" + temp_hilight.substring(temp_hilight.length-akc_cur_kwd.length, temp_hilight.length) + "</strong>";
					}
				}
				akc_html += "<li id=\"akc" + i + "\">";
				akc_html += "<a class=\"akclist\" href='#'>" + temp_hilight + "</a>";
				akc_html += "</li>";			
				i++;
			});
			
			akc_lst_len = data.suggestions[0].length;
			if( akc_lst_len < 1){
				$('#'+AKCArwID_TOP).removeClass('active');
				akc_lst.children().first().html("");
				akc_lst.hide();
			}else{
				$('#'+AKCArwID_TOP).removeClass('active').addClass('active');
				akc_lst.children().first().html(akc_html);
				akc_lst.show();
			}
			
			$('.akclist').bind('click', function(){
				$("#chat-textarea").val($(this).text());
				chat.addMessage();
				//dftSchKwd($(this).text());
			});
		}
	});
	
	akc_prv_kwd = akc_cur_kwd;
}

/**
* 키보드 이벤트에 따른 자동완성 선택 css 처리
* 
* @ param
*  
* @ return   			
**/
function pntAkcLst(){
	var slt_kwd = $('#akc'+akc_idx).children().removeClass('akclist').addClass('selected').text();
	akc_kwd = $('#' + AKCKwdID_TOP);
	if( slt_kwd != "" ){
		$('.selected').removeClass('selected').addClass('akclist');
		akc_kwd.val($('#akc'+akc_idx).children().removeClass('akclist').addClass('selected').text());
	}
}

/**
* 자동완성 도움말
* @ param 
* @ return help_msg (도움말)   			
**/
function wrtHelpMsg(){
	var help_msg = "";

	if(akc_enable == true){
		help_msg = "<li ><a href=\"#none\">검색어 자동완성 기능을 사용중입니다.</a></li>";		
	}else{
		help_msg = "<li ><a href=\"#none\">검색어 자동완성 기능을 중지합니다.</a></li>";		
	}
	
	return help_msg;
}

/**
* 자동완성창 toggle
* @ param type ( false : hide,  true : show ) 
* @ return    			
**/
function tglAkcVsb( type ){	
	if( type == false ){
		akc_show_flag = false;
		akc_lst.hide();
	}else if( type == true ){
		akc_show_flag = true;
		chkAkcKwd();
	}
}

/**
* 자동완성 켜기, 끄기 Flag
* @ param 
* @ return    			
**/
function tglAkcAbl(){	
	
	if($('#akc_able').eq(0).text() == "끄기"){		
		akc_lst.hide();
		$('.choose_word > a').each(function(){
			$(this).text('켜기');
		});
		akc_show_flag = false;
		akc_enable = false;
		//akc_lst.children().first().html(wrtHelpMsg);
		
		if(locVal == 0){
			$('#'+AKCArwID_TOP).removeClass('active');
		}
	}else{
		$('.choose_word > a').each(function(){
			$(this).text('끄기');
		});
		akc_show_flag = true;
		akc_enable = true;		
		//akc_lst.children().first().html(wrtHelpMsg);
		callAkcKwd();
		if(locVal == 0){
			$('#'+AKCArwID_TOP).removeClass('active').addClass('active');
		}
	}
	
	setCookie("akc_enable", akc_enable, 365);
}

/**
 * 첫단어, 끝단어 그리기 
 * 
 * @return void
 */
function optDraw(){
	var optHtml = "";
	
	$('.choose_word > div > a').each(function(){
		alert($(this).parent().parent());
	});
	
	/*
	if(akc_opt == 1){
		optHtml = <a href="#none" id="first_opt_top">첫단어 보기</a> | <a id="last_opt_top" href="#none">끝단어 보기</a>
	}else{
		optHtml = <a href="#none" id="first_opt_top">첫단어 보기</a> | <a id="last_opt_top" href="#none">끝단어 보기</a>
	}
	*/
	
	$('.choose_word > div').append();
}

/**
 * 첫단어, 끝단어 선택시 
 * 
 * @param id( opt_id )
 * 
 * @return void
 */
function selectOpt( id ){
	if(id.indexOf("first_opt") > -1){ // 첫단어 보기 선택 시
		akc_opt = 's';
	}else if(id.indexOf("last_opt") > -1){ // 끝단어 보기 선택 시
		akc_opt = 'e';
	}
}