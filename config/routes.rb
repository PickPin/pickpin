Rails.application.routes.draw do
  get "/map", to: "map#index"
  resources :map, only: [:index]
end
