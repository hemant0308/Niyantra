class BillItem < ApplicationRecord
  belongs_to :bill
  belongs_to :product
end
