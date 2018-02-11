class HomeController < ApplicationController
	include ApplicationHelper
	def index
		connection = get_connection
		report = connection.exec_query("SELECT SUM(net_price) as total,SUM(paid_amount) as paid FROM bills WHERE shop_id = "+current_shop['id'].to_s+" AND DATE(created_at) = curdate()")
		@total = report.rows[0][0]
		@paid = report.rows[0][1]
		if @total.nil?
			@total = 0
		end
		if @paid.nil?
			@paid = 0
		end
		@total = format_float(@total)
		@paid = format_float(@paid)
		@bills = Bill.select("customer_name,net_price,DATE(created_at)").where(["DATE(created_at)=curdate() AND shop_id = ?",current_shop['id']]).order("created_at DESC").limit(5)
		shop_id = current_shop['id']
		total_due = connection.exec_query("SELECT SUM(due) as due FROM customer_transactions where id in(select max(id) from customer_transactions where shop_id = 1 group by customer_id)")
		@total_due =format_float(total_due.rows[0][0])
	end
end
