class CustomerController < ApplicationController
  include ApplicationHelper
  def get_customers
    term = params['term']
    _customers = Customer.select("name,phone,email,address,id")
    result = []
    _customers.each do |customer|
      customer = customer.attributes
      last_transaction = CustomerTransaction.select('due').where(['customer_id = ? AND shop_id = ?',customer['id'],current_shop]).order(created_at: :desc).reorder(id: :desc).limit(1)
      due = 0.0
      if last_transaction.length > 0
        due = last_transaction[0].due
      end
      customer['due'] = due
      result.push([customer['name'],customer['phone'],customer['email'],customer['address'],format_float(customer['due'].to_f),customer['id']])
    end
    render 'json':{'data':result}
  end
  def get_transactions
    customer_id = params[:id]
    shop_id = current_shop
    transactions = CustomerTransaction.select('*').where(["customer_id = ? AND shop_id = ?",customer_id,shop_id]).order(created_at: :desc).reorder(id: :desc)
    result = []
    transactions.each do |transaction|
      description = ''
      if(transaction.bill_id)
        if transaction.amount < 0
          description = "Paid while purchasing"
        else
          description = "Purchased"
        end
      else
        description = "Paid manually"
      end
        
      result.push([format_date(transaction.created_at),description,format_float(transaction.amount),format_float(transaction.due)])
    end
    render json:{'data':result}
  end
end
