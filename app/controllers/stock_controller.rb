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
		stock = Stock.new(@stock)
		can_commit = true
		if stock.save
			stock_id = stock.id
			products = params[:product]
			products.each do |product|
				product[:shop_id] = current_shop
				product = Product.new(product_params(product))
				render 'json':product
				return
				can_commit &= product.save;
			end
		else
			if can_commit
				redirect_to stock_path
			else
				render new
			end
		end			
	end
	private
		def stock_params
			params.require(:stock).permit(:supplier_name,:total_quantity,:total_price,:paid_amount)
		end
		def product_params(params)
			params.permit(:brand_id,:current_price,:quantity,:offer,:offer_type)
		end
end

