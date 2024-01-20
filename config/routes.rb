Rails.application.routes.draw do
  devise_for :users
  get "/map", to: "map#index"
  resources :map, only: [:index]
end
