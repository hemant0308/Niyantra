class AddShopToUser < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :shop, foreign_key: true
  end
end
