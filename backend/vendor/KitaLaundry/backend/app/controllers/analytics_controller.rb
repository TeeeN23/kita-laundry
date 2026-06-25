class AnalyticsController < ApplicationController
  before_action :authorize_request
  before_action :require_admin_or_manager

  def index
    # Scope based on role
    orders_scope = if current_user.branch_manager?
                     Order.where(branch_id: current_user.branch_id) # assuming branch_id on user exists or is derived
                   else
                     Order.all
                   end

    total_revenue = orders_scope.sum(:total_amount)
    total_orders = orders_scope.count
    completed_orders = orders_scope.where(status: :delivered).count
    active_orders = orders_scope.where.not(status: [:delivered, :cancelled]).count

    render json: {
      total_revenue: total_revenue,
      total_orders: total_orders,
      completed_orders: completed_orders,
      active_orders: active_orders
    }
  end

  private

  def require_admin_or_manager
    unless current_user.admin? || current_user.center_admin? || current_user.branch_manager?
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end
end
