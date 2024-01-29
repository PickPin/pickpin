Rails.application.routes.draw do
  devise_for :users
  # get "/map", to: "map#index"
  # resources :map
  root "map#index"

  resources :images
  get 'users/search', to: 'users#search'
  resources :users, only: [:index, :show, :edit, :update] do
    resource :relationships, only: [:create, :destroy]
  	get "followings" => "relationships#followings", as: "followings"
  	get "followers" => "relationships#followers", as: "followers"
  end

  get 'debug', to: 'debug#show'
end
