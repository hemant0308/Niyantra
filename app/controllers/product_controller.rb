class ProductController < ApplicationController
	def index
		@product = Product.new
	end
end
