Rails.application.routes.draw do
  post '/auth/login', to: 'authentication#login'
  get '/analytics', to: 'analytics#index'
  
  # Frontend compatibility routes
  get '/services/branches', to: 'branches#index'
  get '/services/branch/:branch_id', to: 'services#index'

  resources :branches
  resources :addresses
  resources :services
  resources :tickets
  
  resources :orders do
    resources :payments, only: [:index, :create]
  end

  mount ActionCable.server => '/cable'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
