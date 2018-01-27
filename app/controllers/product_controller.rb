class ProductController < ApplicationController
	def index
		@product = Product.new
		@brands = [['select brand','']]
		connection =  get_connection
		_brands = connection.exec_query("select id,name from brands");
		_brands.each do |brand|
			@brands.push([brand['name'],brand['id']])
		end
		@types = [['select type','']]
		_types = connection.exec_query("select id,name from types");
		_types.each do |type|
			@types.push([type['name'],type['id']])
		end
	end
	def get_products
		@products = Product.all
		_products = []
		connection = get_connection
		@products.each do |product|
			brand_id = product['brand_id'];
			brand = connection.exec_query("select name from brands where id=#{brand_id}");
			offer_type = 'no offer'
			offer = '-'
			offer_types = {1=>'Discount',2=>'Cutoff'}
			if product['offer_type']
				offer = product['offer'];
				offer_type = product['offer_type']
				if offer_type==1
					offer = offer.to_s+'%'
				end
				offer_type = offer_types[offer_type]

			end
			_products.push([(product['id']).to_s.rjust(8,'0'),product['name'],brand[0]['name'],'','',product['current_price'],offer_type,offer,product['quantity']])
		end
		render 'json':{'data':_products}
	end
	def create
		if (params[:product][:brand_id].class == "str".class)
			brand = Brand.create(name: params[:product][:brand_id])
			params[:product][:brand_id] = brand.id
		end
		product = Product.new(product_params)
		if product.save
			helpers.make_barcode product
			redirect_to products_path
		end
	end
	def get_properties
		term = params['search']
		page = params['page']
		start_cnt = (page.to_i-1)*10;
		connection = get_connection
		_properties = connection.exec_query("select name,id,is_referenced,data from properties where name like '%#{term}%' limit #{start_cnt},10");
		_data = [];
		_properties.each do |property|
			options = false;
			if(property['is_referenced'])
				options = property['data'].split(',')
			end
			_data.push({'text':property['name'],'id':property['id'],'data':options});
		end
		 render 'json':{'results':_data}
	end
	private
		def product_params
			params.require(:product).permit(:brand_id,:name,:current_price,:offer_type,:offer)
		end
end
