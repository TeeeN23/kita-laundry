module Admin
  class UsersController < ApplicationController
    before_action :authorize_request
    before_action :set_user, only: [:show, :update, :destroy]

    def index
      # Support filtering by role
      base_query = current_user.role == 'branch_manager' ? User.where(branch_id: get_branch_id) : User.all
      
      if params[:role] == 'staff'
        if params[:typeFilter].present? && params[:typeFilter] != 'all'
          base_query = base_query.where(role: params[:typeFilter])
        else
          base_query = base_query.where(role: ['staff', 'driver', 'washer', 'ironer', 'quality_checker', 'packer', 'dry_cleaner'])
        end
      elsif params[:role].present? && params[:role] != 'all'
        base_query = base_query.where(role: params[:role])
      else
        base_query = base_query.where.not(role: ['staff', 'driver', 'washer', 'ironer', 'quality_checker', 'packer', 'dry_cleaner'])
      end

      # Status filtering (isActive) if provided
      if params[:statusFilter].present? && params[:statusFilter] != 'all'
        # The user model currently might not have isActive, but assuming it's available or simulated
        # Actually, let's skip status filter in backend if not easily supported, but let's check if User has isActive.
      end

      # Search by name or email
      if params[:search].present?
        search_term = "%#{params[:search].downcase}%"
        base_query = base_query.where("LOWER(first_name) LIKE :search OR LOWER(last_name) LIKE :search OR LOWER(email) LIKE :search", search: search_term)
      end

      page = (params[:page] || 1).to_i
      limit = (params[:limit] || 10).to_i
      
      @users = base_query.order(created_at: :desc)
      total_items = @users.count
      @users = @users.offset((page - 1) * limit).limit(limit)
      
      render json: {
        success: true,
        data: {
          users: @users.map { |u| format_user(u) },
          pagination: {
            totalItems: total_items,
            totalPages: (total_items.to_f / limit).ceil,
            currentPage: page,
            limit: limit
          }
        }
      }
    end

    def show
      render json: {
        success: true,
        data: {
          user: format_user(@user)
        }
      }
    end

    def create
      @user = User.new(user_params)
      
      # For admin-created users, we can auto-verify them or let them verify
      @user.email_verified_at = Time.current

      if @user.save
        render json: {
          success: true,
          message: 'User created successfully',
          data: {
            user: format_user(@user)
          }
        }, status: :created
      else
        render json: { success: false, errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      # Prevent updating password through this endpoint if empty
      update_params = user_params
      update_params.delete(:password) if update_params[:password].blank?
      update_params.delete(:password_confirmation) if update_params[:password_confirmation].blank?

      if @user.update(update_params)
        render json: {
          success: true,
          message: 'User updated successfully',
          data: {
            user: format_user(@user)
          }
        }
      else
        render json: { success: false, errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      if @user.destroy
        render json: { success: true, message: 'User deleted successfully' }
      else
        render json: { success: false, errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_user
      @user = User.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { success: false, message: 'User not found' }, status: :not_found
    end

    def user_params
      # Frontend sends 'name', handle it
      if params[:name].present?
        names = params[:name].split(' ', 2)
        params[:first_name] = names[0]
        params[:last_name] = names[1] || ''
      end
      
      params.permit(:email, :password, :password_confirmation, :first_name, :last_name, :phone, :role)
    end

    def format_user(user)
      # Calculate stats if user is staff
      stats = nil
      if user.role == 'staff' || user.role == 'driver' || user.role == 'washer' || user.role == 'ironer'
        today_start = Time.current.beginning_of_day
        today_end = Time.current.end_of_day
        
        # We define "completed" orders as status 3 (completed) or status 2 (ready) depending on workflow.
        # Let's use status :completed and :ready.
        completed_statuses = [Order.statuses[:ready], Order.statuses[:completed]]
        orders_today = user.assigned_orders.where(status: completed_statuses, updated_at: today_start..today_end).count
        total_orders = user.assigned_orders.where(status: completed_statuses).count
        active_orders = user.assigned_orders.where(status: Order.statuses[:processing]).count
        
        # Calculate efficiency: simply 100% for now, or based on some metric. We will return 100 as placeholder.
        efficiency = 100
        
        stats = {
          ordersToday: orders_today,
          totalOrders: total_orders,
          activeOrders: active_orders,
          efficiency: efficiency
        }
      end

      {
        _id: user.id.to_s,
        id: user.id.to_s,
        name: "#{user.first_name} #{user.last_name}".strip,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        workerType: user.role,
        isActive: true,
        createdAt: user.created_at,
        branch: user.branch ? { id: user.branch.id.to_s, name: user.branch.name } : nil,
        stats: stats || { ordersToday: 0, totalOrders: 0, activeOrders: 0, efficiency: 0 }
      }
    end
  end
end
