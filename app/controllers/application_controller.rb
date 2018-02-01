class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  helper :all
  helper_method :current_shop
  def current_shop
    @current_shop ||= session[:shop]
  end
  def get_connection
  	@connection ||= ActiveRecord::Base.connection
  end
  def after_sign_in_path_for(resource)
    session[:shop] = current_user.shop
    root_path
  end
  helper :all
end
