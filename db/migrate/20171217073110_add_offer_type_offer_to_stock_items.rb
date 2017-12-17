class AddOfferTypeOfferToStockItems < ActiveRecord::Migration[5.1]
  def change
    add_column :stock_items, :offer, :float
    add_column :stock_items, :offer_type, :integer
  end
end
