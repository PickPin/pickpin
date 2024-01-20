Rails.application.routes.draw do
  devise_for :users
  # get "/map", to: "map#index"

  # resources :map, only: [:index]

  root "map#index"

  get 'debug', to: 'debug#show'
end
