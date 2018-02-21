class Product < ApplicationRecord
  belongs_to :brand
  belongs_to :type
  has_many :product_properties
  has_many :stock_items
  has_many :properties,through: :product_properties
end
