class AddCustomerdetailsToBill < ActiveRecord::Migration[5.1]
  def change
    add_column :bills,:customer_name,:string
    add_column :bills,:customer_phone,:string
    add_column :bills,:customer_email,:string
    add_column :bills,:customer_address,:text
  end
end
