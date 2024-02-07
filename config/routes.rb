Rails.application.routes.draw do
  devise_for :users
  # get "/map", to: "map#index"
  # resources :map
  root "map#index"
  
  resources :images
  delete 'images/destroy/:image_id', to: 'images#destroy'
  get 'users/search', to: 'users#search'
  resources :users, only: [:index, :show, :edit, :update] do
    resource :relationships, only: [:create, :destroy]
  	get "followings" => "relationships#followings", as: "followings"
  	get "followers" => "relationships#followers", as: "followers"
  end

  get 'images/show/:image_id', to: 'images#show'
  post 'likes/:image_id', to: 'likes#create'
  delete 'likes/:image_id', to: 'likes#destroy'
  resources :notifications, only: [:index]
  
  delete 'notifications', to: 'notifications#destroy'

  get 'debug', to: 'debug#show'
end
