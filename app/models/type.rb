class Type < ApplicationRecord
	has_many :type_brands
	has_many :brands,through: :type_brands
end
