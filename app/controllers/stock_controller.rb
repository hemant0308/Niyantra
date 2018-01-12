class StockController < ApplicationController
	include ApplicationHelper
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
				product[:stock_id] = stock_id
				product[:price] = product['current_price']
				product_id = product['product_id'];
				if(product_id.to_i == 0)
					break
				end
				if(check_product (product_id))
					product = StockItem.new(product_params(product))
					can_commit &= product.save
					can_commit &= Product.where(["id = ?",product.product_id]).update_all(["quantity = quantity + ?",product.quantity])
				end
		end
		if can_commit
			redirect_to stock_path
		end
		else
			render 'json'=>stock
		end
	end
	def get_products
		connection = get_connection
		term = params['search']
		page = params['page']
		start_cnt = (page.to_i-1)*10;
		products = connection.exec_query("select id,name from products where (id like '%#{term}%' OR name like '%#{term}') limit #{start_cnt},10");
		result = []
		products.each do |product|
			result.push({'text'=>(product['name'].to_s+' '+product['id'].to_s),'id'=>product['id']});
		end
		render 'json':{'results':result,'pagination':{'pagination':page}}
	end
	def get_stocks
		connection = get_connection
		stocks = Stock.select('id,supplier_name,total_price,paid_amount,total_quantity,created_at');
		_stocks = []
		stocks.each do |stock|
			product_count = stock.products.length
			_stocks.push([stock['supplier_name'],product_count,stock['total_quantity'],stock['total_price'],stock['paid_amount'],format_date(stock['created_at'])])
		end
		render 'json':{'data':_stocks}
	end
	private
		def stock_params
			params.require(:stock).permit(:supplier_name,:total_quantity,:total_price,:paid_amount)
		end
		def product_params(params)
			params.permit(:stock_id,:product_id,:effective_date,:price,:quantity,:offer,:offer_type)
		end
		def check_product(product_id)
			return Product.find(product_id);
		end
end
