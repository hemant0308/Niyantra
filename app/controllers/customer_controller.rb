class CustomerController < ApplicationController
  include ApplicationHelper
  def get_customers
    term = params['term']
    _customers = Customer.select("name,phone,email,address,id")
    result = []
    _customers.each do |customer|
      customer = customer.attributes
      last_transaction = CustomerTransaction.select('due').where(['customer_id = ? AND shop_id = ?',customer['id'],current_shop['id']]).order(created_at: :desc).reorder(id: :desc).limit(1)
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
    shop_id = current_shop['id']
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
  def add_transaction
    customer_id = params[:customer_id]
    amount = params[:amount].to_i
    desc = params[:desc]
    last_transaction = CustomerTransaction.select('due').where(['customer_id = ? AND shop_id = ?',customer_id,current_shop['id']]).order(created_at: :desc).reorder(id: :desc).limit(1)
    due = 0.00
    if last_transaction.length > 0 
      due = last_transaction[0][:due].to_i
    end
    due = due-amount
    amount = -1*amount
    shop_id = current_shop['id']
    customer_transaction = CustomerTransaction.new(:due=>due,:amount=>amount,:customer_id=>customer_id,:shop_id=>shop_id)
    if customer_transaction.save
      redirect_to customers_path,:notice=>'customer amount updated !'
    else
    end
  end
end
