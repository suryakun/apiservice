$(document).ready(function() {

	$('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		defaultDate: '2016-01-12',
		editable: false,
		eventLimit: true, // allow "more" link when too many events
		eventClick: function(event) {
			// event click callback
		},
		events: [
			{
				title: 'All Day Event',
				start: '2016-01-01',
				url: 'comment_detail.html',
			},
			{
				title: 'Long Event',
				start: '2016-01-07',
				url: 'comment_detail.html'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2016-01-09T16:00:00',
				url: 'info_detail.html'
			},
			{
				id: 998,
				title: 'Repeating Event',
				start: '2016-01-16T16:00:00',
				url: 'info_detail.html'
			},
			{
				title: 'Karya Wisata ke Museum',
				start: '2016-01-11',
				end: '2016-01-13',
				url: 'info_detail.html'
			},
			{
				title: 'Pembagian Raport',
				start: '2016-01-12T10:30:00',
				end: '2016-01-12T12:30:00',
				url: 'info_detail.html'
			},
			{
				title: 'Lunch',
				start: '2016-01-12T12:00:00',
				url: 'comment_detail.html'
			},
			{
				title: 'Rapat Guru',
				start: '2016-01-12T14:30:00',
				url: 'info_detail.html'
			},
			{
				title: 'Happy Hour',
				start: '2016-01-12T17:30:00',
				url: 'comment_detail.html'
			},
			{
				title: 'Dinner',
				start: '2016-01-12T20:00:00',
				url: 'comment_detail.html'
			},
			{
				title: 'Birthday Party',
				start: '2016-01-13T07:00:00',
				url: 'comment_detail.html'
			},
			{
				title: 'Click for Google',
				url: 'http://google.com/',
				start: '2016-01-28'
			}
		]
	});

});
