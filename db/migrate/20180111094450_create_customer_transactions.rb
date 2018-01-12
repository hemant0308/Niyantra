class CreateCustomerTransactions < ActiveRecord::Migration[5.1]
  def change
    create_table :customer_transactions do |t|
      t.references :customer,foreign_key:true
      t.references :shop,foreign_key:true
      t.references :bill,foreign_key:true
      t.float :amount
      t.float :due
      t.timestamps
    end
  end
end
