Rails.application.routes.draw do
  devise_for :users
  root 'home#index'
  get '/home'=>'home#index'

  get '/products' => 'product#index',:as=>"products"
  post '/products' => 'product#create'
  get '/product/get_properties' => 'product#get_properties'
  get '/get_products' => 'product#get_products'
  get '/product/get_product_info' => 'product#get_product_info'
  post '/product/delete' => 'product#delete'

  get '/stock'=>'stock#index'
  get '/stock/new'=>'stock#new'
  post '/stock'=>'stock#create'
  post '/getstocks' => 'stock#get_stocks'
  get '/stock/getproducts' => 'stock#get_products'
  get '/stock/get_stock_products' => 'stock#get_stock_products'
  get '/stock/get_barcodes' => 'stock#get_stock_barcodes'
  get '/billing'=>'billing#new'
  post '/billing'=>'billing#create'
  get '/billing/get_customers' => 'billing#get_customers'
  get '/billing/get_product' => 'billing#get_product'
  get '/billing/receipt/:id' => 'billing#receipt'
  get '/billing/bills' =>'billing#bills',:as=>'bills'
  get '/billing/get_bills'=>'billing#get_bills'

  get '/customers'=>'customer#index'
  get '/get_customers' => 'customer#get_customers'
  get '/customers/get_transactions' => 'customer#get_transactions' 
  get '/customers/:id' => 'customer#transactions' ,:as=>'show_transactions'
  post '/customers/add_trans' => 'customer#add_transaction' ,:as=>'customer_transaction'

  post '/profile/password' => 'profile#update_password', :as=>'update_password' 
  get '/profile' => 'profile#profile', :as=>'profile'
  post '/profile' => 'profile#update', :as=>'update_profile'
  #admin namespace
  namespace :admin do
    get '/controls', to: 'dashboard#index'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
