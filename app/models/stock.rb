class Stock < ApplicationRecord
  belongs_to :shop
  belongs_to :user
  belongs_to :supplier
  has_many :stock_items
  has_many :products, through: :stock_items
end
