class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper :all
  def current_user
  	@current_user ||= 1
  end
  def current_shop
  	@current_shop ||= 1
  end
  def get_connection
  	@connection ||= ActiveRecord::Base.connection
  end
  helper :all
end
