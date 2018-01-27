class BillingController < ApplicationController
	include ApplicationHelper
	def new
		@customer = Customer.new;
	end
	def create
		Bill.transaction do
			noted_customer = params['noted_customer']
			bill = params[:bill]
			can_commit = true
			if noted_customer
				customer = bill[:customer]
				customer_id = customer[:id].to_i
				if customer_id !=0
					can_commit &= Customer.update(customer_id,name:customer[:name],phone:customer[:phone],email:customer[:email],address:customer[:address])
				else
					customer = Customer.new(customer_params(customer))
					can_commit  &= customer.save
					customer_id =customer[:id]
				end
			else
				customer_id = 1
				customer = bill[:customer]
			end
			paid_amount = bill[:paid_amount]
			bill = Bill.new
			bill[:customer_name] = customer[:name]
			bill[:customer_phone] = customer[:phone]
			bill[:customer_email] = customer[:email]
			bill[:customer_address] = customer[:address]
			bill[:customer_id] = customer_id
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
				price = product[:current_price]
				offer = 0
				if product[:offer_type] == 1
					offer = product[:offer].to_f
					offer = price*(offer/100)
				elsif product[:offer_type] == 2
						offer = product[:offer].to_f
				end
				quantity = _quantity[product_id.to_s].to_i
				price = price * quantity
				offer = offer * quantity
				net_price = price-offer
				bill_item[:product_id] = product_id
				bill_item[:quantity] = quantity
				bill_item[:price] = price
				bill_item[:net_price] = net_price
				can_commit &= bill_item.save
				if(!can_commit)
					byebug
				end
				Product.where('id = ?',product_id).update_all(['quantity = quantity - ?',quantity])
				total_price += price
				total_net_price += net_price
			end
			total_price = params[:bill][:total]
			total_offer = params[:bill][:offer]
			total_net_price = total_price.to_f-total_offer.to_f
			byebug
			can_commit &= bill.update(:net_price=>total_net_price,:total_price=>total_price,:offer=>total_offer,:paid_amount=>paid_amount)

			if noted_customer
				last_transaction = CustomerTransaction.select('due').where(['customer_id = ? AND shop_id = ?',customer_id,current_shop]).order(created_at: :desc).reorder(id: :desc).limit(1)
				due = 0.00
				if(last_transaction.length !=0)
					due = last_transaction[0].due.to_f
				end
				transaction = CustomerTransaction.new
				transaction.bill_id = bill.id
				transaction.shop_id = current_shop
				transaction.customer_id = customer_id
				transaction.amount = total_net_price
				due = due+total_net_price
				transaction.due = due
				can_commit &= transaction.save
				if paid_amount.to_f > 0
					transaction = CustomerTransaction.new
					transaction.bill_id = bill.id
					transaction.shop_id = current_shop
					transaction.customer_id = customer_id
					transaction.amount = -1*(paid_amount.to_f)
					due = due-paid_amount.to_f
					transaction.due = due
					can_commit &= transaction.save
				end
				byebug
			end
			if(!can_commit)
				byebug
			end
			if can_commit
				redirect_to '/billing/receipt/'+bill.id.to_s
			else
				render 'new'
			end
		end
	end
	def get_customers
		connection = get_connection
		start = 0
		search = params['term']
		result = []
		_customers = Customer.select("id,name,phone,email,address").where(["name like ? OR id= ? OR phone like ?","%#{search}%","#{search}","#{search}"]).limit(10);
		_customers.each do |customer|
			if customer['name']
				last_transaction = CustomerTransaction.select('due').where(['customer_id = ? AND shop_id = ?',customer.id,current_shop]).order(created_at: :desc).limit(1)
				due = 0.00
				if(last_transaction.length !=0)
					due = last_transaction[0].due
				end
				customer = customer.attributes
				customer[:due] = due
				result.push({'label':customer['name'].to_s+' '+customer['phone'].to_s,'value':customer['name'],'data':customer});
			end
		end
		render 'json':result
	end
	def get_product
		connection = get_connection
		id = params['code'].to_i
		product = Product.find_by(:id=>id,:status=>1)
		if(product)
			temp_product = {}
			temp_product['id'] = product.id
			temp_product['description'] = 'description';
			temp_product['name'] = product.name
			offer = 0;
			if product.offer_type.to_i == 1
				temp = product.offer.to_f
				offer = product.current_price.to_f*(temp/100).round(2);
			elsif product['offer_type'].to_i == 2
				offer = product['offer'].to_f
			end
			temp_product['offer'] = offer;
			temp_product['current_price'] = product.current_price
			temp_product['quantity'] = product.quantity.to_i
		end
		render 'json':temp_product
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
