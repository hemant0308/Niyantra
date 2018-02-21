class CustomerController < ApplicationController
  include ApplicationHelper
  def get_customers
    term = params['term']
    _customers = Customer.select("name,phone,email,address,id")
    result = []
    _customers.each do |customer|
      customer = customer.attributes
      last_transaction = CustomerTransaction.select('due').where(['customer_id = ? AND shop_id = ?',customer['id'],current_shop['id']]).order(id: :desc).limit(1)
      due = 0.0
      if last_transaction.length > 0
        due = last_transaction[0].due
      end
      customer['due'] = due
      result.push([customer['name'],customer['phone'],customer['email'],customer['address'],format_float(customer['due'].to_f),customer['id']])
    end
    render 'json':{'data':result}
  end
  def transactions
    customer = Customer.find(params[:id])
    @customer_name = customer.name;
    last_transaction = CustomerTransaction.select('due').where(['customer_id = ? AND shop_id = ?',params[:id],current_shop['id']]).order(id: :desc).limit(1)
    @customer_due = 0.0;
    if(last_transaction)
      @customer_due = last_transaction[0]['due'].to_i;
    end
    @customer_due = format_float(@customer_due)
  end
  def get_transactions
    length = params['length']
    start = params['start']
    search = params['search']['value']

    if search != ''
      search = " AND (DATE(created_at) = '#{search}') "
    end
    customer_id = params[:id]
    shop_id = current_shop['id']
    transactions = CustomerTransaction.select('*').where(["customer_id = ? AND shop_id = ? "+search,customer_id,shop_id]).order(id: :DESC)
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
      result.push([transaction.created_at.to_time.to_i,description,format_float(transaction.amount),format_float(transaction.due)])
    end
    count = CustomerTransaction.select("count(*) as count").where(["shop_id=? AND customer_id = ?",current_shop['id'],customer_id])
    count = count[0]['count'] 
    render :json=>{'data'=>result,'draw'=>params['draw'],'recordsTotal':count,'recordsFiltered':count}
  end
  def add_transaction
    customer_id = params[:customer_id]
    amount = params[:amount].to_i
    description = params[:description]
    last_transaction = CustomerTransaction.select('due').where(['customer_id = ? AND shop_id = ?',customer_id,current_shop['id']]).order(id: :desc).limit(1)
    due = 0.00
    if last_transaction.length > 0 
      due = last_transaction[0][:due].to_i
    end
    due = due-amount
    amount = -1*amount
    shop_id = current_shop['id']
    customer_transaction = CustomerTransaction.new(:due=>due,:amount=>amount,:customer_id=>customer_id,:shop_id=>shop_id)
    if customer_transaction.save
      redirect_to show_transactions_path customer_id,:notice=>'customer amount updated !'
    else
    end
  end
end
