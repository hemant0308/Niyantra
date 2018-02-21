class Brand < ApplicationRecord
	has_many :type_brands
	has_many :types,through: :type_brands
end
