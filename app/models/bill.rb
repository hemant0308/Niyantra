class Bill < ApplicationRecord
  belongs_to :customer
  belongs_to :shop
  has_many :bill_items
  has_many :products ,through: :bill_items
end
