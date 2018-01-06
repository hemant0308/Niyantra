class ApplicationJob < ActiveJob::Base
  def create_barcodes
    Product.all.each do |product|
      ApplicationController.helpers.make_barcode product
    end
  end
end
