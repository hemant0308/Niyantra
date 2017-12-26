class StockController < ApplicationController
	def new
		@brands = []
		@types = [['shirt',1],['pant',2]];
		@colors = [['red',1],['blue',1]];
		@sizes = [['small',1],['medium',1],['xl',3]];
		Brand.all.each do |brand|
			@brands.push([brand.name,brand.id])
		end
	end
	def create
		@stock = stock_params
		@stock[:shop_id] = current_shop
		@stock[:user_id] = current_user
		render 'json':params
		stock = Stock.new(@stock)
		if stock.save
			stock_id = stock.id
			products = params[:product]
			products.each do |product|

			end
		else
			render 'new'
		end		
	end
	private
		def stock_params
			params.require(:stock).permit(:supplier_name,:total_quantity,:total_price,:paid_amount)
end		end
