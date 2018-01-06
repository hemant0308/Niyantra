module ProductHelper
  def make_barcode(product)
    require 'barby'
    require 'barby/barcode/code_128'
    require 'barby/outputter/png_outputter'
    id = product.id.to_s.rjust(8,'0');
    barcode = Barby::Code128B.new(id)
    blob = Barby::PngOutputter.new(barcode).to_png({'height'=>50}) #Raw PNG data
    File.open("vendor/barcodes/#{id}.png", 'wb'){|f| f.write blob }
  end
end
