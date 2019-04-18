Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  require "sidekiq/web"
  mount Sidekiq::Web => "/sidekiq"

  namespace :api do
    namespace :v1 do
      resources :blocks, only: %i(index show)
      get "/transactions/:id", to: "ckb_transactions#show", as: "ckb_transaction"
      resources :address_transactions, only: :show
      resources :block_transactions, only: :show
      resources :cell_input_lock_scripts, only: :show
    end
  end
end
