class StockController < ApplicationController
	include ApplicationHelper
	def index
		_suppliers = Supplier.select("id,name")
		@suppliers = []
		_suppliers.each do |supplier|
			@suppliers.push([supplier.name,supplier.id])
		end
	end
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
		can_commit = true
		if(@stock[:supplier_id].to_i == 0)
			supplier = Supplier.new(:name=>@stock[:supplier_id])
			can_commit &= supplier.save
			@stock[:supplier_id] = supplier.id
		end
		@stock[:shop_id] = current_shop['id']
		@stock[:user_id] = current_user['id']
		stock = Stock.new(@stock);
		if stock.save
			stock_id = stock.id
			products = params[:product]
			total = 0
			products.each do |product|
				product[:stock_id] = stock_id
				product_id = product['product_id'];
				if(product_id.to_i == 0)
					break
				end
				total += product['quantity'].to_i
				product = StockItem.new(product_params(product))
				can_commit &= product.save
				can_commit &= Product.where(["id = ?",product.product_id]).update_all(["quantity = quantity + ?",product.quantity])
			end
			stock[:total_quantity] = total
			can_commit &= stock.save
		end
		if can_commit
			redirect_to stock_path
		else
			render 'json'=>stock
		end
	end
	def get_products
		connection = get_connection
		term = params['search']
		page = params['page']
		start_cnt = (page.to_i-1)*10;
		products = connection.exec_query("select id,name from products where (id like '%#{term}%' OR name like '%#{term}') AND status = 1 limit #{start_cnt},10");
		result = []
		products.each do |product|
			result.push({'text'=>(product['name'].to_s+' '+product['id'].to_s),'id'=>product['id']});
		end
		render 'json':{'results':result,'pagination':{'pagination':page}}
	end
	def get_stocks
		stocks = Stock.select('id,supplier_id,total_price,paid_amount,total_quantity,created_at').where(['shop_id = ?',current_shop['id']]);
		_stocks = []
		stocks.each do |stock|
			supplier_name = stock.supplier.name
			_stocks.push([supplier_name,stock['total_quantity'],stock['total_price'],stock['paid_amount'],format_date(stock['created_at']),stock['id']])
		end
		render 'json':{'data':_stocks}
	end
	private
		def stock_params
			params.require(:stock).permit(:supplier_id,:total_price,:paid_amount)
		end
		def product_params(params)
			params.permit(:stock_id,:product_id,:effective_date,:price,:quantity,:offer,:offer_type)
		end
		def check_product(product_id)
			return Product.find(product_id);
		end
end
