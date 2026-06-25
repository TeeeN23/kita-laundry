module Admin
  class OrdersController < ApplicationController
    before_action :authorize_request
    def index
      orders = Order.all
      if current_user.role == 'branch_manager'
        orders = orders.where(branch_id: get_branch_id)
      elsif current_user.role != 'center_admin' && current_user.role != 'superadmin'
        return render json: { errors: 'Unauthorized' }, status: :unauthorized
      end

      if params[:status].present? && params[:status] != 'all'
        backend_status = case params[:status]
                         when 'placed', 'assigned_to_branch', 'picked' then 'pending'
                         when 'in_process' then 'processing'
                         when 'delivered', 'out_for_delivery' then 'completed'
                         else params[:status]
                         end
        orders = orders.where(status: backend_status)
      end

      if params[:search].present?
        search_term = params[:search].strip.downcase
        orders = orders.where("'ORD-' || LPAD(CAST(id AS text), 4, '0') ILIKE ?", "%#{search_term}%")
      end

      orders = orders.order(created_at: :desc)

      page = (params[:page] || 1).to_i
      limit = (params[:limit] || 8).to_i
      total_items = orders.count
      orders_paginated = orders.offset((page - 1) * limit).limit(limit)

      formatted_orders = orders_paginated.map do |order|
        mapped_status = case order.status
                        when 'pending' then 'assigned_to_branch'
                        when 'driver_assigned' then 'driver_assigned'
                        when 'picked' then 'picked'
                        when 'processing' then 'in_process'
                        when 'completed' then 'delivered'
                        else order.status
                        end
        {
          _id: order.id.to_s,
          id: order.id.to_s,
          orderNumber: "ORD-#{order.id.to_s.rjust(4, '0')}",
          customer: { 
            name: "#{order.user.first_name} #{order.user.last_name}".strip, 
            phone: order.user.phone 
          },
          customerName: "#{order.user.first_name} #{order.user.last_name}".strip,
          customerPhone: order.user.phone,
          status: mapped_status,
          pricing: {
            total: order.total_price.to_f,
            subtotal: order.total_price.to_f
          },
          totalAmount: order.total_price.to_f,
          createdAt: order.created_at.iso8601,
          branchId: order.branch_id.to_s,
          pickupDate: order.created_at.iso8601,
          serviceType: order.service_type,
          items: order.order_items.map { |item| { serviceType: item.service.name, quantity: item.weight_kg, totalPrice: (item.weight_kg * item.service.price_per_kg).to_f } }
        }
      end

      render json: { 
        success: true, 
        data: { 
          orders: formatted_orders,
          pagination: {
            totalItems: total_items,
            currentPage: page,
            totalPages: (total_items.to_f / limit).ceil
          }
        } 
      }
    end

    def assign_to_branch
      order = Order.find(params[:id])
      order.update(branch_id: params[:branchId])
      render json: { success: true, message: 'Assigned to branch' }
    end

    def assign_to_logistics
      render json: { success: true, message: 'Assigned to logistics' }
    end

    def process_refund
      render json: { success: true, message: 'Refund processed' }
    end

    def status
      order = Order.find(params[:id])
      backend_status = case params[:status]
                       when 'placed', 'assigned_to_branch' then 'pending'
                       when 'driver_assigned' then 'driver_assigned'
                       when 'picked' then 'picked'
                       when 'in_process' then 'processing'
                       when 'delivered', 'out_for_delivery' then 'completed'
                       else params[:status]
                       end
      if order.update(status: backend_status)
        render json: { success: true, message: 'Status updated' }
      else
        render json: { success: false, message: 'Failed to update status' }, status: :unprocessable_entity
      end
    end

    def assign
      order = Order.find(params[:id])
      
      staff_id = params[:staffId] || params[:staff_id]
      staff = User.find(staff_id)
      
      if staff.role == 'driver'
        if order.status != 'pending'
          return render json: { success: false, message: 'Driver can only be assigned to pending orders' }, status: :unprocessable_entity
        end
        new_status = :driver_assigned
      else
        if order.status != 'picked'
          return render json: { success: false, message: 'Order must be arrived at branch (Picked Up) before assigning to a washer/ironer' }, status: :unprocessable_entity
        end
        new_status = :processing
      end
      
      active_orders_count = staff.assigned_orders.where(status: Order.statuses[new_status]).count
      if active_orders_count >= 3
        return render json: { success: false, message: 'Staff already has 3 active orders and cannot take more' }, status: :unprocessable_entity
      end

      if order.update(assigned_staff_id: staff_id, status: new_status)
        render json: { success: true, message: 'Assigned to staff', order: order }
      else
        render json: { success: false, message: 'Failed to assign staff' }, status: :unprocessable_entity
      end
    end

    def scan_barcode
      barcode = params[:barcode].to_s
      order_id = barcode.split('-')[1] rescue barcode
      order = Order.find_by(id: order_id.to_i)
      
      if order
        if params[:newStatus]
          backend_status = case params[:newStatus]
                           when 'placed', 'assigned_to_branch' then 'pending'
                           when 'driver_assigned' then 'driver_assigned'
                           when 'picked' then 'picked'
                           when 'in_process' then 'processing'
                           when 'delivered', 'out_for_delivery' then 'completed'
                           else params[:newStatus]
                           end
          order.update(status: backend_status)
          render json: { success: true, message: 'Status updated via scan' }
        else
          mapped_status = case order.status
                          when 'pending' then 'assigned_to_branch'
                          when 'driver_assigned' then 'driver_assigned'
                          when 'picked' then 'picked'
                          when 'processing' then 'in_process'
                          when 'completed' then 'delivered'
                          else order.status
                          end
          render json: { success: true, data: { order: { _id: order.id.to_s, orderNumber: "ORD-#{order.id.to_s.rjust(4, '0')}", status: mapped_status } } }
        end
      else
        render json: { success: false, message: 'Order not found for this barcode' }, status: :not_found
      end
    end

    private




  end
end
