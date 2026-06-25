Rails.application.routes.draw do
  post '/auth/login', to: 'authentication#login'
  post '/auth/oauth', to: 'authentication#oauth'
  post '/auth/register', to: 'users#create'
  get '/auth/profile', to: 'authentication#profile'
  post '/auth/verify-email', to: 'authentication#verify_email'
  post '/auth/resend-verification', to: 'authentication#resend_verification'

  namespace :admin do
    get 'dashboard/stats', to: 'dashboard#stats'
    get 'analytics', to: 'dashboard#analytics'
    resources :users
    resources :inventory, only: [:index, :create, :destroy] do
      member do
        put :stock
      end
    end
    resources :services do
      member do
        put :toggle
      end
    end
    

    
    resources :orders, only: [:index] do
      member do
        post :assign_to_branch
        post :assign_to_logistics
        post :process_refund
        put :status
        put :assign
      end
      collection do
        post :scan_barcode
      end
    end
  end

  namespace :center_admin, path: '/center-admin' do
    get 'settings', to: '/admin/dashboard#settings'
    put 'settings', to: '/admin/dashboard#update_settings'
    get 'worker-types', to: '/admin/dashboard#worker_types'
  end

  resources :orders, only: [:create, :index, :show] do
    member do
      get :tracking
      post :cancel
      post :rate
      post :reorder
    end
  end
  
  resources :addresses, only: [:index, :create, :update, :destroy] do
    member do
      put :set_default
    end
  end

  post '/webhooks/xendit', to: 'webhooks#xendit'
  
  resources :services, only: [] do
    collection do
      get :branches
      post :calculate
      get :time_slots
      get :availability
    end
  end
  get '/services/branch/:branch_id', to: 'services#by_branch'
  get '/service-items/branch/:branch_id', to: 'services#items_by_branch'

  resources :notifications, only: [:index] do
    collection do
      get :unread_count
      put :mark_read
    end
  end
  post 'delivery/calculate-distance', to: 'delivery#calculate_distance'
  get '/service-items', to: 'service_items#index'

  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
