class CreateBills < ActiveRecord::Migration[5.1]
  def change
    create_table :bills do |t|
      t.references :customer, foreign_key: true
      t.references :shop, foreign_key: true
      t.float :total_price
      t.float :paid_amount

      t.timestamps
    end
  end
end
