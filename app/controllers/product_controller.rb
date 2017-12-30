class ProductController < ApplicationController
	def index
		@product = Product.new
		@brands = []
		connection =  get_connection
		_brands = connection.exec_query("select id,name from brands");
		_brands.each do |brand|
			@brands.push([brand['name'],brand['id']])
			@types = []
		end
		_types = connection.exec_query("select id,name from types");
		_types.each do |type|
			@types.push([type['name'],type['id']])
		end
	end
	def get_properties
		term = params['q']
		connection = get_connection
		_properties = connection.exec_query("select name,id,is_referenced,data from properties where name like '%#{term}%'");
		_data = [];
		_properties.each do |property|
			options = false;
			if(property['is_referenced'])
				options = property['data'].split(',')
			end
			_data.push({'label':property['name'],'value':property['name'],'data':options,'id':property['id']});
		end
		 render 'json':_data
	end
end
