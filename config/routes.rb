Rails.application.routes.draw do
  devise_for :users
  # get "/map", to: "map#index"
  # resources :map
  root "map#index"

  resources :images
  get 'users/search', to: 'users#search'

  get 'debug', to: 'debug#show'
end
