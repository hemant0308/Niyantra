class CustomerController < ApplicationController
  def get_customers
    connection = get_connection
    term = params['term']
    _customers = connection.exec_query("select id,name,phone,email,address from customers where (name like '%#{term}%' OR phone like '%#{term}%')")
    result = []
    _customers.each do |customer|
      result.push({'label':customer['name']+' '+customer['phone'],'value':customer['name'],'data':customer})
    end
    render 'json':result
  end
end
