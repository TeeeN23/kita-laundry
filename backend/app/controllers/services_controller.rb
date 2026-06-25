class ServicesController < ApplicationController

  def branches
    # Format data agar sesuai dengan yang diharapkan oleh Frontend (Next.js)
    formatted_branches = Branch.all.map do |branch|
      {
        _id: branch.id.to_s,
        name: branch.name,
        code: branch.id.to_s,
        address: {
          addressLine1: branch.address,
          city: "Medan"
        },
        phone: branch.phone
      }
    end

    render json: {
      success: true,
      data: {
        branches: formatted_branches
      }
    }, status: :ok
  end

  def by_branch
    services = Service.where(branch_id: params[:branch_id]).map do |s|
      {
        _id: s.id.to_s,
        name: s.name,
        code: s.id.to_s,
        displayName: s.name,
        description: s.description || '',
        turnaroundTime: { standard: 48, express: 24 }
      }
    end
    render json: { success: true, data: { services: services } }, status: :ok
  end

  def items_by_branch
    branch_services = Service.where(branch_id: params[:branch_id])
    response_items = {}
    
    # Ambil semua data item satuan dari database
    all_service_items = ServiceItem.all
    grouped_items = all_service_items.group_by(&:service_type)
    
    branch_services.each do |s|
      price = s.price_per_kg || 7000
      
      # Item pertama selalu Kiloan (per KG)
      items = [
        { id: "#{s.id}_kg", name: "Berat Cucian (per KG)", basePrice: price, category: "Kiloan" }
      ]
      
      # Pemetaan nama layanan kiloan ke jenis layanan satuan
      name_down = s.name.downcase
      type = 'wash_fold' # default
      
      if name_down.include?('sepatu') || name_down.include?('tas') || name_down.include?('premium')
        type = 'premium_laundry'
      elsif name_down.include?('setrika') && name_down.include?('cuci')
        type = 'wash_iron'
      elsif name_down.include?('setrika')
        type = 'steam_press'
      elsif name_down.include?('jas') || name_down.include?('kering') || name_down.include?('dry')
        type = 'dry_clean'
      end
      
      # Tambahkan semua opsi satuan yang sesuai
      if grouped_items[type]
        grouped_items[type].each do |si|
          items << {
            id: "si_#{si.id}",
            name: "#{si.name} (Satuan)",
            basePrice: si.base_price,
            category: "Satuan - #{si.category.capitalize}"
          }
        end
      end
      
      response_items[s.id.to_s] = items
    end

    render json: { success: true, data: response_items }, status: :ok
  end

  def calculate
    Rails.logger.debug "CALCULATE PARAMS: #{params.inspect}"
    subtotal = 0
    (params[:items] || []).each do |item|
      price = 0
      item_id = item[:itemType].to_s
      
      if item_id.end_with?('_kg')
        service_id = item_id.split('_').first
        s = Service.find_by(id: service_id)
        price = s ? s.price_per_kg : 7000
      elsif item_id.start_with?('si_')
        si_id = item_id.split('_').last
        si = ServiceItem.find_by(id: si_id)
        price = si ? si.base_price : 0
      end
      
      # Frontend mungkin mengirim quantity berupa float untuk KG (misal: 2.5 KG)
      quantity = item[:quantity].to_f || 1.0
      subtotal += price * quantity
    end
    
    subtotal = (subtotal * 1.5).to_i if params[:isExpress]
    tax = (subtotal * 0.1).to_i
    total = subtotal + tax
    
    render json: { success: true, data: { subtotal: subtotal.to_i, tax: tax.to_i, orderTotal: { total: total.to_i } } }
  end

  def time_slots
    slots = TimeSlot.where(is_active: true).order(start_time: :asc).map { |t| "#{t.start_time}-#{t.end_time}" }
    render json: { success: true, data: { timeSlots: slots } }
  end

  def availability
    render json: { success: true, data: { available: true } }
  end
end

