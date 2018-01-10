class Stock < ApplicationRecord
  belongs_to :shop
  belongs_to :user
  has_many :stock_items
  has_many :products, through: :stock_items
end
