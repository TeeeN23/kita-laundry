class DeliveryController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'json'

  # We don't require authorization just for calculation if it's called during checkout
  # or we could use before_action :authorize_request if needed
  
  def calculate_distance
    branch = Branch.find_by(id: params[:branchId])
    
    if !branch
      return render json: { success: false, message: 'Branch not found' }, status: :not_found
    end

    pickup = params[:pickupAddress]
    if !pickup
      return render json: { success: false, message: 'Pickup address required' }, status: :bad_request
    end

    # Format the addresses to search in Nominatim
    branch_address = branch.address
    
    # Format the addresses to search in Nominatim
    branch_address = branch.address
    
    begin
      branch_coords = geocode(branch_address)
      if !branch_coords
        # Try generic city if branch address fails
        branch_coords = geocode("Medan, Indonesia")
      end
      
      # Try 1: Exact coordinates from frontend auto-suggestion
      pickup_coords = nil
      if pickup[:lat].present? && pickup[:lng].present?
        pickup_coords = {
          lat: pickup[:lat].to_f,
          lon: pickup[:lng].to_f
        }
      else
        full_address = [
          pickup[:addressLine1],
          pickup[:addressLine2],
          pickup[:landmark],
          pickup[:city],
          pickup[:pincode]
        ].compact.reject(&:empty?).join(', ')
        pickup_coords = geocode(full_address)
      end

      # Try 2: Basic Address (Line 1 + City)
      if !pickup_coords
        basic_address = [pickup[:addressLine1], pickup[:city]].compact.reject(&:empty?).join(', ')
        pickup_coords = geocode(basic_address)
      end

      # Try 3: City only
      if !pickup_coords
        pickup_coords = geocode(pickup[:city] || 'Medan')
      end

      if branch_coords && pickup_coords
        # OSRM expects: {longitude},{latitude}
        distance_km = calculate_osrm_distance(branch_coords, pickup_coords)
        
        if distance_km
          charge = calculate_fee(distance_km)
          return render json: { 
            success: true, 
            data: { 
              distance: distance_km.round(1),
              deliveryCharge: charge,
              isServiceable: true,
              isFallback: false
            } 
          }
        end
      end
      
      # Fallback to pseudo-distance if geocoding fails (for demo purposes)
      addr_string = pickup[:addressLine1] || ""
      fallback_distance = [1.0, (addr_string.length % 10).to_f].max
      charge = calculate_fee(fallback_distance)
      
      render json: { 
        success: true, 
        data: { 
          distance: fallback_distance.round(1),
          deliveryCharge: charge,
          isServiceable: true,
          isFallback: true,
          message: "Real distance calculation failed, using estimate."
        } 
      }
    rescue => e
      render json: { success: false, message: e.message }, status: :internal_server_error
    end
  end

  private

  def calculate_fee(distance_km)
    rounded_km = distance_km.ceil
    if rounded_km <= 2
      return 0
    else
      return (rounded_km - 2) * 3000
    end
  end

  def geocode(address_string)
    uri = URI.parse("https://nominatim.openstreetmap.org/search")
    uri.query = URI.encode_www_form({
      q: address_string,
      format: 'json',
      limit: 1
    })

    request = Net::HTTP::Get.new(uri)
    request['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 KitaLaundry/1.0'

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      data = JSON.parse(response.body)
      if data && data.any?
        return {
          lat: data.first['lat'].to_f,
          lon: data.first['lon'].to_f
        }
      end
    end
    
    nil
  end

  def calculate_osrm_distance(coords1, coords2)
    # OSRM router endpoint
    # Format: /route/v1/driving/{lon},{lat};{lon},{lat}
    path = "/route/v1/driving/#{coords1[:lon]},#{coords1[:lat]};#{coords2[:lon]},#{coords2[:lat]}"
    uri = URI.parse("http://router.project-osrm.org#{path}?overview=false")

    response = Net::HTTP.get_response(uri)
    
    if response.is_a?(Net::HTTPSuccess)
      data = JSON.parse(response.body)
      if data['code'] == 'Ok' && data['routes'] && data['routes'].any?
        # OSRM returns distance in meters
        meters = data['routes'].first['distance'].to_f
        return meters / 1000.0
      end
    end
    
    nil
  end
end
