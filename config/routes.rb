Rails.application.routes.draw do
  devise_for :users
  root 'home#index'
  get '/home'=>'home#index'

  get '/products' => 'product#index'
  post '/products' => 'product#create'
  get '/product/get_properties' => 'product#get_properties'
  post '/get_products' => 'product#get_products'
  get '/product/get_product_info' => 'product#get_product_info'
  post '/product/delete' => 'product#delete'

  get '/stock'=>'stock#index'
  get '/stock/new'=>'stock#new'
  post '/stock/new'=>'stock#create'
  post '/getstocks' => 'stock#get_stocks'
  get '/stock/getproducts' => 'stock#get_products'

  get '/billing'=>'billing#new'
  post '/billing'=>'billing#create'
  get '/billing/get_customers' => 'billing#get_customers'
  get '/billing/get_product' => 'billing#get_product'
  get '/billing/receipt/:id' => 'billing#receipt'


  get '/customers'=>'customer#index'
  post '/get_customers' => 'customer#get_customers'
  post '/customers/get_transactions' => 'customer#get_transactions'
  #admin namespace
  namespace :admin do
    get '/controls', to: 'dashboard#index'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
