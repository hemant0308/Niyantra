class Shop < ApplicationRecord
  belongs_to :country
  belongs_to :state
  belongs_to :district
  belongs_to :city
  belongs_to :shop_category
end
