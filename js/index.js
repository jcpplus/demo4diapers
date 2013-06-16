// $(function(){
// 	$("#switchViewModel").toggle(function(){
// 		alert("d");
// 		if ($(this).hasClass('viewWithGrid')) {
// 				$(this).removeClass('viewWithGrid').html('List<span class="icon-gridlist"></span>');
// 				$('#product-list').removeClass('listView').addClass('gridView');
// 				$.cookie('mViewList', null, {path: '/' });
// 			} else {
// 				$(this).addClass('viewWithGrid').html('Grid<span class="girdIcon"></span>');
// 				// $('#product-list').removeClass('gridView').addClass('listView');
// 				// $.cookie('mViewList', 'Y', {path: '/' });
// 			}
// 	});
// };

$(function() {
	$("#switchViewM1").on("click", function(){
		
		if($(this).hasClass("viewWithGrid")){
			$(this).removeClass('viewWithGrid').html('List<span class="listIcon"></span>');
			$("#product-list article").removeClass("listView").addClass("gridView");
		} else{
			$(this).addClass('viewWithGrid').html('Grid<span class="girdIcon"></span>');
			$("#product-list article").removeClass("gridView").addClass("listView");
		}
	})
});