class BillingController < ApplicationController
	include ApplicationHelper
	def new
		@customer = Customer.new;
	end
	def create
		noted_customer = params['noted_customer']
		bill = params[:bill]
		can_commit = true
		if noted_customer
			customer = bill[:customer]
			id = customer[:id].to_i
			if id !=0
				can_commit &= Customer.update(id,name:customer[:name],phone:customer[:phone],email:customer[:email],address:customer[:address])
			else
				customer = Customer.new(customer_params(customer))
				can_commit  &= customer.save
				id =customer[:id]
			end
		else
			id = 1
			customer = bill[:customer]
		end

		bill = Bill.new
		bill[:customer_name] = customer[:name]
		bill[:customer_phone] = customer[:phone]
		bill[:customer_email] = customer[:email]
		bill[:customer_address] = customer[:address]
		bill[:customer_id] = id
		bill[:shop_id] = current_shop
		can_commit &= bill.save
		if(!can_commit)
			byebug
		end	
		products = params[:product]
		_quantity = params[:quantity]
		total_price = 0;
		total_net_price = 0;
		product = ''
		products.each do |product_id|
			bill_item = BillItem.new
			bill_item[:bill_id] = bill.id
			product_id = product_id.to_i
			product = Product.find(product_id)
			quantity = _quantity[product_id.to_s].to_i
			price = quantity * product[:current_price]
			offer = 0
			if product[:offer_type] == 1
				offer = product[:offer].to_f
				offer = price*(offer/100)
			elsif product[:offer_type] == 2
					offer = product[:offer].to_f
			end
			net_price = price-offer
			bill_item[:product_id] = product_id
			bill_item[:quantity] = _quantity[product_id.to_s].to_i
			bill_item[:price] = price
			bill_item[:net_price] = net_price
			can_commit &= bill_item.save
			if(!can_commit)
				byebug
			end	
			Product.where('id = ?',product_id).update_all('quantity = quantity - 1')
			total_price += price
			total_net_price += net_price
		end
		can_commit &= bill.update(:net_price=>total_net_price,:total_price=>total_price)
		if(!can_commit)
			byebug
		end	
		if can_commit
			redirect_to '/billing/receipt/'+bill.id.to_s
		else
			render 'new'
		end
	end
	def get_customers
		connection = get_connection
		start = 0
		search = params['term']
		result = []
		_customers = connection.exec_query("select id,name,phone,email,address from customers where  (name like '%#{search}%' OR id='#{search}' OR phone like '#{search}') limit #{start},10");
		_customers.each do |customer|
			if customer['name']
				result.push({'label':customer['name'].to_s+' '+customer['phone'].to_s,'value':customer['name'],'data':customer});
			end
		end
		render 'json':result
	end
	def get_product
		connection = get_connection
		id = params['code'].to_i
		product = Product.find_by(:id=>id)
		if(product)
			product = product.attributes
			product['description'] = 'description';
			offer = 0;
			if product['offer_type'].to_i == 1
				temp = product['offer'].to_f
				offer = product['offer'].to_i*(temp/100);
			elsif product['offer_type'].to_i == 2
				offer = product['offer'].to_f
			end
			product['net_price'] = product['current_price'].to_i - offer
			if product['quantity'].to_i > 0
				product['is_available'] = true
			else
				product['is_available'] = false
			end
		end
		render 'json':product
	end
	def receipt
		id = params[:id]
		@bill = Bill.find_by(:id=>id)
		_bill_items = @bill.bill_items
		@products = []
		_bill_items.each do |bill_item|
			product = Product.find_by(:id=>bill_item.product_id)
		 	@products.push(:name=>product.name,:description=>'description',:quantity=>bill_item.quantity,:amount=>bill_item.net_price)
		end
		@shop = Shop.find_by(:id=>current_shop)
	end
	private
		def customer_params(customer)
			customer.permit(:name,:phone,:email,:address)
		end
end
