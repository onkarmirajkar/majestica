frappe.pages['rating'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Thanks For choosing Us',
		single_column: true
	});
	wrapper.rating = new erpnext.Rating(wrapper);
}

erpnext.Rating = Class.extend({
	init: function(wrapper) {
		var me = this;
		this.parent = wrapper;
		this.page = this.parent.page;
		setTimeout(function() {
			me.setup(wrapper);
			me.make(wrapper);
		});
	},

	setup:function(wrapper){
		var me = this;
		this.elements = {
			layout: $(wrapper).find(".layout-main"),
			approve_btn: wrapper.page.set_primary_action(__("<b>Confirm Reviews</b>"),
			function() {
				me.submit_data(wrapper);
			}, "fa fa-refresh"),
			refresh_btn: wrapper.page.set_secondary_action(__("<b>Skip Reviews</b>"),
			function() {  
				frappe.msgprint("Thanks for Purchasing with US...!!!");
			}, "fa fa-refresh"),
		};
		me.get_data(wrapper);
	},

	make: function(wrapper){
		var me = this;
		this.body = $('<div></div>').appendTo(this.page.main);
		var $container = $(frappe.render_template('rating', "")).appendTo(this.body);
	},

	get_data:function(wrapper){
		frappe.socketio.socket.on(frappe.session.user, function(data){
		var dialog = new frappe.ui.Dialog({
			title: __("Thanks For Choosing US...!!!"),
			fields: [
				{fieldtype:'Section Break', fieldname: 'section', label: __('<p style="text-align:center;"><b>Invoice</b></p>')},
				{fieldtype:'Read Only', fieldname:'key', label:'Invoice No.', default:data[0].name},
				{fieldtype:'Read Only', fieldname:'secret', label:'Items', default:data[0].items},
				{fieldtype:'Read Only', fieldname:'oauth_token', label:'Total', default:data[0].amount+" BND"},
				{fieldtype:'Read Only', fieldname:'oauth_token_secret', label:'Discount', default:data[0].discount_amount+" BND"},
			],
		});
		dialog.set_primary_action(__('OK'), function() {
			var data = dialog.get_values();
			console.log("here");
		});
		dialog.show();
/*
			console.log(data);
			$("#invoice").html(data[0].name);
			$("#cust").html(data[0].customer);
			$("#items").html(data[0].items);
			$("#amount").html(data[0].amount+" BND");
			$("#discount").html(data[0].discount_amount+" BND");
			$("#outstanding").html(data[0].outstanding_amount+" BND");
			$("#grand").html(data[0].grand_total+" BND");
*/
		});
	},

	submit_data: function(wrapper){
		var me = this;
		frappe.msgprint("Thanks for Purchasing with US. Yor rating has been submitted...!!!");
		if(document.querySelector('input[name="quality_of_service"]:checked')) {
			var quality_of_service = document.querySelector('input[name="quality_of_service"]:checked')
		} else {
			var quality_of_service = "";
		}

		if(document.querySelector('input[name="quality_of_products"]:checked')) {
			var quality_of_products = document.querySelector('input[name="quality_of_products"]:checked')
		} else {
			var quality_of_products = "";
		}

		if(document.querySelector('input[name="quality_of_cleanliness"]:checked')) {
			var quality_of_cleanliness = document.querySelector('input[name="quality_of_cleanliness"]:checked')
		} else {
			var quality_of_cleanliness = "";
		}
		
		if(document.getElementById("invoice").innerHTML || document.getElementById("cust").innerHTML){
			frappe.call({
				"method": "majestica.whitelisted.save_rating",
				"args": {
					"customer": document.getElementById("cust").innerHTML,
					"invoice": document.getElementById("invoice").innerHTML,
					"quality_of_service": quality_of_service,
					"quality_of_products": quality_of_products,
					"quality_of_cleanliness": quality_of_cleanliness
				}
			});
		}
		//me.make(wrapper);
	}
});
