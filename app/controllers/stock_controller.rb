class StockController < ApplicationController
	def new
		@brands = []
		@types = [['shirt',1],['pant',2]]
		Brand.all.each do |brand|
			@brands.push([brand.name,brand.id])
		end
	end
	def create
		@stock = stock_params
		@stock[:shop_id] = 1
		@stock[:user_id] = 1
		if Stock.new(@stock).save
			redirect_to stock_path
		else
			render 'new'
		end		
	end
	private
		def stock_params
			params.require(:stock).permit(:supplier_name,:total_quantity,:total_price,:paid_amount)
end		end
