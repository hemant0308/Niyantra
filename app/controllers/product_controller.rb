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
		@products = Product.select('*').where('status = 1');
		_products = []
		properties = {}
		@products.each do |product|
			brand_id = product['brand_id'];
			brand = Brand.where(['id = ?',brand_id]).select('name')
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
			product_properties = product.product_properties
			properties_text = []
			product_properties.each do |product_property|
				if !properties[product_property.property_id]
					properties[product_property.property_id] = product_property.property
				end
				property = properties[product_property.property_id]
				properties_text.push(property[:name] + ' : ' + product_property[:value])
			end
			_products.push([(product['id']).to_s.rjust(8,'0'),product['name'],brand[0]['name'],properties_text.join('<br>'),'',product['current_price'],offer_type,offer,product['quantity'],product['id']])
		end
		render 'json':{'data':_products}
	end
	def create
		product = params[:product]
		can_commit = true
		if product[:id]!=''
			id = product[:id]
			product = Product.find(id)
			can_commit &= product.update(product_params)
		else
			product = Product.new(product_params)
			can_commit &= product.save
			if can_commit
				helpers.make_barcode product
			end	
		end
		properties = params[:product][:property]
		if properties
			properties.each do |key,val|
				existing = ProductProperty.find_by({:product_id=>product.id,:property_id=>key})
				if existing
					can_commit &= existing.update(value:val)
				else
					can_commit &= ProductProperty.new(product_id:product.id,property_id:key,value:val).save()
				end
				
			end
		end
		if can_commit
			redirect_to products_path
		end
	end
	def delete
		id = params[:id]
		result = Product.where(['id = ?',id]).update_all('status = 2')
		if result
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
	def get_product_info
		id = params[:id]
		product = Product.find(id)
		properties = product.properties
		property_values = product.product_properties
		_temp = {}
		properties.each do |p|
			_temp[p.id] = p
		end
		render 'json':{'product':product,'properties':_temp,'property_values':property_values}
	end
	private
		def product_params
			params.require(:product).permit(:id,:brand_id,:type_id,:name,:current_price,:offer_type,:offer)
		end
end
