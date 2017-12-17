class AddOfferOfferTypeToBill < ActiveRecord::Migration[5.1]
  def change
    add_column :bills, :offer, :float
    add_column :bills, :offer_type, :integer
  end
end
