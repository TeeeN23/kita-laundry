module Admin
  class DashboardController < ApplicationController
    before_action :authorize_request
    def stats
      if current_user.role == 'center_admin'
        orders = Order.all
        customers_count = User.where(role: :customer).count
      elsif current_user.role == 'branch_manager'
        orders = Order.where(branch_id: get_branch_id)
        # For simple demonstration, customer count is global or from orders
        customers_count = orders.select(:user_id).distinct.count
      else
        return render json: { errors: 'Unauthorized' }, status: :unauthorized
      end

      branch_info = if current_user.role == 'center_admin'
                      { _id: 'center', name: 'Admin Pusat', code: 'HQ' }
                    else
                      branch = Branch.find_by(id: get_branch_id)
                      { _id: branch&.id.to_s, name: branch&.name || 'Cabang', code: 'BR' }
                    end

      today = Time.zone.now.beginning_of_day
      pending_orders = orders.where(status: 'pending').count
      processing_orders = orders.where(status: 'processing').count
      ready_orders = orders.where(status: 'ready_for_delivery').count
      completed_today = orders.where(status: 'completed', updated_at: today..Time.zone.now).count
      today_orders = orders.where(created_at: today..Time.zone.now).count
      weekly_orders = orders.where(created_at: 1.week.ago..Time.zone.now).count
      today_revenue = orders.where(payment_status: 'paid', updated_at: today..Time.zone.now).sum(:total_price).to_f
      
      staff_count = User.where(role: ['staff', 'branch_manager', 'driver', 'washer', 'ironer']).count
      active_staff = staff_count # Mock active staff

      recent_orders = orders.order(created_at: :desc).limit(5).map do |o|
        {
          _id: o.id.to_s,
          orderNumber: "ORD-#{o.id.to_s.rjust(4, '0')}",
          status: o.status,
          amount: o.total_price.to_f,
          itemCount: o.order_items.sum(:weight_kg).to_i,
          isExpress: false,
          createdAt: o.created_at.iso8601,
          customer: { name: o.user.first_name, phone: o.user.phone }
        }
      end

      render json: {
        success: true,
        data: {
          branch: branch_info,
          metrics: {
            todayOrders: today_orders,
            pendingOrders: pending_orders,
            processingOrders: processing_orders,
            readyOrders: ready_orders,
            completedToday: completed_today,
            todayRevenue: today_revenue,
            weeklyOrders: weekly_orders,
            staffCount: staff_count,
            activeStaff: active_staff
          },
          recentOrders: recent_orders,
          staffPerformance: [],
          alerts: []
        }
      }
    end

    def analytics
      timeframe_param = params[:timeframe] || '7d'
      if timeframe_param.include?('h')
        timeframe = (timeframe_param.to_i / 24.0).ceil
      else
        timeframe = timeframe_param.to_i
      end
      timeframe = 1 if timeframe <= 0
      
      start_date = timeframe.days.ago.beginning_of_day

      if current_user.role == 'center_admin'
        orders = Order.where(created_at: start_date..Time.zone.now)
        branch_info = { _id: 'center', name: 'Admin Pusat', code: 'HQ' }
      elsif current_user.role == 'branch_manager'
        orders = Order.where(branch_id: get_branch_id, created_at: start_date..Time.zone.now)
        branch = Branch.find_by(id: get_branch_id)
        branch_info = { _id: branch&.id.to_s, name: branch&.name || 'Cabang', code: "BR-#{branch&.id}" }
      else
        return render json: { errors: 'Unauthorized' }, status: :unauthorized
      end

      total_orders = orders.count
      total_revenue = orders.where(payment_status: 'paid').sum(:total_price).to_f
      avg_order_value = total_orders > 0 ? (total_revenue / total_orders).to_f : 0

      daily_stats = (0..timeframe-1).to_a.reverse.map do |i|
        date = i.days.ago.to_date
        day_orders = orders.where(created_at: date.beginning_of_day..date.end_of_day)
        {
          _id: { year: date.year, month: date.month, day: date.day },
          orders: day_orders.count,
          revenue: day_orders.where(payment_status: 'paid').sum(:total_price).to_f
        }
      end

      service_stats_hash = Hash.new { |h, k| h[k] = { count: 0, revenue: 0.0 } }
      orders.includes(order_items: :service).find_each do |order|
        order.order_items.each do |item|
          service_name = item.service&.name || item.item_name || 'Lainnya'
          service_stats_hash[service_name][:count] += 1
          service_stats_hash[service_name][:revenue] += (item.unit_price.to_f * item.weight_kg.to_f)
        end
      end
      service_stats = service_stats_hash.map do |name, data|
        { _id: name, count: data[:count], revenue: data[:revenue] }
      end

      status_distribution = orders.group(:status).count.map do |status, count|
        { _id: status, count: count }
      end

      staff_performance = orders.where.not(assigned_staff_id: nil).group(:assigned_staff_id).count.map do |staff_id, count|
        staff = User.find_by(id: staff_id)
        {
          name: staff&.first_name || 'Unknown',
          ordersProcessed: count,
          revenue: orders.where(assigned_staff_id: staff_id, payment_status: 'paid').sum(:total_price).to_f
        }
      end

      data = {
        branch: branch_info,
        timeframe: params[:timeframe] || '7d',
        totals: {
          totalOrders: total_orders,
          totalRevenue: total_revenue,
          avgOrderValue: avg_order_value
        },
        dailyStats: daily_stats,
        serviceStats: service_stats,
        statusDistribution: status_distribution,
        staffPerformance: staff_performance
      }

      render json: { success: true, data: data }, status: :ok
    end

    def settings
      render json: {
        success: true,
        data: {
          settings: {
            autoAssignOrders: true,
            prioritizeExpress: true,
            maxOrdersPerStaff: 10
          }
        }
      }
    end

    def update_settings
      render json: { success: true, message: 'Settings updated successfully' }
    end

    def worker_types
      render json: {
        success: true,
        data: {
          workerTypes: [
            { key: 'washer', value: 'washer', label: 'Washer (Pencuci)' },
            { key: 'dry_cleaner', value: 'dry_cleaner', label: 'Dry Cleaner' },
            { key: 'ironer', value: 'ironer', label: 'Ironer (Penyetrika)' },
            { key: 'packer', value: 'packer', label: 'Packer (Pengemas)' },
            { key: 'quality_checker', value: 'quality_checker', label: 'QC' },
            { key: 'general', value: 'general', label: 'Umum' }
          ]
        }
      }
    end

    private




  end
end
