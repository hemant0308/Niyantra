module ApplicationHelper
  def get_bill_no(id)
    id.to_s.rjust(6,'0')
  end
  def format_float(number)
  	if number
  		number = number.to_f
  		return "#{'%.2f' % number}"
  	end
  end
end
