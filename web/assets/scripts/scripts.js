var BookingWidget = {

	bookingElements:    null,
	widget: 			null,
	tabTrgr: 			null,
	tabTarget:  		null,
	bookingTabOpen: 	null,
	bookingFixedRange: 	3,

	initialize: function () {

		BookingWidget.bookingElements = $('.booking-elements');
		BookingWidget.widget    = $('.booking-widget');
		BookingWidget.tabTrgr   = $('.booking-widget .tab-trgr');
		BookingWidget.tabTarget = $('.booking-widget .booking-widget--tab');

        // BookingWidget.initBookingDatepicker();
        
        BookingWidget.popupDatePickerInit();
        BookingWidget.refreshListeners();
	},

	addListeners: function() {
	},
	removeListeners: function() {
	},
	refreshListeners: function() {
		BookingWidget.removeListeners();
		BookingWidget.addListeners();
	},

	popupDatePickerInit: function(){
        $('#popupDatepicker').datepick({
    		minDate	: 0,
			monthsToShow	: 2,
			changeMonth: false,
			dateFormat: 'mm/dd/yyyy',
			nextText: '',
			//altFormat: 'mm/dd/yyyy',
			rangeSelect: true
        });	
        // $('.testLink').on('click', BookingWidget.localisationTest());
	},

	localisationTest: function(e){
		$('#popupDatepicker').calendarsPicker($.extend( 
		    {calendar: $.datepick.instance('gregorian', 'fr')}, 
		    $.calendarsPicker.regionalOptions['fr']
		));
		e.preventDefault();	
	},	

	bookingTabs: function(trigger, target) {
		if(trigger){ var el = trigger }
		if(target){ elTarget = target }
		else{
			var el 			= $(this),
				elTarget  	= el.attr('data-target');
		};
		if($(BookingWidget.bookingElements).hasClass('expanded') == false){
			$(BookingWidget.bookingElements).addClass('expanded');
			BookingWidget.refreshListeners();
		};
		if ($(el).hasClass('active')){
			BookingWidget.refreshListeners();
		}
		else {
			BookingWidget.tabTrgr.removeClass('active');
			BookingWidget.tabTarget.removeClass('show');

			//Specific Tabs Tests

			el.addClass('active');
			$(elTarget).addClass('show');
			if($('.dim').css('display') != 'block'){
				$('.dim').show()
			};
		};
		return false;
	},

	initBookingDatepicker: function(){
		if( $('.booking-widget--datepicker') ){
			$('.booking-widget--datepicker').datepick({
				minDate	: 0,
				monthsToShow	: 2,
				changeMonth: false,
				dateFormat: 'mm/dd/yyyy',
				nextText: '',
				//altFormat: 'mm/dd/yyyy',
				rangeSelect: true,
				onSelect: function(){
					BookingWidget.bookingGetDates($(this));
				}
			});
		};
	},
	bookingGetDates: function(calendar){
	    var dates = calendar.calendarsPicker('getDate');
	    BookingWidget.bookingDateRange(dates[0],dates[1])
	},
	bookingDateRange: function(beginDate, endDate){
		BookingWidget.bookingFixedRangeTest();
		//True or False if fixed range is defined
		var fixedRangeExists = BookingWidget.bookingFixedRangeTest();

		//First Selection, no fixed range
		if(beginDate == endDate && fixedRangeExists == false){
			var endDateDefault = BookingWidget.dateAdjust(beginDate, 1);
			$('#check-in-input').attr('value', beginDate.formatDate());
			$('#check-out-input').attr('value', endDateDefault);
			BookingWidget.bookingTabs($('.check-out'), '#datepick');
		};
		//First Selection, fixed range
		if(beginDate == endDate && fixedRangeExists == true){
			var endDateDefault = BookingWidget.dateAdjust(beginDate, BookingWidget.bookingFixedRange);
			$('#check-in-input').attr('value', beginDate.formatDate());
			$('#check-out-input').attr('value', endDateDefault);
			var dates = [beginDate, endDateDefault]
			$('.booking-widget--datepicker').calendarsPicker('setDate', dates);
			// BookingWidget.bookingTabs($('.check-out'), '#datepick');
		};
		//Second Selection
		if(beginDate != endDate){
			$('#check-out-input').attr('value', endDate.formatDate());
		};
	},
	//Adjust selected date by number
	dateAdjust: function(origDate, number){
		var startDate = origDate.formatDate(),
			endDateRaw = new Date(startDate),
			numberOfDaysToAdd = number;
		if(numberOfDaysToAdd == 0 || numberOfDaysToAdd == undefined){
			numberOfDaysToAdd = 1
		};
		endDateRaw.setDate(endDateRaw.getDate() + numberOfDaysToAdd); 
	    var end_date = endDateRaw.getDate(),
	    	end_month = endDateRaw.getMonth() + 1, //Months are zero based
	    	end_year = endDateRaw.getFullYear(),
	    	endDate = end_month + "/" + end_date + "/" + end_year;
		return endDate;
	},
	//Test For Fixed Range Integer
	bookingFixedRangeTest: function(){
		if (+BookingWidget.bookingFixedRange===parseInt(BookingWidget.bookingFixedRange)) {
			return true;
		} else {
			return false;
		};
	},	
}


$(document).ready(BookingWidget.initialize);