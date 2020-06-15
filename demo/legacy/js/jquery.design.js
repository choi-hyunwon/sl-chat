$(document).ready(function(){
	// 상단검색 - 자동완성
	$("#search_query, .btn_auto_complete_close, .btn_search_toggle").click(function(){
		$(".search_keyword").toggleClass("open");
	});
	$("#search_query").blur(function(){
		$(".search_keyword").removeClass("open");
	});

	// 상단 - 도움말 툴팁
	$("#btn_help").mouseenter(function(){
		$(".tooltip_wrap").show();
	}).mouseleave(function(){
		$(".tooltip_wrap").hide();
	});

	// 상단검색 - 상세검색
	$(".btn_search_detail, .btn_search_detail_close").click(function(){
		$(".search_detail").toggle();
	});

	// LNB
	$(".leftmenu li a").click(function(){
		$(".leftmenu li").removeClass("selected");
		$(".leftmenu li ul").hide();
		$(this).next("ul").toggle();
		$(this).parent("li").toggleClass("selected");
		$(".leftmenu").find(".selected").parents("ul").show();
		$(".leftmenu").find(".selected").parents("li").addClass("selected");
	});

	// LNB - 필터링
	var $filterBtn = $(".filter_item > li > a");
	$filterBtn.click(function(){
		$(this).closest("ul").children("li").removeClass("selected");
		$(this).closest("li").addClass("selected");
	});

	// 검색결과 상단 - 카테고리
	/*$(".search_category li a").click(function(){
		$(".search_category li").removeClass("selected");
		$(this).parent("li").addClass("selected");
	});*/

	$(".search_category li a").click(function(e) {
		e.preventDefault();
		$(".search_category li").removeClass("selected");
		$(this).parent("li").addClass("selected");
		$(this).closest(".search_category").next().children(".category_sub").hide();
		var tab = $(this).attr("href");
		$(tab).show();
	});

	$(".category_sub li a").click(function(){
		$(".category_sub li").removeClass("selected");
		$(this).parent("li").addClass("selected");
	});

	// 첨부미리보기
	$(".btn_file_preivew").click(function(){
		if($(this).closest("li").hasClass("selected")){
			$(this).closest("li").removeClass("selected");
		} else {
			$(".file_wrap li").removeClass("selected");
			$(this).closest("li").toggleClass("selected");
		}
	});
	$(".btn_file_preivew_close").click(function(){
		$(this).closest("li").toggleClass("selected");
	});

	// 첨부더보기
	$(".file_wrap li").each(function() {
		if( $(this).index() > 2 ) {
			$(this).addClass("hide");
		}
	});
	$(".btn_file_more > a").click(function(){
		if($(this).closest(".file_wrap").hasClass("open")){
			$(this).closest(".file_wrap").removeClass("open");
			$(this).children("em").text("첨부 더보기");
			$(".file_wrap li").each(function() {
				if( $(this).index() > 2 ) {
					$(this).addClass("hide");
				}
			});
		} else {
			$(this).closest(".file_wrap").addClass("open");
			$(this).closest(".file_wrap").children("ul").children("li").removeClass("hide");
			$(this).children("em").text("접기");
		}
	});

	// TOP 버튼
	$(".btn_top").click(function() {
		$("body, html").animate({scrollTop:0},0);
	});

	// 캘린더 옵션
	$(".datepicker").datepicker({
		showOn: "both", // 버튼과 텍스트 필드 모두 캘린더를 보여준다.
		buttonImage: "../images/btn_calendar.png", // 버튼 이미지
		dateFormat: "yy.mm.dd", // 텍스트 필드에 입력되는 날짜 형식
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], // 요일의 한글 형식
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], // 월의 한글 형식
		yearSuffix: "년",
		showMonthAfterYear: true,
		showOtherMonths: true
	});
	$(".datepicker_filter").datepicker({
		showOn: "both", // 버튼과 텍스트 필드 모두 캘린더를 보여준다.
		buttonImage: "../images/btn_filter_calendar.png", // 버튼 이미지
		dateFormat: "yy.mm.dd", // 텍스트 필드에 입력되는 날짜 형식
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], // 요일의 한글 형식
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], // 월의 한글 형식
		yearSuffix: "년",
		showMonthAfterYear: true,
		showOtherMonths: true
	});

	// 테이블 sorting 아이콘
	$(".sort_arrow").click(function(){
		$(this).toggleClass("sorting");
	});
	// 테이블 스타일
	$(".result_table table tbody tr:nth-child(2n)").addClass("gray");

});

// Window Popup
function popOpen(url, name, width, height){
	var toolbar_str = 'no';
	var menubar_str = 'no';
	var statusbar_str = 'no';
	var scrollbar_str = 'yes';
	var resizable_str = 'no';
	window.open(url, name, 'width='+width+',height='+height+',toolbar='+toolbar_str+',menubar='+menubar_str+',status='+statusbar_str+',scrollbars='+scrollbar_str+',resizable='+resizable_str);
}