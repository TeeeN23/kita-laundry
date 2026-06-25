class OrdersController < ApplicationController
  before_action :authorize_request

  def create
    ActiveRecord::Base.transaction do
      pickup_address = current_user.addresses.find_by(id: params[:pickupAddressId]) || current_user.addresses.first || current_user.addresses.create!(full_address: 'Dummy Address, Medan')
      delivery_address = current_user.addresses.find_by(id: params[:deliveryAddressId]) || pickup_address

      @order = Order.new(
        user: current_user,
        branch_id: params[:branchId] || Branch.first.id,
        pickup_address_id: pickup_address.id,
        delivery_address_id: delivery_address.id,
        notes: params[:specialInstructions],
        payment_method: params[:paymentMethod] || 'cod',
        service_type: params[:serviceType] || 'full_service'
      )
      
      subtotal = 0
      if params[:items].present?
        params[:items].each do |item|
          price = 0
          item_id = item[:itemType].to_s
          quantity = item[:quantity].to_f || 1.0
          
          if item_id.end_with?('_kg')
            service_id = item_id.split('_').first
            s = Service.find_by(id: service_id)
            if s
              price = s.price_per_kg
              @order.order_items.build(service: s, weight_kg: quantity, item_name: s.name, unit_price: price)
            else
              price = 7000
            end
          elsif item_id.start_with?('si_')
            si_id = item_id.split('_').last
            si = ServiceItem.find_by(id: si_id)
            if si
              price = si.base_price
              s = Service.find_by(category: si.category) || Service.first
              @order.order_items.build(service: s, weight_kg: quantity, item_name: si.name, unit_price: price)
            end
          end
          
          subtotal += price * quantity
        end
      end
      
      subtotal = (subtotal * 1.5).to_i if params[:isExpress]
      tax = (subtotal * 0.1).to_i
      
      delivery_charge = 0
      if params[:deliveryDetails].present? && params[:deliveryDetails][:deliveryCharge].present?
        delivery_charge = params[:deliveryDetails][:deliveryCharge].to_i
      end
      
      @order.total_price = subtotal.to_i + tax + delivery_charge
      @order.payment_status = :unpaid



      if @order.save!
        if @order.payment_method == 'online'
          invoice_url = create_xendit_invoice(@order)
          @order.update!(invoice_url: invoice_url, status: :pending)
        end
        order_hash = @order.as_json
        order_hash['orderNumber'] = "ORD-#{@order.id.to_s.rjust(4, '0')}"
        render json: { success: true, data: { order: order_hash, invoice_url: @order.invoice_url } }, status: :created
      else
        render json: { success: false, errors: @order.errors.full_messages }, status: :unprocessable_entity
      end
    end
  rescue => e
    render json: { success: false, message: e.message }, status: :internal_server_error
  end

  def index
    orders = current_user.orders

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
      if search_term.start_with?("ord-")
        order_id = search_term.gsub("ord-", "").to_i
        orders = orders.where(id: order_id)
      else
        orders = orders.where(id: search_term.to_i)
      end
    end

    orders = orders.order(created_at: :desc)

    page = (params[:page] || 1).to_i
    limit = (params[:limit] || 8).to_i
    total_items = orders.count
    orders_paginated = orders.offset((page - 1) * limit).limit(limit)
    
    formatted_orders = orders_paginated.map do |order|
      mapped_status = case order.status
                      when 'pending' then 'assigned_to_branch'
                      when 'processing' then 'in_process'
                      when 'completed' then 'delivered'
                      else order.status
                      end
      {
        _id: order.id.to_s,
        id: order.id.to_s,
        orderNumber: "ORD-#{order.id.to_s.rjust(4, '0')}",
        status: mapped_status,
        createdAt: order.created_at.iso8601,
        paymentMethod: order.payment_method == 'online' ? 'online' : 'cod',
        paymentStatus: order.payment_status || 'pending',
        pricing: {
          subtotal: order.total_price,
          total: order.total_price
        },
        pickupDate: order.created_at.iso8601,
        items: order.order_items.map { |item| { itemType: item.service.name, quantity: item.weight_kg } },
        branch: order.branch ? { id: order.branch.id.to_s, name: order.branch.name } : nil,
        review: order.review ? { rating: order.review.rating, comment: order.review.comment } : nil
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

  def show
    order = Order.find(params[:id])
    
    if order.payment_status == 'unpaid' && order.xendit_invoice_id.present?
      require 'net/http'
      require 'uri'
      require 'json'
      
      uri = URI.parse("https://api.xendit.co/v2/invoices/#{order.xendit_invoice_id}")
      request = Net::HTTP::Get.new(uri)
      request.basic_auth(ENV['XENDIT_API_KEY'], "")
      
      req_options = { use_ssl: uri.scheme == "https" }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      
      if response.code.to_i == 200
        result = JSON.parse(response.body)
        if result['status'] == 'PAID' || result['status'] == 'SETTLED'
          order.update(payment_status: :paid)
        elsif result['status'] == 'EXPIRED'
          order.update(payment_status: :expired, status: :cancelled)
        end
      end
    end
    
    mapped_status = case order.status
                    when 'pending' then 'assigned_to_branch'
                    when 'processing' then 'in_process'
                    when 'completed' then 'delivered'
                    else order.status
                    end

    formatted_order = {
      _id: order.id.to_s,
      id: order.id.to_s,
      orderNumber: "ORD-#{order.id.to_s.rjust(4, '0')}",
      status: mapped_status,
      createdAt: order.created_at.iso8601,
      paymentMethod: order.payment_method == 'online' ? 'online' : 'cod',
      paymentStatus: order.payment_status || 'pending',
      pricing: {
        subtotal: order.total_price,
        expressCharge: 0,
        deliveryCharge: 0,
        discount: 0,
        tax: 0,
        total: order.total_price
      },
      pickupDate: order.created_at.iso8601,
      pickupTimeSlot: "09:00-11:00",
      isExpress: false,
      specialInstructions: order.notes,
      items: order.order_items.map do |item|
        price = item.unit_price || item.service.price_per_kg
        {
          name: item.item_name || item.service.name,
          service: item.service.name,
          category: item.service.category,
          quantity: item.weight_kg,
          unitPrice: price,
          totalPrice: item.weight_kg * price
        }
      end,
      pickupAddress: order.pickup_address ? {
        name: "#{order.user.first_name} #{order.user.last_name}".strip,
        addressLine1: order.pickup_address.address_line_1,
        addressLine2: order.pickup_address.address_line_2,
        city: order.pickup_address.city,
        pincode: order.pickup_address.pincode,
        phone: order.pickup_address.phone
      } : nil,
      deliveryAddress: order.delivery_address ? {
        name: "#{order.user.first_name} #{order.user.last_name}".strip,
        addressLine1: order.delivery_address.address_line_1,
        addressLine2: order.delivery_address.address_line_2,
        city: order.delivery_address.city,
        pincode: order.delivery_address.pincode,
        phone: order.delivery_address.phone
      } : nil,
      review: order.review ? { rating: order.review.rating, comment: order.review.comment } : nil,
      statusHistory: [
        { status: 'placed', updatedAt: order.created_at.iso8601 },
        (order.status != 'pending' ? { status: mapped_status, updatedAt: order.updated_at.iso8601 } : nil)
      ].compact,
      branch: order.branch ? {
        id: order.branch.id.to_s,
        name: order.branch.name,
        phone: order.branch.phone
      } : nil
    }
    
    render json: { success: true, data: { order: formatted_order } }
  rescue ActiveRecord::RecordNotFound
    render json: { success: false, message: 'Order not found' }, status: :not_found
  end

  def tracking
    order = Order.find(params[:id])
    
    tracking_data = [
      { status: 'placed', date: order.created_at.iso8601 }
    ]
    
    # Enum for status: pending(0), processing(1), ready_for_delivery(2), completed(3), cancelled(4)
    # This is a simple approximation
    if order.status_before_type_cast >= 1 && order.status != 'cancelled'
      tracking_data << { status: 'in_process', date: (order.created_at + 1.hour).iso8601 }
    end
    
    if order.status_before_type_cast >= 2 && order.status != 'cancelled'
      tracking_data << { status: 'ready', date: order.updated_at.iso8601 }
    end

    render json: { success: true, data: { tracking: tracking_data } }
  end

  def cancel
    order = Order.find(params[:id])
    if order.status == 'pending'
      order.update(status: :cancelled)
      render json: { success: true, message: 'Order cancelled' }
    else
      render json: { success: false, message: 'Order cannot be cancelled' }, status: :unprocessable_entity
    end
  end

  def review
    order = current_user.orders.find(params[:id])
    if order.status != 'completed'
      return render json: { success: false, message: 'Pesanan belum selesai' }, status: :unprocessable_entity
    end
    if order.review.present?
      return render json: { success: false, message: 'Pesanan sudah diulas' }, status: :unprocessable_entity
    end

    review = Review.new(
      order: order,
      user: current_user,
      rating: params[:rating],
      comment: params[:comment]
    )

    if review.save
      render json: { success: true, review: review }
    else
      render json: { success: false, message: review.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def reorder
    render json: { success: true, message: 'Reordered' }
  end

  private

  def create_xendit_invoice(order)
    require 'net/http'
    require 'uri'
    require 'json'

    uri = URI.parse("https://api.xendit.co/v2/invoices")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(ENV['XENDIT_API_KEY'], "")
    request.content_type = "application/json"
    
    # Need to pass an external_id, amount, payer_email, description
    request.body = JSON.dump({
      "external_id" => "ORD-#{order.id}-#{Time.now.to_i}",
      "amount" => order.total_price.to_i,
      "payer_email" => order.user.email,
      "description" => "Payment for Laundry Order ##{order.id}",
      "success_redirect_url" => "#{ENV['FRONTEND_URL'] || 'http://localhost:3000'}/customer/orders/#{order.id}?success=true",
      "failure_redirect_url" => "#{ENV['FRONTEND_URL'] || 'http://localhost:3000'}/customer/orders/#{order.id}?success=false"
    })

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
    
    result = JSON.parse(response.body)
    
    if response.code.to_i >= 200 && response.code.to_i < 300
      order.update(xendit_invoice_id: result['id'])
      return result['invoice_url']
    else
      raise "Xendit API Error: #{result['message']}"
    end
  end
end
