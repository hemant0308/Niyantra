class StockController < ApplicationController
	include ApplicationHelper
	def index
		_suppliers = Supplier.select("id,name")
		@suppliers = [['select Supplier','']]
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
				can_commit &= Product.where(["id = ?",product.product_id]).update_all(["quantity = quantity + ?,current_price = ?,purchase_price = ?",product.quantity,product.retail_price,product.purchase_price])
				byebug	
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
		shop_id = current_shop['id']
		products = Product.select("id,name,current_price,purchase_price,quantity").where(["(id like ? OR name like ? ) AND shop_id = ? AND status = ?","%#{term}%","%#{term}%",current_shop['id'],1])
		result = []
		
		products.each do |product|
			result.push({'text'=>(product['name'].to_s+' '+get_product_no(product['id']).to_s),'id'=>product['id'],'price'=>product['current_price'],'quantity'=>product['quantity'],'purchase'=>product['purchase_price']});
		end
		render 'json':{'results':result,'pagination':{'pagination':page}}
	end
	def get_stocks
		stocks = Stock.select('stocks.id,supplier_id,total_price,paid_amount,total_quantity,stocks.created_at').where(['shop_id = ?',current_shop['id']]).order('created_at DESC');
		_stocks = []
		stocks.each do |stock|
			supplier_name = stock.supplier.name
			_stocks.push([supplier_name,stock['total_quantity'],stock['total_price'],stock['paid_amount'],stock['created_at'].to_time.to_i,stock['id']])
		end
		render 'json':{'data':_stocks}
	end
	def get_stock_products
		id = params['stock_id']
		stock_items = StockItem.joins(:product).select('products.id as id,products.name as name,products.current_price as price,stock_items.quantity as quantity').where(['stock_items.stock_id=?',id])
		_stock_items = []
		stock_items.each do |stock_item|
			_stock_items.push([get_product_no(stock_item.id),stock_item.name,format_float(stock_item.price),stock_item.quantity]);
		end
		render 'json':{'data':_stock_items}
	end
	private
		def stock_params
			params.require(:stock).permit(:supplier_id,:total_price,:paid_amount)
		end
		def product_params(params)
			params.permit(:stock_id,:product_id,:purchase_price,:retail_price,:quantity)
		end
		def check_product(product_id)
			return Product.find(product_id);
		end
end
