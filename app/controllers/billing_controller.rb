class BillingController < ApplicationController

	def billing
		@customer = Customer.new;
	end
	def get_customer
		connection = get_connection
		start = params['page'].to_i
		term = params['search']
		result = []
		_customers = connection.exec_query("select id,name,phone,email,address from customer where name like ('%#{search}%' OR id='#{search}') limit #{start},10");
		_customers.each do |customer|
			result.push({'id':cusomer['id'],'text':customer['name'],'phone':customer['phone'],'email':customer['email'],'address':customer['address']})
		end
		render 'json':{'result':result,'page':page}
	end
end
