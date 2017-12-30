Rails.application.routes.draw do
  devise_for :users
  root 'home#index'
  get '/home'=>'home#index'
  get '/billing'=>'billing#index'
  get '/customers'=>'customer#index'
  get '/stock'=>'stock#index'
  get '/stock/new'=>'stock#new'
  post '/stock/new'=>'stock#create'
  get '/products' => 'product#index'
  #admin namespace
  namespace :admin do
    get '/controls', to: 'dashboard#index'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
